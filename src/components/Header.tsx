'use client';

import { useState, useEffect } from 'react';
import { Search, Bell, User, Sun, Moon, LogOut } from 'lucide-react';
import { db, type AuthUser } from '@/lib/db';
import { createClient } from '@/utils/supabase/client';
import LoginModal from './LoginModal';

export default function Header() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('hearten-theme') as 'dark' | 'light' | null;
    if (stored) setTheme(stored);
    db.auth.getUser().then(setUser);
    const onOpenLogin = () => setShowLogin(true);
    window.addEventListener('hearten:open-login', onOpenLogin);
    return () => {
      window.removeEventListener('hearten:open-login', onOpenLogin);
    };
  }, []);

  // Refresh user on auth change
  useEffect(() => {
    const { data: { subscription } } = createClient().auth.onAuthStateChange((_event, session) => {
      if (session) db.auth.getUser().then(setUser);
      else setUser(null);
    });
    return () => subscription.unsubscribe();
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

  const handleLogout = () => {
    db.auth.logout();
  };

  return (
    <>
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

            {user ? (
              <div className="flex items-center gap-2">
                <a
                  href={`/user/${encodeURIComponent(user.username)}`}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-hearten-card text-hearten-text text-sm transition-colors"
                >
                  <span>{user.emoji}</span>
                  <span className="hidden sm:inline max-w-[80px] truncate">{user.username}</span>
                </a>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg hover:bg-hearten-card text-hearten-muted hover:text-hearten-rose transition-colors"
                  title="登出"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-hearten-rose hover:bg-hearten-rose-light text-white text-sm font-medium transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">登入</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
