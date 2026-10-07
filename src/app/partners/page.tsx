'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';
import IconBadge from '@/components/IconBadge';
import { Handshake, Mic, Lightbulb, BarChart3, Globe, GraduationCap } from 'lucide-react';

const partners = [
  {
    icon: Handshake,
    title: '內容合作',
    desc: '同 Hearten 一齊製作同愛情、兩性關係相關嘅內容。合作形式包括專題文章、訪談系列、互動活動等，藉此接觸我哋嘅活躍用戶社群。',
  },
  {
    icon: Mic,
    title: '活動聯乘',
    desc: '舉辦線上或線下活動，例如愛情講座、Speed Dating、工作坊等。Hearten 提供平台宣傳同會員招募，你提供專業內容同執行。',
  },
  {
    icon: Lightbulb,
    title: '品牌植入',
    desc: '將你嘅品牌自然融入 Hearten 嘅內容同社群互動中。由主題贊助到長期品牌大使計劃，我哋會度身訂造最適合你嘅方案。',
  },
  {
    icon: BarChart3,
    title: '數據合作',
    desc: '分享同交流香港戀愛趨勢數據。Hearten 嘅用戶數據可以為市場研究、產品開發同內容策略提供有價值嘅洞察。',
  },
  {
    icon: Globe,
    title: '媒體聯盟',
    desc: '同其他媒體平台交換內容、互相導流。如果你嘅平台都係服務香港年輕受眾，我哋可以探索跨平台合作機會。',
  },
  {
    icon: GraduationCap,
    title: '學術研究',
    desc: '歡迎大學同研究機構合作，利用 Hearten 嘅匿名數據進行兩性關係、社會心理學等學術研究。我哋重視學術誠信同用戶私隱。',
  },
];

export default function PartnersPage() {
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
          <h1 className="text-2xl font-bold text-hearten-text mb-2">合作方案</h1>
          <p className="text-sm text-hearten-muted mb-8">同 Hearten 一齊創造更多可能性</p>

          <div className="max-w-3xl space-y-8">
            {/* Partner types */}
            <section>
              <SectionHeading icon={Handshake} title="合作方式" className="mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {partners.map((p) => (
                  <div key={p.title} className="p-5 rounded-xl bg-hearten-card border border-hearten-border hover:border-hearten-rose transition-colors">
                    <IconBadge icon={p.icon} size="lg" className="mb-3" />
                    <h3 className="text-lg font-bold text-hearten-text mb-2">{p.title}</h3>
                    <p className="text-sm text-hearten-muted leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact CTA */}
            <section>
              <div className="bg-hearten-card border border-hearten-border rounded-xl p-6 text-center">
                <h2 className="text-xl font-bold text-hearten-text mb-2">有合作構思？</h2>
                <p className="text-base text-hearten-muted mb-6 leading-relaxed">
                  無論你係品牌、媒體、教育機構定係初創公司，我哋都歡迎你提出合作建議。
                  請透過「聯絡我們」頁面提交查詢，簡單介紹你嘅機構同合作構思。
                </p>
                <p className="text-sm text-hearten-dim">
                  我哋會喺 5 個工作日內回覆，探討合作可能性。
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
