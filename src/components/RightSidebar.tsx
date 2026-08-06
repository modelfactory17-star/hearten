'use client';

import AdBanner from './AdBanner';

const hotTopics = [
  { emoji: '💬', text: '已讀不回算唔算有問題', num: '2.8K' },
  { emoji: '🌍', text: '遠距離戀愛點維持', num: '132' },
  { emoji: '💔', text: '發現另一半有第三者', num: '98' },
  { emoji: '😔', text: '30歲仲未拍過拖', num: '87' },
  { emoji: '🥀', text: '分手後點放低', num: '74' },
];

const newMembers = [
  { emoji: '🙋', text: '港島阿傑 · 💼 在職' },
  { emoji: '👩‍🎓', text: '港大護理系 · 🎓 在學' },
  { emoji: '🧑', text: '中大文學生 · 🎓 在學' },
];

const activeUsers = [
  { emoji: '🐱', text: '月光下的貓', num: '23 帖' },
  { emoji: '🍋', text: '檸檬茶走甜', num: '19 帖' },
  { emoji: '🌊', text: '維港的風', num: '17 帖' },
];

export default function RightSidebar() {
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
            <button
              key={topic.text}
              className="flex items-center gap-3 py-[9px] px-3 rounded-[10px] bg-transparent hover:bg-hearten-card cursor-pointer transition-colors duration-[0.15s] text-left w-full"
            >
              <span className="text-[15px]">{topic.emoji}</span>
              <span className="flex-1 text-sm font-semibold text-hearten-muted whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-hearten-text">
                {topic.text}
              </span>
              <span className="text-xs text-hearten-dim flex-shrink-0">{topic.num}</span>
            </button>
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
            <button
              key={member.text}
              className="flex items-center gap-3 py-[9px] px-3 rounded-[10px] bg-transparent hover:bg-hearten-card cursor-pointer transition-colors duration-[0.15s] text-left w-full"
            >
              <div className="w-[34px] h-[34px] flex-shrink-0 rounded-full bg-hearten-card border border-hearten-border flex items-center justify-center text-[15px]">
                {member.emoji}
              </div>
              <span className="flex-1 text-sm font-semibold text-hearten-muted whitespace-nowrap overflow-hidden text-ellipsis">
                {member.text}
              </span>
              <span className="text-xs text-hearten-dim flex-shrink-0">新</span>
            </button>
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
            <button
              key={user.text}
              className="flex items-center gap-3 py-[9px] px-3 rounded-[10px] bg-transparent hover:bg-hearten-card cursor-pointer transition-colors duration-[0.15s] text-left w-full"
            >
              <div className="w-[34px] h-[34px] flex-shrink-0 rounded-full bg-hearten-card border border-hearten-border flex items-center justify-center text-[15px]">
                {user.emoji}
              </div>
              <span className="flex-1 text-sm font-semibold text-hearten-muted whitespace-nowrap overflow-hidden text-ellipsis">
                {user.text}
              </span>
              <span className="text-xs text-hearten-dim flex-shrink-0">{user.num}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-[18px] border-t border-hearten-border text-xs text-hearten-dim leading-[1.9]">
        <p>© 2024 Hearten</p>
        <p>Heart + Listen · 用心聽你嘅心事</p>
        <p className="mt-2">
          <a href="#" className="mr-3 hover:text-hearten-muted transition-colors duration-[0.15s]">私隱</a>
          <a href="#" className="mr-3 hover:text-hearten-muted transition-colors duration-[0.15s]">條款</a>
          <a href="#" className="hover:text-hearten-muted transition-colors duration-[0.15s]">聯絡</a>
        </p>
      </div>
    </aside>
  );
}
