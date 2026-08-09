import { NextResponse } from 'next/server';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);
  if (diffMin < 1) return '啱啱';
  if (diffMin < 60) return `${diffMin} 分鐘前`;
  if (diffHr < 24) return `${diffHr} 小時前`;
  if (diffDay < 7) return `${diffDay} 日前`;
  return date.toLocaleDateString('zh-HK', { month: 'short', day: 'numeric' });
}

export async function GET() {
  try {
    const res = await fetch(
      `${URL}/rest/v1/posts?select=*,profiles!posts_user_id_fkey(username,emoji,avatar_url)&order=created_at.desc`,
      { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }
    );
    const raw = await res.json();
    const data = (raw || []).map((row: Record<string, unknown>) => ({
      id: row.id,
      slug: row.slug || '',
      emoji: ((row.profiles as Record<string, unknown> | null)?.emoji as string) || (row.emoji as string) || '😔',
      avatar_url: ((row.profiles as Record<string, unknown> | null)?.avatar_url as string) || null,
      title: row.title,
      body: row.body,
      preview: (row.preview as string) || (row.body as string)?.slice(0, 120),
      category: row.category,
      categoryId: row.category_id,
      hearts: (row.hearts as number) || 0,
      replies: (row.replies as number) || 0,
      time: timeAgo(row.created_at as string),
      anonymous: ((row.profiles as Record<string, unknown> | null)?.username as string) || '匿名用戶',
    }));
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
