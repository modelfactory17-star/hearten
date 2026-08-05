'use client';

import { Flame, User } from 'lucide-react';

const hotTopics = [
  { title: '男朋友成日已讀不回', count: 156, emoji: '💬' },
  { title: '遠距離戀愛點維持', count: 132, emoji: '🌍' },
  { title: '發現另一半有第三者', count: 98, emoji: '💔' },
  { title: '30歲仲未拍過拖', count: 87, emoji: '😔' },
  { title: '分手後點放低', count: 74, emoji: '🥀' },
];

const activeUsers = [
  { name: '月光下的貓', posts: 23, emoji: '🐱' },
  { name: '檸檬茶走甜', posts: 19, emoji: '🍋' },
  { name: '維港的風', posts: 17, emoji: '🌊' },
  { name: '深夜巴士', posts: 15, emoji: '🚌' },
  { name: '旺角小王子', posts: 14, emoji: '🤴' },
];

export default function RightSidebar() {
  return (
    <aside className="w-[280px] shrink-0 border-l border-hearten-border h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Hot Topics */}
        <div>
          <h3 className="flex items-center gap-2 text-xs font-semibold text-hearten-muted uppercase tracking-wider mb-3">
            <Flame className="w-3.5 h-3.5 text-hearten-amber" />
            熱門話題
          </h3>
          <div className="space-y-2">
            {hotTopics.map((topic, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-hearten-card text-left transition-colors group"
              >
                <span className="text-sm">{topic.emoji}</span>
                <span className="flex-1 text-sm text-gray-300 group-hover:text-white truncate">
                  {topic.title}
                </span>
                <span className="text-xs text-hearten-muted shrink-0">
                  {topic.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Users */}
        <div>
          <h3 className="flex items-center gap-2 text-xs font-semibold text-hearten-muted uppercase tracking-wider mb-3">
            <User className="w-3.5 h-3.5" />
            活躍用戶
          </h3>
          <div className="space-y-2">
            {activeUsers.map((user, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-hearten-card text-left transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-hearten-card border border-hearten-border flex items-center justify-center text-sm shrink-0">
                  {user.emoji}
                </div>
                <span className="flex-1 text-sm text-gray-300 truncate">
                  {user.name}
                </span>
                <span className="text-xs text-hearten-muted shrink-0">
                  {user.posts} 帖
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-hearten-border">
          <div className="text-xs text-hearten-muted space-y-1">
            <p>© 2024 Hearten</p>
            <p>Heart + Listen · 用心聽你嘅心事</p>
            <div className="flex gap-3 mt-2">
              <a href="#" className="hover:text-white transition-colors">私隱</a>
              <a href="#" className="hover:text-white transition-colors">條款</a>
              <a href="#" className="hover:text-white transition-colors">聯絡</a>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
