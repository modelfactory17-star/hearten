import { NextRequest, NextResponse } from 'next/server';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// ─── GET: list conversations, or get one conversation ──────
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('user_id');
    const withId = request.nextUrl.searchParams.get('with');

    if (!userId) return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });

    // ── Get one conversation ──
    if (withId) {
      const res = await fetch(
        `${URL}/rest/v1/messages?select=*&or=(sender_id.eq.${encodeURIComponent(userId)},receiver_id.eq.${encodeURIComponent(userId)})&or=(sender_id.eq.${encodeURIComponent(withId)},receiver_id.eq.${encodeURIComponent(withId)})&order=created_at.asc`,
        { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }
      );
      const messages = await res.json();
      return NextResponse.json(Array.isArray(messages) ? messages : []);
    }

    // ── List conversations ──
    // Get all messages involving this user
    const res = await fetch(
      `${URL}/rest/v1/messages?select=*&or=(sender_id.eq.${encodeURIComponent(userId)},receiver_id.eq.${encodeURIComponent(userId)})&order=created_at.desc&limit=500`,
      { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }
    );
    const allMessages = await res.json();
    if (!Array.isArray(allMessages)) return NextResponse.json([]);

    // Group by conversation partner
    const conversations: Record<string, {
      partnerId: string;
      lastMessage: string;
      lastTime: string;
      unread: number;
    }> = {};

    for (const msg of allMessages) {
      const partnerId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
      if (!conversations[partnerId]) {
        conversations[partnerId] = {
          partnerId,
          lastMessage: msg.body || '',
          lastTime: msg.created_at,
          unread: 0,
        };
      }
      if (msg.receiver_id === userId && !msg.read) {
        conversations[partnerId].unread++;
      }
    }

    // Fetch partner profiles
    const partnerIds = Object.keys(conversations);
    let profiles: Record<string, unknown>[] = [];
    if (partnerIds.length > 0) {
      const ids = partnerIds.map((id) => `id.eq.${encodeURIComponent(id)}`).join(',');
      const profileRes = await fetch(
        `${URL}/rest/v1/profiles?select=id,username,emoji,avatar_url&or=(${ids})`,
        { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }
      );
      profiles = await profileRes.json();
      if (!Array.isArray(profiles)) profiles = [];
    }

    // Merge
    const result = partnerIds.map((pid) => {
      const conv = conversations[pid];
      const profile = profiles.find((p: Record<string, unknown>) => p.id === pid);
      return {
        partnerId: pid,
        partner: profile || null,
        lastMessage: conv.lastMessage,
        lastTime: conv.lastTime,
        unread: conv.unread,
      };
    });

    // Sort by last message time descending
    result.sort((a, b) => b.lastTime.localeCompare(a.lastTime));

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// ─── POST: send message or mark as read ────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, sender_id, receiver_id, text, user_id } = body;

    // ── Send message ──
    if (action === 'send') {
      if (!sender_id || !receiver_id || !text) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
      }
      const res = await fetch(
        `${URL}/rest/v1/messages`,
        {
          method: 'POST',
          headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
          body: JSON.stringify({ sender_id, receiver_id, body: text }),
        }
      );
      const result = await res.json();
      return NextResponse.json({ ok: res.ok, message: Array.isArray(result) ? result[0] : result });
    }

    // ── Mark as read ──
    if (action === 'read' && user_id) {
      const partnerId = body.partner_id;
      if (!partnerId) return NextResponse.json({ error: 'Missing partner_id' }, { status: 400 });

      await fetch(
        `${URL}/rest/v1/messages?receiver_id=eq.${encodeURIComponent(user_id)}&sender_id=eq.${encodeURIComponent(partnerId)}&read=eq.false`,
        {
          method: 'PATCH',
          headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ read: true }),
        }
      );
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
