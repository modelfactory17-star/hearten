import { NextResponse } from 'next/server';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const headers = { apikey: KEY, Authorization: `Bearer ${KEY}` };

export async function GET() {
  try {
    const res = await fetch(
      `${URL}/rest/v1/profiles?select=id,username,emoji,bio,status,posts_count&order=created_at.desc&limit=8`,
      { headers }
    );
    const raw = await res.json();
    const members = (Array.isArray(raw) ? raw : []).map((p: Record<string, unknown>) => ({
      id: p.id,
      name: p.username || '會員',
      emoji: p.emoji || '🙋',
      bio: (p.bio as string) || '新會員，等緊同大家交流 💬',
      status: p.status || '在職',
      posts: (p.posts_count as number) || 0,
    }));
    return NextResponse.json(members);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
