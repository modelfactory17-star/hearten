import { NextResponse } from 'next/server';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const headers = { apikey: KEY, Authorization: `Bearer ${KEY}` };

export async function GET() {
  try {
    // 1. Hot topics — top posts by hearts (emoji comes from default, not posts table)
    const hotRes = await fetch(
      `${URL}/rest/v1/posts?select=id,slug,title,hearts,replies,images&order=hearts.desc&limit=12`,
      { headers, cache: 'no-store' }
    );
    const hotRaw = await hotRes.json();
    // Deduplicate by title, keep only first occurrence
    const seen = new Set<string>();
    const hotTopics = (Array.isArray(hotRaw) ? hotRaw : [])
      .filter((p: Record<string, unknown>) => {
        const key = (p.title as string) || '';
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 6)
      .map((p: Record<string, unknown>) => ({
        emoji: (p.emoji as string) || '💬',
        text: (p.title as string)?.slice(0, 18) || '熱門話題',
        num: `${((p.hearts as number) || 0) + ((p.replies as number) || 0)} 互動`,
        slug: (p.slug as string) || '',
        image: ((p.images as string[])?.[0]) || null,
      }));

    // 2. Newest members
    const newRes = await fetch(
      `${URL}/rest/v1/profiles?select=id,username,emoji,status&order=created_at.desc&limit=3`,
      { headers }
    );
    const newRaw = await newRes.json();
    const newMembers = (Array.isArray(newRaw) ? newRaw : []).map((p: Record<string, unknown>) => ({
      emoji: (p.emoji as string) || '🙋',
      text: `${(p.username as string) || '新會員'} · ${(p.status as string) || '在職'}`,
      id: p.id as string,
      username: (p.username as string) || '',
    }));

    // 3. Active users — by post count (direct count for reliability)
    const postsRes = await fetch(
      `${URL}/rest/v1/posts?select=user_id`,
      { headers }
    );
    const postsRaw = await postsRes.json();
    const postCounts: Record<string, number> = {};
    if (Array.isArray(postsRaw)) {
      for (const p of postsRaw) {
        const uid = p.user_id as string;
        postCounts[uid] = (postCounts[uid] || 0) + 1;
      }
    }
    // Get profile details for top users
    const topUsers = Object.entries(postCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    const activeUsers = [];
    for (const [uid, count] of topUsers) {
      const profRes = await fetch(
        `${URL}/rest/v1/profiles?select=id,username,emoji&id=eq.${uid}`,
        { headers }
      );
      const profData = await profRes.json();
      const prof = Array.isArray(profData) ? profData[0] : profData;
      if (prof) {
        activeUsers.push({
          emoji: (prof.emoji as string) || '🐱',
          text: (prof.username as string) || '用戶',
          num: `${count} 帖`,
          id: prof.id as string,
          username: (prof.username as string) || '',
        });
      }
    }

    return NextResponse.json({ hotTopics, newMembers, activeUsers }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
