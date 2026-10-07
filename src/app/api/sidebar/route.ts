import { NextResponse } from 'next/server';

export const runtime = 'edge';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const headers = { apikey: KEY, Authorization: `Bearer ${KEY}` };

export async function GET() {
  try {
    const [hotRes, newRes, allPostsRes] = await Promise.all([
      fetch(`${URL}/rest/v1/posts?select=id,slug,title,hearts,replies,images&order=hearts.desc&limit=12`, { headers, cache: 'no-store' }),
      fetch(`${URL}/rest/v1/profiles?select=id,username,emoji,status&order=created_at.desc&limit=3`, { headers }),
      fetch(`${URL}/rest/v1/posts?select=user_id,category_id,created_at,profiles!posts_user_id_fkey(username,emoji)`, { headers }),
    ]);

    const hotRaw = await hotRes.json();
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

    const newRaw = await newRes.json();
    const newMembers = (Array.isArray(newRaw) ? newRaw : []).map((p: Record<string, unknown>) => ({
      emoji: (p.emoji as string) || '🙋',
      text: `${(p.username as string) || '新會員'} · ${(p.status as string) || '在職'}`,
      id: p.id as string,
      username: (p.username as string) || '',
    }));

    const allPostsRaw = await allPostsRes.json();
    const posts = Array.isArray(allPostsRaw) ? allPostsRaw : [];

    // Active users — count by user_id using joined profile (single query, no loop)
    const postCounts: Record<string, { username: string; emoji: string; count: number }> = {};
    for (const p of posts) {
      const uid = p.user_id as string;
      const prof = p.profiles as { username?: string; emoji?: string } | null;
      if (!postCounts[uid]) postCounts[uid] = { username: prof?.username || '用戶', emoji: prof?.emoji || '🐱', count: 0 };
      postCounts[uid].count++;
    }
    const activeUsers = Object.values(postCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(u => ({ emoji: u.emoji, text: u.username, num: `${u.count} 帖`, id: '', username: u.username }));

    // Category counts — total + today
    const catIds = ['dating-life','crush','breakup','marriage','lgbtq','treehole','tarot','ziwei','work-love','school-love','family','dating-kit','bedroom'];
    const categoryStats: Record<string, { total: number; today: number }> = {};
    for (const cid of catIds) categoryStats[cid] = { total: 0, today: 0 };

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    // db category_id → URL slug（db 用短 id：work/school/dating，同 URL slug 唔同）
    const DB_TO_SLUG: Record<string, string> = {
      work: 'work-love',
      school: 'school-love',
      dating: 'dating-kit',
    };

    for (const p of posts) {
      const cid = (p.category_id as string) || '';
      const slug = DB_TO_SLUG[cid] || cid;
      if (categoryStats[slug]) {
        categoryStats[slug].total++;
        if ((p.created_at as string) >= todayStart) categoryStats[slug].today++;
      }
    }

    // 最新留言 — 兩步 fetch（comments → posts），唔靠 post FK 命名
    const cmtRes = await fetch(
      `${URL}/rest/v1/comments?select=id,body,created_at,post_id,profiles!comments_user_id_fkey(username,emoji)&order=created_at.desc&limit=6`,
      { headers, cache: 'no-store' }
    );
    const cmtRaw = await cmtRes.json();
    const cmts = Array.isArray(cmtRaw) ? cmtRaw : [];
    const postIds = Array.from(new Set(cmts.map((c: Record<string, unknown>) => c.post_id as string)));   // 唔可以用 [...new Set()]（tsconfig target ES5，build 會 fail）
    const postMap: Record<string, { title: string; slug: string }> = {};
    if (postIds.length) {
      const pRes = await fetch(
        `${URL}/rest/v1/posts?select=id,title,slug&id=in.(${postIds.join(',')})`,
        { headers, cache: 'no-store' }
      );
      const pRaw = await pRes.json();
      (Array.isArray(pRaw) ? pRaw : []).forEach((p: Record<string, unknown>) => {
        postMap[p.id as string] = { title: (p.title as string) || '', slug: (p.slug as string) || '' };
      });
    }
    const latestComments = cmts
      .filter((c: Record<string, unknown>) => postMap[c.post_id as string])
      .slice(0, 5)
      .map((c: Record<string, unknown>) => {
        const prof = c.profiles as { username?: string; emoji?: string } | null;
        return {
          emoji: prof?.emoji || '💬',
          name: prof?.username || '會員',
          body: ((c.body as string) || '').replace(/\s+/g, ' ').slice(0, 30),
          post: postMap[c.post_id as string].title.slice(0, 18),
          slug: postMap[c.post_id as string].slug,
        };
      });

    return NextResponse.json({ hotTopics, newMembers, activeUsers, latestComments, categoryStats }, {
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' }
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
