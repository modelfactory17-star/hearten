import { NextResponse } from 'next/server';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const headers = { apikey: KEY, Authorization: `Bearer ${KEY}` };

// 首頁「會員」欄顯示人數（維持 8，唔改）
const SHOW = 8;
// 一次過讀取上限。加咗活動排序之後，唔可以只取最新幾個 ——
// 否則有發文但較早加入嘅會員永遠唔會出現（2026-10-08 修正）
const SCAN = 300;

type Profile = Record<string, unknown>;

// 活動分數：發文權重最高，其次回覆、收到心心
function activityScore(p: Profile) {
  return (
    ((p.posts_count as number) || 0) * 3 +
    ((p.comments_count as number) || 0) * 2 +
    ((p.hearts_received as number) || 0)
  );
}

export async function GET() {
  try {
    const res = await fetch(
      `${URL}/rest/v1/profiles?select=id,username,emoji,bio,status,posts_count,comments_count,hearts_received,created_at,avatar_url&order=posts_count.desc&limit=${SCAN}`,
      { headers }
    );
    const raw = await res.json();
    const members = (Array.isArray(raw) ? raw : [])
      .sort((a: Profile, b: Profile) => {
        const diff = activityScore(b) - activityScore(a);
        if (diff !== 0) return diff;
        // 同分：較新加入優先
        return String(b.created_at ?? '').localeCompare(String(a.created_at ?? ''));
      })
      .slice(0, SHOW)
      .map((p: Profile) => ({
        id: p.id,
        name: p.username || '會員',
        emoji: p.emoji || '🙋',
        avatarUrl: (p.avatar_url as string) || null,
        bio: (p.bio as string) || '新會員，等緊同大家交流 💬',
        status: p.status || '在職',
        posts: (p.posts_count as number) || 0,
      }));
    return NextResponse.json(members);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
