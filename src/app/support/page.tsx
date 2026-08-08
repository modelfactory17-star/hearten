'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import Footer from '@/components/Footer';

export default function SupportPage() {
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
          <h1 className="text-[22px] font-bold text-hearten-text mb-2">客服查詢</h1>
          <p className="text-sm text-hearten-muted mb-8">有問題？我哋喺度幫你。</p>

          <div className="max-w-2xl space-y-8">
            {/* Quick links */}
            <section>
              <h2 className="text-lg font-bold text-hearten-text mb-4">🔍 快速搵答案</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: '常見問題', href: '/faq', desc: '註冊、發文、帳戶相關' },
                  { label: '會員功能', href: '/features', desc: '了解 Hearten 所有功能' },
                  { label: '私隱政策', href: '/privacy', desc: '資料點樣處理同保護' },
                  { label: '使用條款', href: '/terms', desc: '平台規則同免責聲明' },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block p-4 rounded-xl bg-hearten-card border border-hearten-border hover:border-hearten-rose transition-colors"
                  >
                    <div className="text-sm font-semibold text-hearten-text mb-1">{link.label}</div>
                    <div className="text-sm text-hearten-muted">{link.desc}</div>
                  </a>
                ))}
              </div>
            </section>

            {/* Contact info */}
            <section>
              <h2 className="text-lg font-bold text-hearten-text mb-4">📬 聯絡客服</h2>
              <div className="bg-hearten-card border border-hearten-border rounded-xl p-6 space-y-4">
                <p className="text-base text-hearten-muted leading-relaxed">
                  如需進一步協助，請透過「聯絡我們」頁面提交查詢。我哋嘅客服團隊會盡快回覆你。
                </p>
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-hearten-text">提交查詢時請提供：</h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm text-hearten-muted">
                    <li>你嘅用戶名稱</li>
                    <li>遇到嘅問題嘅詳細描述</li>
                    <li>相關嘅貼文連結（如適用）</li>
                    <li>截圖（如有助說明問題）</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Response time */}
            <section>
              <h2 className="text-lg font-bold text-hearten-text mb-4">⏱️ 回覆時間</h2>
              <div className="bg-hearten-card border border-hearten-border rounded-xl p-6">
                <p className="text-base text-hearten-muted leading-relaxed">
                  我哋會喺收到查詢後盡快處理。一般查詢會喺 2-3 個工作日內回覆。複雜個案可能需要較長時間，請耐心等候。
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
