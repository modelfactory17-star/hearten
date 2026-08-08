'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import CategoryGrid from '@/components/CategoryGrid';
import MemberGrid from '@/components/MemberGrid';
import HotTopicsGrid from '@/components/HotTopicsGrid';
import PollSection from '@/components/PollSection';
import PostFeed from '@/components/PostFeed';
import AdBanner from '@/components/AdBanner';
import Footer from '@/components/Footer';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-hearten-bg">
      <Header onMenuToggle={() => setMobileMenuOpen(v => !v)} />
      <div className="flex max-w-[1500px] mx-auto">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <LeftSidebar />
        </div>

        {/* Mobile sidebar overlay */}
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

        {/* Main Area */}
        <main className="flex-1 min-w-0 px-7 py-6 max-md:px-4">
          {/* Main Header */}
          <div className="mb-6">
            <h1 className="text-[22px] font-bold text-hearten-text mb-1">揀個話題，開始傾 💬</h1>
            <p className="text-sm text-hearten-muted">搵一個你關心嘅話題，睇吓其他香港人嘅故事、認識新朋友</p>
          </div>

          {/* Category Grid */}
          <SectionTitle emoji="📂" title="話題分類" />
          <CategoryGrid />

          {/* Member Section */}
          <SectionTitle emoji="👥" title="會員" subtitle="睇下人哋嘅故事 · 自由 inbox 交流" />
          <MemberGrid />

          {/* Hot Topics */}
          <SectionTitle emoji="📰" title="熱門話題" subtitle="時事 · 八卦 · 城中熱話" />
          <HotTopicsGrid />

          {/* Polls */}
          <SectionTitle emoji="📊" title="投票專區" subtitle="一齊表達意見" />
          <PollSection />

          {/* Ad Banner 728x90 */}
          <div className="mt-8">
            <AdBanner size="leaderboard" />
          </div>

          {/* Posts Feed */}
          <SectionTitle emoji="🔥" title="最新心事" />
          <PostFeed />
        </main>

        <RightSidebar />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

/** Reusable section title matching reference design */
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
