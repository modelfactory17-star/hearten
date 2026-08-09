import { NextRequest, NextResponse } from 'next/server';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface FriendRow {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: string;
  starred: boolean;
  blocked: boolean;
  created_at: string;
}

interface FriendProfile {
  id: string;
  username: string;
  emoji: string;
  avatar_url: string | null;
}

// ─── GET: list accepted friends for a user ─────────────────
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('user_id');
    if (!userId) return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });

    const res = await fetch(
      `${URL}/rest/v1/friendships?select=id,requester_id,addressee_id,status,starred,blocked,created_at&or=(requester_id.eq.${encodeURIComponent(userId)},addressee_id.eq.${encodeURIComponent(userId)})&status=eq.accepted&order=created_at.desc`,
      { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }
    );
    const friendships: FriendRow[] = await res.json();
    if (!Array.isArray(friendships)) return NextResponse.json([]);

    // Collect friend profile IDs
    const friendIds = friendships.map((f) =>
      f.requester_id === userId ? f.addressee_id : f.requester_id
    );

    // Fetch friend profiles
    let profiles: FriendProfile[] = [];
    if (friendIds.length > 0) {
      const ids = friendIds.map((id) => `id.eq.${encodeURIComponent(id)}`).join(',');
      const profileRes = await fetch(
        `${URL}/rest/v1/profiles?select=id,username,emoji,avatar_url&or=(${ids})`,
        { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }
      );
      profiles = await profileRes.json();
    }

    // Merge profile info into each friendship
    const result = friendships.map((f) => {
      const friendId = f.requester_id === userId ? f.addressee_id : f.requester_id;
      const profile = profiles.find((p) => p.id === friendId);
      return {
        id: f.id,
        friend: profile || null,
        starred: f.starred || false,
        blocked: f.blocked || false,
        created_at: f.created_at,
      };
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// ─── PATCH: star / block / delete ──────────────────────────
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, friendship_id } = body;

    if (!friendship_id) return NextResponse.json({ error: 'Missing friendship_id' }, { status: 400 });

    if (action === 'delete') {
      const res = await fetch(
        `${URL}/rest/v1/friendships?id=eq.${encodeURIComponent(friendship_id)}`,
        { method: 'DELETE', headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }
      );
      if (!res.ok) return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    // star / unstar
    if (action === 'star') {
      const getRes = await fetch(
        `${URL}/rest/v1/friendships?select=starred&id=eq.${encodeURIComponent(friendship_id)}`,
        { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }
      );
      const rows: { starred: boolean }[] = await getRes.json();
      const current = Array.isArray(rows) && rows[0] ? rows[0].starred : false;

      await fetch(
        `${URL}/rest/v1/friendships?id=eq.${encodeURIComponent(friendship_id)}`,
        { method: 'PATCH', headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ starred: !current }) }
      );
      return NextResponse.json({ ok: true, starred: !current });
    }

    // block / unblock
    if (action === 'block') {
      const getRes = await fetch(
        `${URL}/rest/v1/friendships?select=blocked&id=eq.${encodeURIComponent(friendship_id)}`,
        { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }
      );
      const rows: { blocked: boolean }[] = await getRes.json();
      const current = Array.isArray(rows) && rows[0] ? rows[0].blocked : false;

      await fetch(
        `${URL}/rest/v1/friendships?id=eq.${encodeURIComponent(friendship_id)}`,
        { method: 'PATCH', headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ blocked: !current }) }
      );
      return NextResponse.json({ ok: true, blocked: !current });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
