import { NextResponse } from 'next/server';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  try {
    const res = await fetch(
      `${URL}/rest/v1/posts?select=*,profiles!posts_user_id_fkey(username,emoji,avatar_url)&order=created_at.desc`,
      { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
