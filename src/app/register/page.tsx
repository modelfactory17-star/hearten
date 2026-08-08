'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import Footer from '@/components/Footer';

export default function RegisterPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRegister = () => {
    window.dispatchEvent(new Event('hearten:open-login'));
  };

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
          {/* Hero */}
          <div className="max-w-lg mx-auto text-center py-8">
            <div className="text-5xl mb-4">💌</div>
            <h1 className="text-[22px] font-bold text-hearten-text mb-3">註冊成為 Hearten 會員</h1>
            <p className="text-base text-hearten-muted mb-8 leading-relaxed">
              加入 Hearten，同香港人一齊傾愛情、分享經歷、認識新朋友。
            </p>

            {/* CTA */}
            <button
              onClick={handleRegister}
              className="px-8 py-3.5 rounded-xl bg-hearten-rose hover:bg-hearten-rose-light text-white text-base font-semibold transition-all duration-[0.15s] hover:-translate-y-[1px] mb-10"
            >
              立即註冊
            </button>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {[
                { icon: '📝', title: '發布心事', desc: '寫低你嘅愛情經歷，同其他會員交流' },
                { icon: '💬', title: '留言討論', desc: '回應貼文，參與社群對話' },
                { icon: '❤️', title: '俾心心', desc: '支持你鍾意嘅內容同會員' },
                { icon: '🔖', title: '收藏貼文', desc: 'save 低有意思嘅內容，隨時重溫' },
                { icon: '👤', title: '個人檔案', desc: '設定頭像同簡介，建立你嘅身份' },
                { icon: '🔒', title: '安全社群', desc: '嚴格版規保護，安心交流' },
              ].map((b) => (
                <div key={b.title} className="flex items-start gap-3 p-4 rounded-xl bg-hearten-card border border-hearten-border">
                  <span className="text-2xl shrink-0">{b.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-hearten-text mb-1">{b.title}</h3>
                    <p className="text-sm text-hearten-muted">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        <RightSidebar />
      </div>

      <Footer />
    </div>
  );
}
