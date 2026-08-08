'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import Footer from '@/components/Footer';
import FeedCard from '@/components/FeedCard';
import { db, type Post } from '@/lib/db';

export default function EditorsPicksPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    db.posts.list().then((data) => {
      // Sort by hearts descending for editor's picks
      const sorted = [...data].sort((a, b) => b.hearts - a.hearts).slice(0, 20);
      setPosts(sorted);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-hearten-bg">
      <Header onMenuToggle={() => setMobileMenuOpen(v => !v)} />

      <div className="flex max-w-[1500px] mx-auto">
        <div className="hidden lg:block">
          <LeftSidebar />
        </div>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-[260px] bg-hearten-bg shadow-xl animate-slide-in overflow-y-auto">
              <div className="flex justify-end p-3">
                <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-hearten-card text-hearten-muted">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
              <LeftSidebar />
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0 px-7 py-8 max-md:px-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">⭐</span>
            <h1 className="text-[22px] font-bold text-hearten-text">編輯精選</h1>
          </div>
          <p className="text-sm text-hearten-muted mb-8">最多心心嘅優質貼文，值得一睇再睇</p>

          {loading ? (
            <div className="text-hearten-muted text-center py-12">載入中…</div>
          ) : posts.length === 0 ? (
            <div className="text-hearten-muted text-center py-12">暫時未有精選內容</div>
          ) : (
            <div className="space-y-3">
              {posts.map((post, i) => (
                <div key={post.id} className="flex items-start gap-3">
                  <span className="text-2xl font-bold text-hearten-dim shrink-0 w-8 text-right">
                    {i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${i + 1}`}
                  </span>
                  <div className="flex-1">
                    <FeedCard
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
                      onClick={() => router.push(`/post/${post.id}`)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <RightSidebar />
      </div>

      <Footer />
    </div>
  );
}
