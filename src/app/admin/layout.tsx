'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, Users, FileText, MessageSquare, Flag,
  BarChart3, Settings, LogOut
} from 'lucide-react';
import AdminContext, { NAV_ITEMS } from './AdminContext';

type Tab = 'dashboard' | 'users' | 'posts' | 'comments' | 'reports' | 'analytics' | 'settings';

const NAV_ICONS: Record<Tab, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard, users: Users, posts: FileText, comments: MessageSquare,
  reports: Flag, analytics: BarChart3, settings: Settings,
};

const NAV_BADGES: Partial<Record<Tab, number>> = { reports: 3 };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('dashboard');

  return (
    <AdminContext.Provider value={{ tab, setTab }}>
      <div className="min-h-screen bg-[#0a0a0f] flex">
        {/* Sidebar */}
        <aside className="w-60 bg-[#0d0d14] border-r border-[#1a1a2e] flex flex-col shrink-0">
          <div className="h-14 border-b border-[#1a1a2e] flex items-center px-4 gap-3">
            <span className="font-bold text-white text-sm tracking-wide">HEARTEN ADMIN</span>
          </div>

          <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
            {NAV_ITEMS.map(item => {
              const Icon = NAV_ICONS[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    tab === item.id
                      ? 'bg-[#e11d48]/20 text-[#e11d48] font-medium'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1a2e]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {NAV_BADGES[item.id] && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#e11d48] text-white text-[10px] font-bold leading-none">
                      {NAV_BADGES[item.id]}
                    </span>
                  )}
                </button>
              );
            })}
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
              {NAV_ITEMS.find(i => i.id === tab)?.label ?? '儀表板'}
            </h2>
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-7 h-7 rounded-full bg-[#e11d48]/30 flex items-center justify-center text-xs font-bold text-[#e11d48]">G</div>
              <span className="text-xs text-gray-500">Gary</span>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminContext.Provider>
  );
}
