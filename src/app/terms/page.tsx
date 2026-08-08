'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import Footer from '@/components/Footer';

export default function TermsPage() {
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
          <h1 className="text-[22px] font-bold text-hearten-text mb-2">使用條款及免責聲明</h1>
          <p className="text-sm text-hearten-muted mb-8">最後更新日期：2026年8月8日</p>

          <div className="space-y-8">
            <Section title="1. 接受條款">
              <p>使用 Hearten（下稱「本平台」）即表示你同意遵守本使用條款。如果你不同意任何條款，請停止使用本平台。</p>
            </Section>

            <Section title="2. 用戶資格">
              <p>你必須年滿 18 歲方可註冊使用本平台。部分內容涉及成人話題，未滿 18 歲者請勿使用。註冊時你須提供真實、準確的資料，並對你的帳戶安全負責。</p>
            </Section>

            <Section title="3. 用戶行為規範">
              <p>使用本平台時，你同意不會：</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>發布任何違法、誹謗、騷擾、威脅、仇恨或歧視性內容</li>
                <li>發布未經他人同意的個人資料或私隱資訊</li>
                <li>冒充他人或偽造身份</li>
                <li>發布垃圾訊息、廣告或未經授權的商業推廣</li>
                <li>上傳含有病毒或惡意程式碼的內容</li>
                <li>干擾或破壞本平台的正常運作</li>
                <li>未經授權收集其他用戶的個人資料</li>
                <li>發布任何侵犯知識產權的內容</li>
              </ul>
              <p className="mt-3">違反以上規範可能導致帳戶被暫停或永久終止，恕不另行通知。</p>
            </Section>

            <Section title="4. 用戶內容">
              <p>你保留你所發布內容的所有權。然而，當你發布內容到本平台時，你授予本平台非獨家、免版稅、全球性的許可，以展示和分發該內容。</p>
              <p className="mt-2">你對你所發布的內容負全部責任。本平台不對用戶發布的內容進行事前審查，但保留刪除任何違規內容的權利。</p>
            </Section>

            <Section title="5. 知識產權">
              <p>本平台的名稱、標誌、設計、程式碼和其他原創內容均受知識產權法保護。未經明確授權，不得複製、修改或分發本平台的任何部分。</p>
            </Section>

            <Section title="6. 免責聲明">
              <p className="font-semibold text-hearten-text">本平台按「現狀」提供服務，不作任何明示或暗示的保證。</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>本平台不保證服務不中斷、及時、安全或無錯誤</li>
                <li>本平台不對用戶發布內容的準確性、完整性或可靠性負責</li>
                <li>本平台上的任何建議或意見僅供參考，不構成專業建議（包括但不限於法律、醫療、心理諮詢）</li>
                <li>用戶之間的互動和交流由用戶自行承擔風險</li>
              </ul>
            </Section>

            <Section title="7. 責任限制">
              <p>在法律允許的最大範圍內，本平台及其營運者不對因使用或無法使用本平台而產生的任何直接、間接、附帶、特殊或後果性損害承擔責任，包括但不限於資料損失、利潤損失或聲譽損害。</p>
            </Section>

            <Section title="8. 第三方連結">
              <p>本平台可能包含第三方網站或服務的連結。這些第三方網站有其自身的使用條款和私隱政策，本平台對其內容或行為概不負責。</p>
            </Section>

            <Section title="9. 終止服務">
              <p>本平台保留隨時暫停或終止任何用戶帳戶的權利，毋須事先通知，特別是當用戶違反本使用條款時。用戶可隨時刪除自己的帳戶。</p>
            </Section>

            <Section title="10. 條款修改">
              <p>本平台保留隨時修改本使用條款的權利。重大變更會透過平台公告或電郵通知用戶。繼續使用本平台即表示接受修改後的條款。</p>
            </Section>

            <Section title="11. 適用法律">
              <p>本使用條款受香港特別行政區法律管轄，並按其解釋。任何因本條款引起的爭議，雙方同意提交香港法院的專屬管轄權。</p>
            </Section>

            <Section title="12. 聯絡我們">
              <p>如對本使用條款有任何疑問，請透過本平台「聯絡我們」頁面與我們聯繫。</p>
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
