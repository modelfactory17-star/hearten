'use client';

import { createContext, useContext } from 'react';

type Tab = 'dashboard' | 'users' | 'posts' | 'comments' | 'presets' | 'reports' | 'analytics' | 'settings';

interface AdminContextType {
  tab: Tab;
  setTab: (tab: Tab) => void;
}

const AdminContext = createContext<AdminContextType>({ tab: 'dashboard', setTab: () => {} });
export const useAdminTab = () => useContext(AdminContext);

const NAV_ITEMS: { id: Tab; label: string }[] = [
  { id: 'dashboard', label: '儀表板' },
  { id: 'users', label: '用戶管理' },
  { id: 'posts', label: '文章管理' },
  { id: 'comments', label: '留言管理' },
  { id: 'presets', label: '預設 Account' },
  { id: 'reports', label: '舉報處理' },
  { id: 'analytics', label: '數據分析' },
  { id: 'settings', label: '系統設定' },
];

export { NAV_ITEMS };
export default AdminContext;
