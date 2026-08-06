'use client';

import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import CategoryGrid from '@/components/CategoryGrid';
import MemberGrid from '@/components/MemberGrid';
import HotTopicsGrid from '@/components/HotTopicsGrid';
import PollSection from '@/components/PollSection';
import HotPostsList from '@/components/HotPostsList';
import AdBanner from '@/components/AdBanner';

export default function Home() {
  return (
    <div className="min-h-screen bg-hearten-bg">
      <Header />
      <div className="flex max-w-[1500px] mx-auto">
        <LeftSidebar />

        {/* Main Area */}
        <main className="flex-1 min-w-0 px-7 py-6 max-md:px-4">
          {/* Main Header */}
          <div className="mb-6">
            <h1 className="text-[22px] font-bold text-hearten-text mb-1">揀個話題，開始傾 💬</h1>
            <p className="text-[13.5px] text-hearten-muted">搵一個你關心嘅話題，睇吓其他香港人嘅故事、認識新朋友</p>
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

          {/* Hot Posts */}
          <SectionTitle emoji="🔥" title="熱門心事" />
          <HotPostsList />
        </main>

        <RightSidebar />
      </div>
    </div>
  );
}

/** Reusable section title matching reference design */
function SectionTitle({ emoji, title, subtitle }: { emoji: string; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-4 mt-8 first:mt-0">
      <h2 className="text-[17px] font-bold text-hearten-text flex-shrink-0">
        {emoji} {title}
      </h2>
      <div className="flex-1 h-px bg-hearten-border" />
      {subtitle && (
        <span className="text-xs text-hearten-dim font-normal flex-shrink-0">{subtitle}</span>
      )}
    </div>
  );
}
