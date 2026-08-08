'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import Footer from '@/components/Footer';

const SUBJECTS = [
  '帳戶查詢',
  '一般查詢',
  '廣告查詢',
  '合作提案',
  '版區事務',
  '提出意見',
  '其他查詢',
];

export default function ContactPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now just show success page
    setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-hearten-bg">
        <Header onMenuToggle={() => setMobileMenuOpen(v => !v)} />
        <div className="flex max-w-[1500px] mx-auto">
          <div className="hidden lg:block"><LeftSidebar /></div>
          <main className="flex-1 min-w-0 px-7 py-20 max-md:px-4 text-center">
            <div className="text-5xl mb-4">📬</div>
            <h1 className="text-[22px] font-bold text-hearten-text mb-2">已收到你嘅訊息</h1>
            <p className="text-base text-hearten-muted mb-8">我哋會盡快回覆你，一般喺 2-3 個工作日內。</p>
            <a href="/" className="text-sm text-hearten-rose hover:underline">返回首頁</a>
          </main>
          <RightSidebar />
        </div>
        <Footer />
      </div>
    );
  }

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
          <h1 className="text-[22px] font-bold text-hearten-text mb-2">聯絡我們</h1>
          <p className="text-sm text-hearten-muted mb-8">有問題或者建議？填妥以下表格，我哋會盡快回覆。</p>

          <div className="max-w-lg">
            <form onSubmit={handleSubmit} className="bg-hearten-card border border-hearten-border rounded-2xl p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-hearten-text mb-2">姓名</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="請輸入你嘅姓名"
                  className="w-full bg-hearten-bg border border-hearten-border rounded-lg px-4 py-3 text-base text-hearten-text placeholder-hearten-muted outline-none focus:border-hearten-rose transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-hearten-text mb-2">電郵</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full bg-hearten-bg border border-hearten-border rounded-lg px-4 py-3 text-base text-hearten-text placeholder-hearten-muted outline-none focus:border-hearten-rose transition-colors"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-hearten-text mb-2">查詢類別</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="w-full bg-hearten-bg border border-hearten-border rounded-lg px-4 py-3 text-base text-hearten-text outline-none focus:border-hearten-rose transition-colors appearance-none"
                >
                  <option value="" disabled>請選擇查詢類別</option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-hearten-text mb-2">訊息內容</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  placeholder="請詳細描述你嘅查詢..."
                  className="w-full bg-hearten-bg border border-hearten-border rounded-lg px-4 py-3 text-base text-hearten-text placeholder-hearten-muted outline-none resize-none focus:border-hearten-rose transition-colors"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-hearten-rose hover:bg-hearten-rose-light text-white text-base font-semibold transition-all duration-[0.15s] hover:-translate-y-[1px]"
              >
                發送訊息
              </button>
            </form>
          </div>
        </main>

        <RightSidebar />
      </div>

      <Footer />
    </div>
  );
}
