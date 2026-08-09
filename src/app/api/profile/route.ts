import { NextRequest, NextResponse } from 'next/server';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    const username = request.nextUrl.searchParams.get('username');
    if (!username) {
      return NextResponse.json({ error: 'Missing username' }, { status: 400 });
    }

    // Get profile
    const profileRes = await fetch(
      `${URL}/rest/v1/profiles?select=id,username,emoji,avatar_url,bio,status,joined,posts_count,hearts_received&username=eq.${encodeURIComponent(username)}`,
      { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }
    );
    const profiles = await profileRes.json();
    const profile = Array.isArray(profiles) ? profiles[0] : null;
    if (!profile) return NextResponse.json(null);

    // Get user posts
    const postsRes = await fetch(
      `${URL}/rest/v1/posts?select=*,profiles!posts_user_id_fkey(username,emoji,avatar_url)&user_id=eq.${encodeURIComponent(profile.id)}&order=created_at.desc`,
      { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }
    );
    const posts = await postsRes.json();

    return NextResponse.json({ profile, posts });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
