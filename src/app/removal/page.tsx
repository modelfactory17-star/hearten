'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import Footer from '@/components/Footer';

export default function RemovalPage() {
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
          <h1 className="text-[22px] font-bold text-hearten-text mb-2">移除政策</h1>
          <p className="text-sm text-hearten-muted mb-8">最後更新日期：2026年8月8日</p>

          <div className="space-y-8">
            <Section title="1. 概述">
              <p>本平台致力維護一個安全、尊重和友善的討論環境。當有用戶發布不當內容，或有人認為平台上的內容侵犯其權益時，可依據本移除政策提出申訴。我們會按情況審核並採取適當行動。</p>
            </Section>

            <Section title="2. 可被移除的內容">
              <p>以下類型的內容可能會被移除：</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>未經他人同意披露其個人資料（起底）</li>
                <li>誹謗、侮辱或騷擾性言論</li>
                <li>仇恨言論或歧視性內容（基於種族、性別、性取向、宗教、殘疾等）</li>
                <li>侵犯知識產權的內容（未經授權使用他人的圖片、文字、音樂等）</li>
                <li>未經同意發布的私密影像或個人通訊紀錄</li>
                <li>垃圾訊息、惡意連結或詐騙內容</li>
                <li>違反香港法律的內容</li>
                <li>含有惡意程式碼或病毒的連結</li>
              </ul>
            </Section>

            <Section title="3. 申訴資格">
              <p>你可提出移除申訴的情況包括：</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>你是被侵權內容的當事人或其授權代表</li>
                <li>你發現平台上有違反本平台使用條款的內容</li>
                <li>你認為某內容對你構成直接威脅或傷害</li>
              </ul>
              <p className="mt-2">請注意，單純不同意他人觀點並不構成有效的移除理由。我們尊重言論自由和不同意見的表達。</p>
            </Section>

            <Section title="4. 申訴程序">
              <p>請透過「聯絡我們」頁面提交移除申訴，並提供以下資料：</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>你的姓名和聯絡方式</li>
                <li>需要移除的內容之具體網址（URL）</li>
                <li>詳細說明該內容如何違反政策或侵犯你的權益</li>
                <li>如涉及知識產權侵權，請提供相關證明（如版權登記編號、原創發布日期等）</li>
                <li>如你是代他人申訴，請提供授權證明</li>
              </ul>
            </Section>

            <Section title="5. 審核流程">
              <p>收到申訴後，我們會按以下流程處理：</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>初步審核：確認申訴資料是否完整（一般於 3 個工作日內完成）</li>
                <li>內容審查：評估該內容是否確實違反平台政策或法律</li>
                <li>決定：移除內容、拒絕申訴，或要求內容發布者修改</li>
                <li>通知：將審核結果通知申訴人及（如適用）內容發布者</li>
              </ul>
              <p className="mt-2">處理時間視乎案件複雜程度，一般於 7 個工作日內完成。緊急情況（如涉及人身安全）會優先處理。</p>
            </Section>

            <Section title="6. 內容發布者的權利">
              <p>如果你的內容被申訴，我們會通知你並提供申訴理據。你有權：</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>了解申訴的具體原因</li>
                <li>提交抗辯或解釋</li>
                <li>在被要求修改內容時，選擇修改或刪除</li>
                <li>對移除決定提出上訴</li>
              </ul>
            </Section>

            <Section title="7. 虛假申訴">
              <p>提交虛假或惡意的移除申訴屬濫用本機制的行為。我們保留對重複提交虛假申訴者採取行動的權利，包括限制其使用平台服務。</p>
            </Section>

            <Section title="8. 平台保留權利">
              <p>本平台保留最終決定權，可自行判斷是否移除任何內容，而毋須事先通知。特別是當內容涉及以下情況時，我們可能立即採取行動：</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>對他人安全構成即時威脅</li>
                <li>明顯違反香港法律</li>
                <li>大規模散布垃圾或惡意內容</li>
              </ul>
            </Section>

            <Section title="9. 政策修改">
              <p>本平台保留隨時修改本移除政策的權利。重大變更會透過平台公告通知用戶。</p>
            </Section>

            <Section title="10. 聯絡我們">
              <p>如需提交移除申訴或對本政策有任何疑問，請透過本平台「聯絡我們」頁面與我們聯繫。</p>
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
