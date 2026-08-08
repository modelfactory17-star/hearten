'use client';

import { useRouter, usePathname } from 'next/navigation';

const categories: { label: string; count?: string; badge?: string; href: string }[] = [
  { label: '💑 戀愛日常', href: '/category/dating-life' },
  { label: '💕 暗戀表白', count: '285', href: '/category/crush' },
  { label: '💔 分手復合', count: '342', href: '/category/breakup' },
  { label: '💍 婚姻關係', count: '198', href: '/category/marriage' },
  { label: '🌈 LGBTQ+', count: '156', href: '/category/lgbtq' },
  { label: '🌳 心靈樹窿', count: '423', href: '/category/treehole' },
  { label: '🃏 塔羅占卜', count: '87', href: '/category/tarot' },
  { label: '💼 在職戀愛', badge: 'new', href: '/category/work-love' },
  { label: '🎓 在學戀愛', badge: 'new', href: '/category/school-love' },
  { label: '👨‍👩‍👧 家庭關係', badge: 'new', href: '/category/family' },
  { label: '📋 交友配套', badge: 'new', href: '/category/dating-kit' },
  { label: '🔞 一知半解', count: '203', href: '/category/bedroom' },
  { label: '📊 投票', badge: 'hot', href: '/polls' },
  { label: '📰 熱門話題', count: '89', href: '/hot-topics' },
  { label: '👥 推薦會員', badge: 'new', href: '/members' },
];

export default function LeftSidebar() {
  const router = useRouter();
  const pathname = usePathname();

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
              {cat.count && (
                <span className="ml-auto text-sm text-hearten-dim">{cat.count}</span>
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
