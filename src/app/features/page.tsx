'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import Footer from '@/components/Footer';

const features = [
  {
    icon: '📝',
    title: '發布心事',
    desc: '將你嘅愛情故事、煩惱同經歷寫出嚟，同其他會員分享交流。揀好話題分類，寫個標題，輸入您想講嘅嘢 — 就係咁簡單。',
  },
  {
    icon: '💬',
    title: '留言討論',
    desc: '回應其他人嘅貼文，俾意見、分享經驗、或者純粹打氣。建設性嘅討論令社群更有溫度。',
  },
  {
    icon: '❤️',
    title: '俾心心',
    desc: '鍾意某篇貼文或留言？俾個心心表達支持。心心越多，貼文越多人睇到。',
  },
  {
    icon: '🔖',
    title: '收藏貼文',
    desc: '見到有意思嘅貼文想之後再睇？一 click 收藏，以後喺你嘅收藏夾隨時搵得返。',
  },
  {
    icon: '👤',
    title: '個人檔案',
    desc: '設定你嘅頭像、簡介同性質狀態，等其他會員認識你。你嘅 profile 就係你嘅身份。',
  },
  {
    icon: '🔍',
    title: '搜尋心事',
    desc: '用關鍵字搜尋全站貼文，快速搵到你關心嘅話題同內容。',
  },
  {
    icon: '📊',
    title: '投票功能',
    desc: '參與社群投票，表達你嘅意見。睇下其他香港人點樣諗，了解大家嘅想法。',
  },
  {
    icon: '🌙',
    title: '日夜模式',
    desc: '一 click 切換日間同夜間模式。夜晚睇唔傷眼，日頭睇得清楚。',
  },
  {
    icon: '📂',
    title: '話題分類',
    desc: '戀愛中、暗戀、分手、婚姻、LGBTQ+…超過 10 個話題分類，總有一個啱你。',
  },
];

export default function FeaturesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <h1 className="text-[22px] font-bold text-hearten-text mb-2">會員功能</h1>
          <p className="text-sm text-hearten-muted mb-8">了解 Hearten 為會員提供嘅所有功能</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title} className="bg-hearten-card border border-hearten-border rounded-xl p-5 hover:border-hearten-rose transition-colors">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-base font-bold text-hearten-text mb-2">{f.title}</h3>
                <p className="text-sm text-hearten-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </main>

        <RightSidebar />
      </div>

      <Footer />
    </div>
  );
}
