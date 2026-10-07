'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';
import IconBadge from '@/components/IconBadge';
import { Lightbulb, Sparkles, Handshake, Glasses, MessageCircle, Moon, Lock, Heart, Smartphone } from 'lucide-react';

export default function AboutPage() {
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
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">♥</div>
            <h1 className="text-2xl font-bold text-hearten-text mb-3">Hearten 愛情討論區</h1>
            <p className="text-base text-hearten-muted max-w-2xl mx-auto leading-relaxed">
              Heart + Listen — 用心聆聽每一段心事
            </p>
          </div>

          {/* Mission */}
          <section className="mb-10">
            <SectionHeading icon={Lightbulb} title="我哋嘅使命" className="mb-4" />
            <div className="bg-hearten-card border border-hearten-border rounded-xl p-6">
              <p className="text-base text-hearten-muted leading-relaxed mb-4">
                Hearten 係一個專為香港人而設嘅愛情討論平台。喺呢度，無論你係暗戀、拍拖、分手、結婚，
                定係對性別、關係有疑問，都可以分享你嘅故事，搵到共鳴同支持。
              </p>
              <p className="text-base text-hearten-muted leading-relaxed mb-4">
                我哋相信每一段感情都值得被聆聽。香港生活節奏急促，好多時心事冇人講、冇人明。
                Hearten 提供一個安全、溫暖嘅空間，等你可以放低包袱，好好傾訴。
              </p>
              <p className="text-base text-hearten-muted leading-relaxed">
                實名社群，真誠交流 — 呢度係香港人嘅愛情基地。
              </p>
            </div>
          </section>

          {/* Features */}
          <section className="mb-10">
            <SectionHeading icon={Sparkles} title="Hearten 有咩特色？" className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: Glasses, title: '真實身份', desc: '實名註冊社群，每個會員都有自己嘅 profile。真誠交流，告別假 account 同 troll。' },
                { icon: MessageCircle, title: '多元話題', desc: '分手、暗戀、婚姻、LGBTQ+、塔羅占卜…揀你最關心嘅話題，搵到同路人。' },
                { icon: Moon, title: '日夜模式', desc: '夜晚熄燈睇唔傷眼，日頭光猛睇得清。一 click 切換，貼心設計。' },
                { icon: Lock, title: '安全社群', desc: '嚴格版規，確保討論環境友善、尊重。零容忍網絡欺凌。' },
                { icon: Heart, title: '用心互動', desc: '俾心心、留言、收藏…簡單直接嘅互動方式，唔花巧，重交流。' },
                { icon: Smartphone, title: '手機友善', desc: '電腦、平板、手機全兼容，隨時隨地都可以上嚟傾。' },
              ].map((f) => (
                <div key={f.title} className="bg-hearten-card border border-hearten-border rounded-xl p-5">
                  <IconBadge icon={f.icon} size="md" className="mb-2" />
                  <h3 className="text-lg font-bold text-hearten-text mb-1">{f.title}</h3>
                  <p className="text-sm text-hearten-muted leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Community */}
          <section className="mb-10">
            <SectionHeading icon={Handshake} title="社群價值" className="mb-4" />
            <div className="bg-hearten-card border border-hearten-border rounded-xl p-6">
              <ul className="space-y-3">
                {[
                  '互相尊重：每個人都值得被尊重，唔同觀點可以理性討論',
                  '保護私隱：絕對唔會未經同意分享用戶資料，你嘅秘密只有你知',
                  '反欺凌：零容忍任何形式嘅網絡欺凌、人身攻擊、仇恨言論',
                  '香港人嘅平台：由香港人打造，專注香港人嘅戀愛話題同文化',
                ].map((v, i) => (
                  <li key={i} className="flex items-start gap-3 text-base text-hearten-muted">
                    <span className="text-hearten-rose-light mt-0.5 shrink-0">♥</span>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>

        <RightSidebar />
      </div>

      <Footer />
    </div>
  );
}
