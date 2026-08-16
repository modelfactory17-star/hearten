'use client';

import { useState, useEffect } from 'react';
import AdBanner from './AdBanner';
import Link from 'next/link';

interface HotTopic {
  emoji: string;
  text: string;
  num: string;
  slug: string;
  image?: string | null;
}

interface SidebarMember {
  emoji: string;
  text: string;
  id: string;
  username: string;
}

interface ActiveUser {
  emoji: string;
  text: string;
  num: string;
  id: string;
  username: string;
}

export default function RightSidebar() {
  const [hotTopics, setHotTopics] = useState<HotTopic[]>([]);
  const [newMembers, setNewMembers] = useState<SidebarMember[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);

  useEffect(() => {
    fetch('/api/sidebar')
      .then(r => r.json())
      .then(data => {
        if (data.hotTopics) setHotTopics(data.hotTopics);
        if (data.newMembers) setNewMembers(data.newMembers);
        if (data.activeUsers) setActiveUsers(data.activeUsers);
      })
      .catch(() => {});
  }, []);

  return (
    <aside className="w-[280px] shrink-0 border-l border-hearten-border h-[calc(100vh-56px)] sticky top-14 overflow-y-auto px-4 py-5 max-[1100px]:hidden">
      {/* Ad Banner */}
      <AdBanner size="rectangle" />

      {/* 熱門話題 */}
      <div className="mb-7">
        <div className="flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-[0.04em] text-hearten-muted mb-[14px] pl-0.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px] text-hearten-amber">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
          </svg>
          熱門話題
        </div>
        <div className="flex flex-col gap-[2px]">
          {hotTopics.map((topic) => (
            <Link
              key={topic.text}
              href={topic.slug ? `/post/${topic.slug}` : '#'}
              className="flex items-center gap-3 py-[9px] px-3 rounded-[10px] bg-transparent hover:bg-hearten-card cursor-pointer transition-colors duration-[0.15s] text-left w-full"
            >
              <span className="text-[15px]">{topic.emoji}</span>
              <span className="flex-1 text-base font-semibold text-hearten-muted whitespace-nowrap overflow-hidden text-ellipsis">
                {topic.text}
              </span>
              <span className="text-sm text-hearten-dim flex-shrink-0">{topic.num}</span>
              {topic.image && (
                <img src={topic.image} alt="" className="w-9 h-9 rounded-md object-cover flex-shrink-0" />
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* 最新會員 */}
      <div className="mb-7">
        <div className="flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-[0.04em] text-hearten-muted mb-[14px] pl-0.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px] text-hearten-rose">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          最新會員
        </div>
        <div className="flex flex-col gap-[2px]">
          {newMembers.map((member) => (
            <Link
              key={member.text}
              href={member.username ? `/user/${encodeURIComponent(member.username)}` : '#'}
              className="flex items-center gap-3 py-[9px] px-3 rounded-[10px] bg-transparent hover:bg-hearten-card cursor-pointer transition-colors duration-[0.15s] text-left w-full"
            >
              <div className="w-[34px] h-[34px] flex-shrink-0 rounded-full bg-hearten-card border border-hearten-border flex items-center justify-center text-[15px]">
                {member.emoji}
              </div>
              <span className="flex-1 text-sm font-semibold text-hearten-muted whitespace-nowrap overflow-hidden text-ellipsis">
                {member.text}
              </span>
              <span className="text-sm text-hearten-dim flex-shrink-0">新</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 活躍用戶 */}
      <div className="mb-7">
        <div className="flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-[0.04em] text-hearten-muted mb-[14px] pl-0.5">
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
              className="flex items-center gap-3 py-[9px] px-3 rounded-[10px] bg-transparent hover:bg-hearten-card cursor-pointer transition-colors duration-[0.15s] text-left w-full"
            >
              <div className="w-[34px] h-[34px] flex-shrink-0 rounded-full bg-hearten-card border border-hearten-border flex items-center justify-center text-[15px]">
                {user.emoji}
              </div>
              <span className="flex-1 text-sm font-semibold text-hearten-muted whitespace-nowrap overflow-hidden text-ellipsis">
                {user.text}
              </span>
              <span className="text-sm text-hearten-dim flex-shrink-0">{user.num}</span>
            </Link>
          ))}
        </div>
      </div>

    </aside>
  );
}
