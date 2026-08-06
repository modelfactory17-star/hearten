'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard, Users, FileText, MessageSquare, Flag,
  BarChart3, Settings, LogOut, Menu, X, Search
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: '儀表板', icon: LayoutDashboard },
  { id: 'users', label: '用戶管理', icon: Users },
  { id: 'posts', label: '文章管理', icon: FileText },
  { id: 'comments', label: '留言管理', icon: MessageSquare },
  { id: 'reports', label: '舉報處理', icon: Flag, badge: 3 },
  { id: 'analytics', label: '數據分析', icon: BarChart3 },
  { id: 'settings', label: '系統設定', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';

  const navigate = (tab: string) => {
    router.push(`/admin?tab=${tab}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Sidebar */}
      <aside className="w-60 bg-[#0d0d14] border-r border-[#1a1a2e] flex flex-col shrink-0">
        <div className="h-14 border-b border-[#1a1a2e] flex items-center px-4 gap-3">
          <span className="font-bold text-white text-sm tracking-wide">HEARTEN ADMIN</span>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeTab === item.id
                  ? 'bg-[#e11d48]/20 text-[#e11d48] font-medium'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1a2e]'
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#e11d48] text-white text-[10px] font-bold leading-none">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-[#1a1a2e]">
          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-[#1a1a2e] transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            返回前台
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-[#1a1a2e] flex items-center justify-between px-6 shrink-0">
          <h2 className="text-sm font-medium text-gray-300">
            {NAV_ITEMS.find(i => i.id === activeTab)?.label ?? '儀表板'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-7 h-7 rounded-full bg-[#e11d48]/30 flex items-center justify-center text-xs font-bold text-[#e11d48]">G</div>
              <span className="text-xs text-gray-500">Gary</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
