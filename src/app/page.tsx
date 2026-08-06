'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Clock, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import FeedCard from '@/components/FeedCard';
import RightSidebar from '@/components/RightSidebar';
import CategoryGrid from '@/components/CategoryGrid';
import { posts as staticPosts } from '@/lib/data';
import { getUserPosts } from '@/lib/store';
import type { Post } from '@/lib/data';

type SortMode = 'trending' | 'latest';

export default function Home() {
  const [sort, setSort] = useState<SortMode>('trending');
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const router = useRouter();

  const refreshPosts = useCallback(() => {
    const userPosts = getUserPosts();
    // user posts first, then static posts (dedupe by id)
    const userIds = new Set(userPosts.map(p => p.id));
    const merged = [...userPosts, ...staticPosts.filter(p => !userIds.has(p.id))];
    setAllPosts(merged);
  }, []);

  useEffect(() => {
    refreshPosts();
    window.addEventListener('hearten:posts-updated', refreshPosts);
    return () => window.removeEventListener('hearten:posts-updated', refreshPosts);
  }, [refreshPosts]);

  const sortedPosts = [...allPosts].sort((a, b) => {
    if (sort === 'trending') return b.hearts - a.hearts;
    // sort by id: user posts (user-*) come before static posts
    return b.id.localeCompare(a.id);
  });

  return (
    <div className="min-h-screen bg-hearten-bg">
      <Header />

      <div className="flex max-w-[1400px] mx-auto">
        <LeftSidebar />

        <main className="flex-1 min-w-0 px-6 py-6">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-hearten-text mb-1">揀個話題，開始傾 💬</h1>
            <p className="text-sm text-hearten-muted">搵一個你關心嘅話題，睇吓其他香港人嘅故事、認識新朋友</p>
          </div>

          <CategoryGrid />

          <div className="flex items-center gap-3 my-8">
            <h2 className="text-sm font-bold text-hearten-muted uppercase tracking-wider">💬 最新心事</h2>
            <div className="flex-1 h-px bg-hearten-border" />
          </div>

          <div className="sticky top-14 z-40 bg-hearten-bg/90 backdrop-blur -mx-6 px-6 py-3 border-b border-hearten-border mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSort('trending')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    sort === 'trending'
                      ? 'bg-hearten-rose/10 text-hearten-rose'
                      : 'text-hearten-muted hover:text-hearten-text'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  熱門
                </button>
                <button
                  onClick={() => setSort('latest')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    sort === 'latest'
                      ? 'bg-hearten-rose/10 text-hearten-rose'
                      : 'text-hearten-muted hover:text-hearten-text'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  最新
                </button>
              </div>

              <button
                onClick={() => router.push('/write')}
                className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-hearten-rose text-white text-sm font-medium"
              >
                <MessageCircle className="w-4 h-4" />
                寫心事
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {sortedPosts.map((post) => (
              <FeedCard
                key={post.id}
                emoji={post.emoji}
                title={post.title}
                preview={post.preview}
                category={post.category}
                hearts={post.hearts}
                replies={post.replies}
                time={post.time}
                anonymous={post.anonymous}
                onClick={() => router.push(`/post/${post.id}`)}
              />
            ))}
          </div>

          <div className="py-6 text-center">
            <button className="px-6 py-2.5 rounded-xl border border-hearten-border text-sm text-hearten-muted hover:text-hearten-text hover:border-gray-500 transition-colors">
              載入更多心事...
            </button>
          </div>
        </main>

        <RightSidebar />
      </div>
    </div>
  );
}
