'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import Footer from '@/components/Footer';
import { db } from '@/lib/db';

interface RecentComment {
  id: string;
  body: string;
  author: string;
  post: string;
  time: string;
}

export default function RecentCommentsPage() {
  const [comments, setComments] = useState<RecentComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    db.admin.comments().then((data) => {
      setComments(data);
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
            <span className="text-3xl">💬</span>
            <h1 className="text-[22px] font-bold text-hearten-text">最新留言</h1>
          </div>
          <p className="text-sm text-hearten-muted mb-8">實時睇住社群嘅最新討論</p>

          {loading ? (
            <div className="text-hearten-muted text-center py-12">載入中…</div>
          ) : comments.length === 0 ? (
            <div className="text-hearten-muted text-center py-12">暫時未有留言</div>
          ) : (
            <div className="space-y-3 max-w-2xl">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-hearten-card border border-hearten-border hover:border-hearten-rose transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-hearten-text">{c.author}</span>
                    <span className="text-xs text-hearten-dim">{c.time}</span>
                  </div>
                  <p className="text-base text-hearten-muted mb-2 line-clamp-2">{c.body}</p>
                  <div className="text-sm text-hearten-dim">
                    於貼文「<span className="text-hearten-rose">{c.post}</span>」
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
