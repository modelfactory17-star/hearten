'use client';

import { useState, useEffect } from 'react';
import { type Post } from '@/lib/db';
import FeedCard from '@/components/FeedCard';
import { useRouter } from 'next/navigation';

export default function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setQuery(params.get('q')?.trim() || '');
    }
    fetch('/api/posts')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data as Post[]);
        } else if (data && data.error) {
          setError(data.error);
        }
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filtered = query
    ? posts.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        (p.preview || '').toLowerCase().includes(query.toLowerCase()) ||
        (p.body || '').toLowerCase().includes(query.toLowerCase())
      )
    : posts;

  if (loading) {
    return <div className="flex justify-center py-12 text-hearten-muted text-base">加載中...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-400 text-base">載入失敗：{error}</div>;
  }

  if (query && filtered.length === 0) {
    return <div className="text-center py-12 text-hearten-muted text-base">搵唔到「{query}」相關嘅心事 😢</div>;
  }

  if (posts.length === 0) {
    return <div className="text-center py-12 text-hearten-muted text-base">暫時未有帖文，做第一個分享心事嘅人 💬</div>;
  }

  return (
    <>
      {query && (
        <p className="text-sm text-hearten-muted mb-3">搜尋「{query}」— {filtered.length} 個結果</p>
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
