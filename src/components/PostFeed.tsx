'use client';

import { useState, useEffect } from 'react';
import { type Post } from '@/lib/db';
import FeedCard from '@/components/FeedCard';
import { useRouter } from 'next/navigation';

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

export default function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setQuery(params.get('q')?.trim() || '');
    }
    fetch('/api/posts')
      .then(r => r.json())
      .then((data: Array<Record<string, unknown>>) => {
        const mapped: Post[] = (data || []).map((row: Record<string, unknown>) => ({
          id: row.id as string,
          slug: (row.slug as string) || '',
          emoji: ((row.profiles as Record<string, unknown> | null)?.emoji as string) || (row.emoji as string) || '😔',
          avatar_url: ((row.profiles as Record<string, unknown> | null)?.avatar_url as string) || null,
          title: row.title as string,
          body: row.body as string,
          preview: (row.preview as string) || (row.body as string)?.slice(0, 120),
          category: row.category as string,
          categoryId: row.category_id as string,
          hearts: (row.hearts as number) || 0,
          replies: (row.replies as number) || 0,
          time: timeAgo(row.created_at as string),
          anonymous: ((row.profiles as Record<string, unknown> | null)?.username as string) || '匿名用戶',
        }));
        setPosts(mapped);
        setLoading(false);
      })
      .catch((err: Error) => {
        console.error('[PostFeed] Error:', err);
        setLoading(false);
      });
  }, []);

  const filtered = query
    ? posts.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.preview.toLowerCase().includes(query.toLowerCase()) ||
        p.body?.toLowerCase().includes(query.toLowerCase())
      )
    : posts;

  if (loading) {
    return (
      <div className="flex justify-center py-12 text-hearten-muted text-base">
        加載中...
      </div>
    );
  }

  if (query && filtered.length === 0) {
    return (
      <div className="text-center py-12 text-hearten-muted text-base">
        搵唔到「{query}」相關嘅心事 😢
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-hearten-muted text-base">
        暫時未有帖文，做第一個分享心事嘅人 💬
      </div>
    );
  }

  return (
    <>
      {query && (
        <p className="text-sm text-hearten-muted mb-3">
          搜尋「{query}」— {filtered.length} 個結果
        </p>
      )}
      <div className="flex flex-col gap-3">
        {filtered.map((post) => (
          <FeedCard
            key={post.id}
            id={post.id}
            emoji={post.emoji}
            avatar_url={post.avatar_url}
            title={post.title}
            preview={post.preview}
            category={post.category}
            hearts={post.hearts}
            replies={post.replies}
            time={post.time}
            anonymous={post.anonymous}
            onClick={() => router.push(`/post/${post.slug}`)}
          />
        ))}
      </div>
    </>
  );
}
