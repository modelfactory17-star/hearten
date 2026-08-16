'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const categories: { label: string; badge?: string; href: string; catId?: string }[] = [
  { label: '💑 戀愛日常', href: '/category/dating-life', catId: 'dating-life' },
  { label: '💕 暗戀表白', href: '/category/crush', catId: 'crush' },
  { label: '💔 分手復合', href: '/category/breakup', catId: 'breakup' },
  { label: '💍 婚姻關係', href: '/category/marriage', catId: 'marriage' },
  { label: '🌈 LGBTQ+', href: '/category/lgbtq', catId: 'lgbtq' },
  { label: '🌳 心靈樹窿', href: '/category/treehole', catId: 'treehole' },
  { label: '🃏 塔羅占卜', href: '/category/tarot', catId: 'tarot' },
  { label: '⭐ 紫微斗數', href: '/category/ziwei', catId: 'ziwei' },
  { label: '💼 在職戀愛', href: '/category/work-love', catId: 'work-love' },
  { label: '🎓 在學戀愛', href: '/category/school-love', catId: 'school-love' },
  { label: '👨‍👩‍👧 家庭關係', href: '/category/family', catId: 'family' },
  { label: '📋 交友配套', href: '/category/dating-kit', catId: 'dating-kit' },
  { label: '🔞 一知半解', href: '/category/bedroom', catId: 'bedroom' },
  { label: '📊 投票', badge: 'hot', href: '/polls' },
  { label: '📰 熱門話題', badge: 'hot', href: '/hot-topics' },
  { label: '👥 推薦會員', badge: 'new', href: '/members' },
];

export default function LeftSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [stats, setStats] = useState<Record<string, { total: number; today: number }>>({});

  useEffect(() => {
    const fetchStats = () => {
      fetch('/api/sidebar')
        .then(r => r.json())
        .then(data => {
          if (data.categoryStats) setStats(data.categoryStats);
        })
        .catch(() => {});
    };
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="w-[220px] shrink-0 border-r border-hearten-border h-[calc(100vh-56px)] sticky top-14 overflow-y-auto px-4 py-5">
      {/* Categories */}
      <div className="mt-0">
        <div className="text-sm font-extrabold uppercase tracking-[0.04em] text-hearten-muted mb-3 pl-1">
          話題分類
        </div>
        <nav className="flex flex-col gap-[2px]">
          {categories.map((cat) => {
            const isActive = cat.href === '/' ? pathname === '/' : pathname.startsWith(cat.href);
            return (
            <button
              key={cat.label}
              onClick={() => router.push(cat.href)}
              className={`flex items-center gap-[10px] py-[9px] px-3 rounded-[10px] text-base font-semibold transition-all duration-[0.15s] text-left w-full
                ${isActive
                  ? 'bg-hearten-rose/10 text-hearten-rose'
                  : 'text-hearten-muted hover:bg-hearten-card hover:text-hearten-text'
                }
              `}
            >
              {cat.label}
              {cat.catId && stats[cat.catId] && (
                <span className="ml-auto text-sm text-hearten-dim">{stats[cat.catId].total}</span>
              )}
              {cat.badge === 'new' && (
                <span className="ml-auto text-[11px] font-semibold px-[6px] py-[2px] rounded-[8px] bg-hearten-rose text-white">
                  新
                </span>
              )}
              {cat.badge === 'hot' && (
                <span className="ml-auto text-[11px] font-semibold px-[6px] py-[2px] rounded-[8px] bg-hearten-amber text-black">
                  熱
                </span>
              )}
            </button>
            );
          })}
        </nav>
      </div>

      {/* Write Button at bottom */}
      <div className="mt-7">
        <button
          onClick={() => router.push('/write')}
          className="w-full flex items-center justify-center gap-2 px-4 py-[11px] rounded-[12px] bg-hearten-rose hover:bg-hearten-rose-light text-white text-sm font-semibold cursor-pointer transition-all duration-[0.15s] hover:-translate-y-[1px] animate-pulse-glow"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[17px] h-[17px]">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          寫心事
        </button>
      </div>
    </aside>
  );
}
