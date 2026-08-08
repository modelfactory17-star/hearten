'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import Footer from '@/components/Footer';

export default function AdvertisePage() {
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
          <h1 className="text-[22px] font-bold text-hearten-text mb-2">廣告查詢</h1>
          <p className="text-sm text-hearten-muted mb-8">喺 Hearten 投放廣告，接觸香港年輕受眾</p>

          <div className="max-w-2xl space-y-8">
            {/* Why Hearten */}
            <section>
              <h2 className="text-lg font-bold text-hearten-text mb-4">📈 點解揀 Hearten？</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: '🎯', title: '精準受眾', desc: '香港 18-45 歲，關注戀愛、生活話題嘅活躍用戶' },
                  { icon: '💬', title: '高互動', desc: '用戶參與度高，留言同討論活躍' },
                  { icon: '📱', title: '多平台', desc: '桌面同手機版全面覆蓋' },
                ].map((item) => (
                  <div key={item.title} className="p-4 rounded-xl bg-hearten-card border border-hearten-border text-center">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <h3 className="text-sm font-bold text-hearten-text mb-1">{item.title}</h3>
                    <p className="text-sm text-hearten-muted">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Ad formats */}
            <section>
              <h2 className="text-lg font-bold text-hearten-text mb-4">📋 廣告形式</h2>
              <div className="space-y-3">
                {[
                  { format: 'Banner 廣告', size: '728×90 / 300×250', desc: '放置喺頁面頂部或側欄，適合品牌曝光' },
                  { format: '置頂貼文', size: '—', desc: '將你嘅內容置頂喺指定話題分類，直接觸達目標用戶' },
                  { format: '贊助話題', size: '—', desc: '冠名贊助熱門話題分類，深度連結品牌同目標社群' },
                ].map((ad) => (
                  <div key={ad.format} className="flex items-start gap-4 p-4 rounded-xl bg-hearten-card border border-hearten-border">
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-hearten-text mb-1">{ad.format}</h3>
                      <p className="text-sm text-hearten-muted">{ad.desc}</p>
                    </div>
                    <span className="text-xs text-hearten-dim shrink-0 mt-0.5">{ad.size}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-lg font-bold text-hearten-text mb-4">📩 查詢廣告報價</h2>
              <div className="bg-hearten-card border border-hearten-border rounded-xl p-6">
                <p className="text-base text-hearten-muted leading-relaxed mb-4">
                  有興趣喺 Hearten 投放廣告？請透過「聯絡我們」頁面提交查詢，提供以下資料：
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-hearten-muted">
                  <li>公司名稱同聯絡人資料</li>
                  <li>想投放嘅廣告形式</li>
                  <li>預算範圍同目標時段</li>
                  <li>目標受眾同宣傳目標</li>
                </ul>
                <p className="text-sm text-hearten-muted mt-4">
                  我哋會喺 3 個工作日內回覆，提供詳細報價同建議方案。
                </p>
              </div>
            </section>
          </div>
        </main>

        <RightSidebar />
      </div>

      <Footer />
    </div>
  );
}
