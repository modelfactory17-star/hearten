'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
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
          <h1 className="text-[22px] font-bold text-hearten-text mb-2">私隱政策</h1>
          <p className="text-sm text-hearten-muted mb-8">最後更新日期：2026年8月8日</p>

          <div className="space-y-8">
            <Section title="1. 引言">
              <p>Hearten（下稱「本平台」）尊重並保護用戶的個人資料私隱。本私隱政策說明我們如何收集、使用、披露和保護你的個人資料。使用本平台即表示你同意本政策的條款。</p>
            </Section>

            <Section title="2. 收集的資料">
              <p>當你註冊帳戶或使用本平台時，我們可能會收集以下資料：</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>電郵地址（用作帳戶註冊和驗證）</li>
                <li>用戶名稱和個人檔案資料（頭像、簡介）</li>
                <li>你發布的內容（貼文、留言）</li>
                <li>使用數據（瀏覽紀錄、互動紀錄）</li>
                <li>技術數據（IP 地址、瀏覽器類型、裝置資料）</li>
              </ul>
            </Section>

            <Section title="3. 資料用途">
              <p>我們收集的資料會用於以下目的：</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>提供和維護本平台服務</li>
                <li>驗證用戶身份和管理帳戶</li>
                <li>改善用戶體驗和平台功能</li>
                <li>偵測和防止濫用、欺詐或違規行為</li>
                <li>遵守法律要求和執法請求</li>
              </ul>
              <p className="mt-3">我們不會出售、出租或交易你的個人資料給第三方。</p>
            </Section>

            <Section title="4. 資料儲存和保安">
              <p>你的個人資料儲存在安全的雲端伺服器上。我們採取合理的技術和管理措施保護你的資料免受未經授權的存取、修改或刪除。</p>
              <p className="mt-2">請注意，沒有任何互聯網傳輸或電子儲存方式是 100% 安全的。雖然我們盡力保護你的資料，但無法保證絕對安全。</p>
            </Section>

            <Section title="5. 內容和公開資料">
              <p>你在本平台發布的貼文和留言是公開可見的。請謹慎考慮你分享的內容，避免披露敏感個人資料（如真實姓名、電話號碼、地址等）。本平台不對你自願公開的資料負責。</p>
            </Section>

            <Section title="6. Cookies">
              <p>本平台使用必要的 cookies 以維持登入狀態和記住你的偏好設定（例如日夜模式）。我們不使用第三方追蹤 cookies 或廣告 cookies。</p>
            </Section>

            <Section title="7. 第三方服務">
              <p>本平台使用第三方雲端服務供應商來提供資料庫、認證、電郵發送和平台托管等基礎設施服務。這些服務供應商有其自身的私隱政策，建議你查閱相關文件。</p>
            </Section>

            <Section title="8. 用戶權利">
              <p>你有權：</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>查閱、更正或刪除你的個人資料</li>
                <li>撤回同意（不影響撤回前已進行的處理）</li>
                <li>要求限制資料處理</li>
                <li>刪除帳戶及相關資料</li>
              </ul>
              <p className="mt-2">如需行使以上權利，請透過「聯絡我們」與我們聯繫。</p>
            </Section>

            <Section title="9. 資料保留">
              <p>我們會保留你的個人資料直至你刪除帳戶，或直至資料不再需要用於收集目的為止。刪除帳戶後，你的貼文和留言可能會保留但會被匿名化處理。</p>
            </Section>

            <Section title="10. 政策更新">
              <p>本平台保留隨時修改本私隱政策的權利。重大變更會透過平台公告或電郵通知用戶。建議定期查閱本頁以了解最新版本。</p>
            </Section>

            <Section title="11. 聯絡我們">
              <p>如對本私隱政策有任何疑問，請透過本平台「聯絡我們」頁面與我們聯繫。</p>
            </Section>
          </div>
        </main>

        <RightSidebar />
      </div>

      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-hearten-text mb-3">{title}</h2>
      <div className="text-base text-hearten-muted leading-relaxed space-y-2">
        {children}
      </div>
    </section>
  );
}
