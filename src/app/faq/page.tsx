'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import Footer from '@/components/Footer';

const faqs = [
  {
    q: 'Hearten 係咩？',
    a: 'Hearten 係一個專為香港人而設嘅愛情討論平台。你可以喺度分享你嘅愛情經歷、睇法同疑問，同其他會員真誠交流。平台設有多個話題分類，包括戀愛中、暗戀、分手、婚姻等。',
  },
  {
    q: '點樣註冊成為會員？',
    a: '撳右上角「註冊」按鈕，輸入你嘅電郵地址、設定密碼同用戶名稱。系統會發送一封驗證電郵俾你，撳入面嘅連結就完成註冊。',
  },
  {
    q: '註冊需要提供咩資料？',
    a: '你只需要在註冊頁註冊。用戶名稱係你喺平台上嘅身份，其他會員會睇到你嘅名稱同 profile，登記電郵係保密的。',
  },
  {
    q: '我嘅私隱點樣受到保護？',
    a: '請參閱我哋嘅私隱政策頁面了解詳情。簡單嚟講，我哋唔會出售或分享你嘅個人資料，所有資料都儲存喺安全嘅雲端伺服器上。',
  },
  {
    q: '點樣發布貼文？',
    a: '登入後，喺左邊選單撳「寫心事」按鈕，或者直接去 /write 頁面。揀好話題分類、輸入標題同內容，撳「發布心事」就得。',
  },
  {
    q: '我可以刪除自己嘅貼文嗎？',
    a: '目前你可以透過「聯絡我們」申請刪除貼文。我哋會盡快處理你嘅請求。',
  },
  {
    q: '點樣回覆其他人嘅貼文？',
    a: '打開任何一篇貼文，喺頁面底部嘅留言區輸入你嘅回覆，撳「發送」即可。你亦可以回覆其他人嘅留言進行討論。',
  },
  {
    q: '咩係「俾心心」？',
    a: '心心係 Hearten 嘅讚好功能。如果你鍾意某篇貼文或留言，撳心心表示支持。心心越多，代表越多人鍾意。',
  },
  {
    q: '點樣切換日夜模式？',
    a: '撳右上角嘅太陽/月亮圖示就可以切換日夜模式。系統會記住你嘅偏好，下次返嚟唔使再 set。',
  },
  {
    q: '我遇到問題，點樣聯絡你哋？',
    a: '可以透過「聯絡我們」頁面提交查詢，或者留意日後公布嘅客服渠道。',
  },
  {
    q: 'Hearten 係免費嘅嗎？',
    a: '係，Hearten 完全免費。我哋希望提供一個開放嘅平台俾所有香港人使用。',
  },
  {
    q: '我可以改用戶名稱嗎？',
    a: '目前用戶名稱喺註冊後無法自行修改。如有特殊需要，請透過「聯絡我們」提出申請。',
  },
];

export default function FaqPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
          <h1 className="text-[22px] font-bold text-hearten-text mb-2">常見問題</h1>
          <p className="text-sm text-hearten-muted mb-8">關於 Hearten 嘅常見疑問，呢度應該搵到答案</p>

          <div className="space-y-3 max-w-3xl">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-hearten-card border border-hearten-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-hearten-card-hover transition-colors"
                >
                  <span className="text-base font-semibold text-hearten-text pr-4">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-hearten-muted shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-4 text-base text-hearten-muted leading-relaxed animate-fade-in">
                    {faq.a}
                  </div>
                )}
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
