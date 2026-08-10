'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface MemberData {
  id: string;
  name: string;
  emoji: string;
  bio: string;
  status: string;
  posts: number;
}

const fallbackMembers: MemberData[] = [];

export default function MemberGrid() {
  const [members, setMembers] = useState<MemberData[]>(fallbackMembers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/members')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length) setMembers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[14px]">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-hearten-card border border-hearten-border rounded-[14px] p-5 h-48 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!members.length) {
    return <p className="text-sm text-hearten-muted py-8 text-center">未有會員資料</p>;
  }

  // Assign levels based on post count
  const getLevel = (posts: number): { label: string; className: string } => {
    if (posts >= 20) return { label: 'VIP', className: 'bg-[linear-gradient(135deg,#f59e0b,#e11d48)] text-white' };
    if (posts >= 10) return { label: '資深', className: 'bg-[rgba(168,85,247,0.18)] text-[#a78bfa]' };
    if (posts >= 3) return { label: '進階', className: 'bg-[rgba(59,130,246,0.18)] text-[#60a5fa]' };
    return { label: '新手', className: 'bg-[#374151] text-[#9ca3af]' };
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-[14px]">
        <span className="ml-auto text-[11px] text-hearten-dim flex items-center gap-[5px]">
          等級：
          <span className="text-[10px] font-bold px-[7px] py-[2px] rounded-[6px] tracking-[0.03em] bg-[#374151] text-[#9ca3af]">新手</span>
          <span className="text-[10px] font-bold px-[7px] py-[2px] rounded-[6px] tracking-[0.03em] bg-[rgba(59,130,246,0.18)] text-[#60a5fa]">進階</span>
          <span className="text-[10px] font-bold px-[7px] py-[2px] rounded-[6px] tracking-[0.03em] bg-[rgba(168,85,247,0.18)] text-[#a78bfa]">資深</span>
          <span className="text-[10px] font-bold px-[7px] py-[2px] rounded-[6px] tracking-[0.03em] bg-[linear-gradient(135deg,#f59e0b,#e11d48)] text-white">VIP</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[14px]">
        {members.map((m) => {
          const level = getLevel(m.posts);
          return (
            <Link
              key={m.id}
              href={`/user/${encodeURIComponent(m.name)}`}
              className="relative bg-hearten-card border border-hearten-border rounded-[14px] p-5 transition-all duration-[0.2s] hover:border-hearten-border-hover hover:-translate-y-[2px] block"
            >
              <div className="flex items-start gap-3 mb-[10px]">
                <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-[22px] border-2 bg-[linear-gradient(135deg,#1a2a3a,#1a3040)] border-[rgba(59,130,246,0.3)]">
                  {m.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-bold text-hearten-text">{m.name}</div>
                  <div className="text-xs text-hearten-dim mt-[2px]">{m.status}</div>
                  <div className="flex items-center gap-1 mt-[6px]">
                    <span className={`text-[10px] font-bold px-[7px] py-[2px] rounded-[6px] tracking-[0.03em] ${level.className}`}>
                      {level.label}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-hearten-muted mt-2 leading-[1.5] line-clamp-2">{m.bio}</p>
              <div className="flex items-center gap-2 mt-[14px]">
                <span className="flex items-center justify-center gap-[6px] py-[7px] px-[14px] rounded-[10px] border border-hearten-rose bg-transparent text-hearten-rose text-sm font-semibold transition-all duration-[0.15s] flex-1 hover:bg-hearten-rose hover:text-white">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[14px] h-[14px]">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  Inbox
                </span>
                <span className="text-xs text-hearten-dim">{m.posts} 帖</span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
