'use client';

import { Fragment, useState, useEffect } from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import CategoryGrid from '@/components/CategoryGrid';
import MemberGrid from '@/components/MemberGrid';
import HotTopicsGrid from '@/components/HotTopicsGrid';
import PollSection from '@/components/PollSection';
import LoveWiseCard from '@/components/LoveWiseCard';
import Footer from '@/components/Footer';
import FeedCard from '@/components/FeedCard';
import SectionHeading from '@/components/SectionHeading';
import { FolderOpen, Users, Newspaper, BarChart3, Flame } from 'lucide-react';
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
            <h1 className="text-2xl font-bold text-hearten-text mb-1">揀個話題，開始傾</h1>
            <p className="text-sm text-hearten-muted">搵一個你關心嘅話題，睇吓其他香港人嘅故事、認識新朋友</p>
          </div>

          <SectionHeading icon={FolderOpen} title="話題分類" divider className="mb-4 mt-8 first:mt-0" />
          <CategoryGrid />

          <SectionHeading icon={Users} title="會員" subtitle="睇下人哋嘅故事 · 自由 inbox 交流" divider className="mb-4 mt-8 first:mt-0" />
          <MemberGrid />

          <SectionHeading icon={Newspaper} title="熱門話題" subtitle="時事 · 八卦 · 城中熱話" divider className="mb-4 mt-8 first:mt-0" />
          <HotTopicsGrid />

          <SectionHeading icon={BarChart3} title="投票專區" subtitle="一齊表達意見" divider className="mb-4 mt-8 first:mt-0" />
          <PollSection />

          {/* Posts Feed — inline */}
          <SectionHeading icon={Flame} title="最新心事" divider className="mb-4 mt-8 first:mt-0" />

          {loading ? (
            <div className="flex justify-center py-12 text-hearten-muted text-base">加載中...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-hearten-muted text-base">暫時未有帖文，做第一個分享心事嘅人 💬</div>
          ) : (
            <div className="flex flex-col gap-3">
              {posts.slice(0, 10).map((post, i) => (
                <Fragment key={post.id}>
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
                {i === 2 && <LoveWiseCard variant="feed" />}
                </Fragment>
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

