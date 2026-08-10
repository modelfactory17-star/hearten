import { NextResponse } from 'next/server';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  try {
    // Get profiles
    const profileRes = await fetch(
      `${URL}/rest/v1/profiles?select=id,username,emoji,joined,bio,status`,
      { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }
    );
    const profiles = await profileRes.json();

    // Get post counts per user
    const postRes = await fetch(
      `${URL}/rest/v1/posts?select=user_id`,
      { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }
    );
    const posts = await postRes.json();

    const counts: Record<string, number> = {};
    for (const p of (Array.isArray(posts) ? posts : [])) {
      counts[p.user_id] = (counts[p.user_id] || 0) + 1;
    }

    const users = (Array.isArray(profiles) ? profiles : []).map((p: Record<string, unknown>) => ({
      id: p.id as string,
      username: p.username as string,
      emoji: (p.emoji as string) || '🐱',
      bio: (p.bio as string) || '',
      profile_status: (p.status as string) || '',
      posts: counts[p.id as string] || 0,
      joined: p.joined ? (p.joined as string).slice(0, 10) : '',
      status: 'active' as const,
    }));

    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, username, emoji, bio, status, avatar_url } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const updates: Record<string, string> = {};
    if (username !== undefined) updates.username = username;
    if (emoji !== undefined) updates.emoji = emoji;
    if (bio !== undefined) updates.bio = bio;
    if (status !== undefined) updates.status = status;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;

    const res = await fetch(`${URL}/rest/v1/profiles?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
