'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import CategoryGrid from '@/components/CategoryGrid';
import MemberGrid from '@/components/MemberGrid';
import HotTopicsGrid from '@/components/HotTopicsGrid';
import PollSection from '@/components/PollSection';
import AdBanner from '@/components/AdBanner';
import Footer from '@/components/Footer';
import FeedCard from '@/components/FeedCard';
import { useRouter } from 'next/navigation';

interface PostItem {
  id: string; slug: string; emoji: string; avatar_url: string | null;
  title: string; body: string; preview: string; category: string; categoryId: string;
  hearts: number; replies: number; time: string; anonymous: string;
  images?: string[];
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/posts')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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

        <main className="flex-1 min-w-0 px-7 py-6 max-md:px-4">
          <div className="mb-6">
            <h1 className="text-[22px] font-bold text-hearten-text mb-1">揀個話題，開始傾 💬</h1>
            <p className="text-sm text-hearten-muted">搵一個你關心嘅話題，睇吓其他香港人嘅故事、認識新朋友</p>
          </div>

          <SectionTitle emoji="📂" title="話題分類" />
          <CategoryGrid />

          <SectionTitle emoji="👥" title="會員" subtitle="睇下人哋嘅故事 · 自由 inbox 交流" />
          <MemberGrid />

          <SectionTitle emoji="📰" title="熱門話題" subtitle="時事 · 八卦 · 城中熱話" />
          <HotTopicsGrid />

          <SectionTitle emoji="📊" title="投票專區" subtitle="一齊表達意見" />
          <PollSection />

          <div className="mt-8">
            <AdBanner size="leaderboard" />
          </div>

          {/* Posts Feed — inline */}
          <SectionTitle emoji="🔥" title="最新心事" />

          {loading ? (
            <div className="flex justify-center py-12 text-hearten-muted text-base">加載中...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-hearten-muted text-base">暫時未有帖文，做第一個分享心事嘅人 💬</div>
          ) : (
            <div className="flex flex-col gap-3">
              {posts.slice(0, 10).map((post) => (
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
                  images={post.images}
                  onClick={() => router.push(`/post/${post.slug}`)}
                />
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

function SectionTitle({ emoji, title, subtitle }: { emoji: string; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-4 mt-8 first:mt-0">
      <h2 className="text-lg font-bold text-hearten-text flex-shrink-0">
        {emoji} {title}
      </h2>
      <div className="flex-1 h-px bg-hearten-border" />
      {subtitle && (
        <span className="text-sm text-hearten-dim font-normal flex-shrink-0">{subtitle}</span>
      )}
    </div>
  );
}
