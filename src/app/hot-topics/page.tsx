'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import Footer from '@/components/Footer';

const hotTopics = [
  { emoji: '💒', name: '何太事件 · 你點睇？', count: '328 討論', badge: 'hot', slug: 'hotai', desc: '全城熱話：婚姻、金錢同感情之間嘅關係' },
  { emoji: '📱', name: '交友 app 邊個最好用？', count: '256 討論', badge: 'hot', slug: 'dating-app', desc: 'Tinder、CMB、Heymandi…真實用家分享' },
  { emoji: '💸', name: '情人節禮物 budget 幾多？', count: '189 討論', badge: 'new', slug: 'valentine-gift', desc: '男女角度大不同，budget 點先合理？' },
  { emoji: '🏠', name: '結婚買樓 · 香港現實', count: '412 討論', badge: 'hot', slug: 'marriage-flat', desc: '後生仔結婚係咪一定要買樓？' },
  { emoji: '👶', name: '生唔生仔？年輕一代點揀', count: '297 討論', badge: 'hot', slug: 'baby-choice', desc: '生育成本高，越嚟越多夫婦選擇唔生' },
  { emoji: '🌐', name: 'Long D 移民潮 · 異地戀點算', count: '173 討論', badge: 'new', slug: 'long-d', desc: '時差、距離、信任…點維繫異地戀？' },
];

export default function HotTopicsPage() {
  const router = useRouter();
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

        <main className="flex-1 min-w-0 px-7 py-6 max-md:px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[22px] font-bold text-hearten-text mb-2">📰 熱門話題</h1>
            <p className="text-sm text-hearten-muted">時事 · 八卦 · 城中熱話 — 香港人最關心嘅話題，一齊入嚟傾</p>
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hotTopics.map((topic) => (
              <div
                key={topic.slug}
                onClick={() => router.push(`/hot/${topic.slug}`)}
                className="flex items-start gap-4 p-5 rounded-xl bg-hearten-card border border-hearten-border cursor-pointer transition-all duration-[0.15s] hover:border-hearten-rose hover:shadow-md"
              >
                <span className="text-4xl flex-shrink-0">{topic.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-hearten-text">{topic.name}</h3>
                    {topic.badge === 'hot' ? (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-hearten-amber text-black">🔥 熱</span>
                    ) : (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-hearten-rose text-white">新</span>
                    )}
                  </div>
                  <p className="text-sm text-hearten-muted mb-2">{topic.desc}</p>
                  <span className="text-xs text-hearten-dim">{topic.count}</span>
                </div>
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
