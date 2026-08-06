'use client';

import { useRouter } from 'next/navigation';
import { Heart, Moon, Sparkles, MessageCircle, Users, Compass } from 'lucide-react';

const categories = [
  { id: 'all', label: '全部心事', icon: Compass, active: true, count: 128 },
  { id: 'breakup', label: '💔 分手', icon: Heart, count: 42 },
  { id: 'crush', label: '💕 暗戀', icon: Heart, count: 35 },
  { id: 'marriage', label: '💍 婚姻', icon: Heart, count: 28 },
  { id: 'lgbtq', label: '🌈 LGBTQ+', icon: Heart, count: 18 },
  { id: 'treehole', label: '🌳 樹窿', icon: Moon, count: 56 },
  { id: 'tarot', label: '🃏 塔羅', icon: Sparkles, count: 22 },
];

export default function LeftSidebar() {
  const router = useRouter();

  return (
    <aside className="w-[220px] shrink-0 border-r border-hearten-border h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Write Post CTA */}
        <button
          onClick={() => router.push('/write')}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-hearten-rose hover:bg-hearten-rose-light text-white font-medium text-sm transition-colors animate-pulse-glow"
        >
          <MessageCircle className="w-4 h-4" />
          寫心事
        </button>

        {/* Categories */}
        <div>
          <h3 className="text-xs font-semibold text-hearten-muted uppercase tracking-wider mb-3">
            分類
          </h3>
          <nav className="space-y-1">
            {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    cat.active
                      ? 'bg-hearten-rose/10 text-hearten-rose font-medium'
                      : 'text-hearten-muted hover:bg-hearten-card hover:text-hearten-text'
                  }`}
                >
                  <span>{cat.label.split(' ')[0]}</span>
                  <span className="flex-1 text-left">{cat.label.split(' ').slice(1).join(' ')}</span>
                  <span className="text-xs text-hearten-muted">{cat.count}</span>
                </button>
              ))}
          </nav>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xs font-semibold text-hearten-muted uppercase tracking-wider mb-3">
            連結
          </h3>
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-hearten-muted hover:bg-hearten-card hover:text-hearten-text transition-colors">
              <Users className="w-4 h-4" />
              活躍用戶
            </button>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-hearten-muted hover:bg-hearten-card hover:text-hearten-text transition-colors">
              <Heart className="w-4 h-4" />
              關於 Hearten
            </button>
          </nav>
        </div>
      </div>
    </aside>
  );
}
