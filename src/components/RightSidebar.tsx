'use client';

import { useState, useEffect } from 'react';
import LoveWiseCard from './LoveWiseCard';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

interface LatestComment {
  emoji: string;
  name: string;
  body: string;
  post: string;
  slug: string;
}

interface ActiveUser {
  emoji: string;
  text: string;
  num: string;
  id: string;
  username: string;
}

export default function RightSidebar() {
  const pathname = usePathname();
  const showPromo = pathname === '/' || pathname.startsWith('/category') || pathname.startsWith('/post') || pathname === '/hot-topics' || pathname === '/editors-picks';

  const [recentComments, setRecentComments] = useState<LatestComment[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);

  useEffect(() => {
    fetch('/api/sidebar')
      .then(r => r.json())
      .then(data => {
        if (data.latestComments) setRecentComments(data.latestComments);
        if (data.activeUsers) setActiveUsers(data.activeUsers);
      })
      .catch(() => {});
  }, []);

  return (
    <aside className="w-[280px] shrink-0 border-l border-hearten-border h-[calc(100vh-56px)] sticky top-14 overflow-y-auto px-4 py-5 max-[1100px]:hidden">
      {/* 最新留言（原本呢度係「熱門話題」，同中段 HotTopicsGrid 同一批 6 條 → 2026-10-07 換走）*/}
      <div className="mb-7">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.04em] text-hearten-muted mb-[14px] pl-0.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px]">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          最新留言
        </div>
        <div className="flex flex-col gap-[2px]">
          {recentComments.map((c) => (
            <Link
              key={`${c.slug}-${c.name}-${c.body}`}
              href={c.slug ? `/post/${c.slug}` : '#'}
              className="flex items-start gap-3 py-[9px] px-3 rounded-lg bg-transparent hover:bg-hearten-card cursor-pointer transition-colors duration-[0.15s] text-left w-full"
            >
              <div className="w-[30px] h-[30px] flex-shrink-0 rounded-full bg-hearten-card border border-hearten-border flex items-center justify-center text-xs">
                {c.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-hearten-muted truncate">{c.name}</div>
                <div className="text-xs text-hearten-dim truncate">{c.body}</div>
                <div className="text-2xs text-hearten-dim/80 mt-[2px] flex items-center gap-1"><MessageCircle className="w-3 h-3 shrink-0" /><span className="truncate">{c.post}</span></div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 自家品牌推薦（低調原生卡，只落主要頁）*/}
      {showPromo && (
        <div className="mb-7">
          <LoveWiseCard variant="sidebar" />
        </div>
      )}

      {/* 最新會員 block 已移除：中段 MemberGrid（8 張卡）已經覆蓋「新會員」同一批人 → 2026-10-07 */}

      {/* 活躍用戶 */}
      <div className="mb-7">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.04em] text-hearten-muted mb-[14px] pl-0.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px]">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          活躍用戶
        </div>
        <div className="flex flex-col gap-[2px]">
          {activeUsers.map((user) => (
            <Link
              key={user.text}
              href={user.username ? `/user/${encodeURIComponent(user.username)}` : '#'}
              className="flex items-center gap-3 py-[9px] px-3 rounded-lg bg-transparent hover:bg-hearten-card cursor-pointer transition-colors duration-[0.15s] text-left w-full"
            >
              <div className="w-[34px] h-[34px] flex-shrink-0 rounded-full bg-hearten-card border border-hearten-border flex items-center justify-center text-sm">
                {user.emoji}
              </div>
              <span className="flex-1 text-sm font-semibold text-hearten-muted whitespace-nowrap overflow-hidden text-ellipsis">
                {user.text}
              </span>
              {Number(user.num) > 0 && (
                <span className="text-sm text-hearten-dim flex-shrink-0">{user.num}</span>
              )}
            </Link>
          ))}
        </div>
      </div>

    </aside>
  );
}
