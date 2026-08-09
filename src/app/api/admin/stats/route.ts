import { NextResponse } from 'next/server';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function count(table: string): Promise<number> {
  const res = await fetch(
    `${URL}/rest/v1/${table}?select=count`,
    { headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, Prefer: 'count=exact' } }
  );
  // Supabase returns count in content-range header for count=exact
  const range = res.headers.get('content-range');
  if (range) {
    const parts = range.split('/');
    return parseInt(parts[1]) || 0;
  }
  return 0;
}

export async function GET() {
  try {
    const [users, posts, comments, hearts] = await Promise.all([
      count('profiles'),
      count('posts'),
      count('comments'),
      count('likes'),
    ]);
    return NextResponse.json({ users, posts, comments, hearts });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
