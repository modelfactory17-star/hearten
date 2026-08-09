import { NextRequest, NextResponse } from 'next/server';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface CommentItem {
  id: string; postId: string; parentId: string | null;
  emoji: string; avatar_url: string | null; anonymous: string;
  body: string; time: string; hearts: number; isOP: boolean;
  replies?: CommentItem[];
}

export async function GET(request: NextRequest) {
  try {
    const postId = request.nextUrl.searchParams.get('post_id');
    if (!postId) {
      return NextResponse.json({ error: 'Missing post_id' }, { status: 400 });
    }

    const res = await fetch(
      `${URL}/rest/v1/comments?select=*,profiles!comments_user_id_fkey(username,emoji,avatar_url)&post_id=eq.${encodeURIComponent(postId)}&order=created_at.asc`,
      { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }
    );
    const data = await res.json();

    const comments: CommentItem[] = (Array.isArray(data) ? data : []).map((row: Record<string, unknown>) => ({
      id: row.id as string,
      postId: row.post_id as string,
      parentId: (row.parent_id as string) || null,
      emoji: ((row.profiles as Record<string, unknown> | null)?.emoji as string) || '🐱',
      avatar_url: ((row.profiles as Record<string, unknown> | null)?.avatar_url as string) || null,
      anonymous: ((row.profiles as Record<string, unknown> | null)?.username as string) || '匿名用戶',
      body: row.body as string,
      time: timeAgo(row.created_at as string),
      hearts: (row.hearts as number) || 0,
      isOP: (row.is_op as boolean) || false,
    }));

    // Nest replies
    const roots: CommentItem[] = [];
    const replyMap: Record<string, CommentItem[]> = {};
    for (const c of comments) {
      if (c.parentId) {
        if (!replyMap[c.parentId]) replyMap[c.parentId] = [];
        replyMap[c.parentId].push(c);
      } else {
        roots.push(c);
      }
    }
    for (const r of roots) {
      r.replies = replyMap[r.id] || [];
    }

    return NextResponse.json(roots);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

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
