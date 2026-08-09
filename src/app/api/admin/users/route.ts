import { NextResponse } from 'next/server';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  try {
    // Get profiles
    const profileRes = await fetch(
      `${URL}/rest/v1/profiles?select=id,username,emoji,joined`,
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
      posts: counts[p.id as string] || 0,
      joined: p.joined ? (p.joined as string).slice(0, 10) : '',
      status: 'active' as const,
    }));

    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
