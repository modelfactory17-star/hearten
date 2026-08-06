'use client';

import { useState, useEffect } from 'react';
import { Search, Bell, User, Sun, Moon } from 'lucide-react';

export default function Header() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('hearten-theme') as 'dark' | 'light' | null;
    if (stored) setTheme(stored);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('hearten-theme', next);
    if (next === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  return (
    <header className="sticky top-0 z-50 h-14 border-b border-hearten-border bg-hearten-bg/90 backdrop-blur">
      <div className="h-full max-w-[1400px] mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="text-hearten-rose text-xl">♥</span>
            <span className="text-hearten-text">Hearten</span>
          </a>
          <span className="hidden sm:inline text-xs text-hearten-muted">
            用心聽你嘅心事
          </span>
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-hearten-card border border-hearten-border rounded-lg px-3 py-1.5 w-64">
          <Search className="w-4 h-4 text-hearten-muted" />
          <input
            type="text"
            placeholder="搜尋心事..."
            className="bg-transparent text-sm text-hearten-text placeholder-hearten-muted outline-none w-full"
          />
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-hearten-card text-hearten-muted hover:text-hearten-text transition-colors"
            title={theme === 'dark' ? '切換日間模式' : '切換夜間模式'}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button className="p-2 rounded-lg hover:bg-hearten-card text-hearten-muted hover:text-hearten-text transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-hearten-rose hover:bg-hearten-rose-light text-white text-sm font-medium transition-colors">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">登入</span>
          </button>
        </div>
      </div>
    </header>
  );
}
