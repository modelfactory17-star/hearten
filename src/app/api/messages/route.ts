import { NextRequest, NextResponse } from 'next/server';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const RESEND_KEY = process.env.RESEND_API_KEY || '';
const HEARTEN_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hearten.com.hk';

async function sendMessageEmail(senderId: string, receiverId: string, text: string) {
  if (!RESEND_KEY) return;

  // Get receiver's profile + email
  const [profileRes, senderRes] = await Promise.all([
    fetch(`${URL}/rest/v1/profiles?select=id,username,message_notifications&id=eq.${encodeURIComponent(receiverId)}`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
    }),
    fetch(`${URL}/rest/v1/profiles?select=id,username&id=eq.${encodeURIComponent(senderId)}`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
    }),
  ]);

  const profiles = await profileRes.json();
  const senders = await senderRes.json();
  const receiver = Array.isArray(profiles) ? profiles[0] : null;
  const sender = Array.isArray(senders) ? senders[0] : null;

  if (!receiver || !receiver.message_notifications) return;

  // Get receiver's email from auth
  const authRes = await fetch(
    `${URL}/auth/v1/admin/users/${encodeURIComponent(receiverId)}`,
    { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }
  );
  const authUser = await authRes.json();
  const email = authUser?.email;
  if (!email) return;

  const senderName = sender?.username || 'Hearten 會員';
  const preview = text.length > 80 ? text.slice(0, 80) + '...' : text;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Hearten <noreply@hearten.com.hk>',
      to: email,
      subject: `${senderName} 傳送咗新訊息俾你 - Hearten`,
      text: `${senderName} 傳送咗訊息俾你：\n\n"${text}"\n\n去 Hearten 睇訊息：${HEARTEN_URL}/messages\n\n---\n你可以在 Hearten 個人設定中關閉訊息通知。\n此電郵由 Hearten 自動發送，請勿回覆。`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <p style="color: #374151; font-size: 16px;"><strong>${senderName}</strong> 傳送咗訊息俾你：</p>
          <div style="background: #f3f4f6; border-radius: 12px; padding: 16px; margin: 16px 0;">
            <p style="color: #1f2937; margin: 0; line-height: 1.6;">${preview}</p>
          </div>
          <a href="${HEARTEN_URL}/messages" style="display: inline-block; background: #e11d48; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            去 Hearten 睇訊息
          </a>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
            你可以在 Hearten 個人設定中關閉訊息通知。
          </p>
        </div>
      `,
    }),
  });
}

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
      const saved = Array.isArray(result) ? result[0] : result;

      // ── Send email notification to receiver (non-blocking) ──
      if (res.ok) {
        sendMessageEmail(sender_id, receiver_id, text).catch(() => {});
      }

      return NextResponse.json({ ok: res.ok, message: saved });
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
