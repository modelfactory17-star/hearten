'use client';

import { useState, useEffect } from 'react';
import { Search, User, Sun, Moon, LogOut, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { db, type AuthUser } from '@/lib/db';
import { createClient } from '@/utils/supabase/client';
import LoginModal from './LoginModal';

export default function Header({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

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

  // Fetch unread message count
  useEffect(() => {
    if (!user?.id) { setUnreadCount(0); return; }
    fetch(`/api/messages?user_id=${encodeURIComponent(user.id)}`)
      .then(r => r.json())
      .then((data: Array<{ unread: number }>) => {
        const total = (data || []).reduce((sum, c) => sum + (c.unread || 0), 0);
        setUnreadCount(total);
      })
      .catch(() => {});
    // Poll every 30s
    const interval = setInterval(() => {
      if (!user?.id) return;
      fetch(`/api/messages?user_id=${encodeURIComponent(user.id)}`)
        .then(r => r.json())
        .then((data: Array<{ unread: number }>) => {
          const total = (data || []).reduce((sum, c) => sum + (c.unread || 0), 0);
          setUnreadCount(total);
        })
        .catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);
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

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 h-14 border-b border-hearten-border bg-hearten-header backdrop-blur">
        <div className="h-full max-w-[1400px] mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-1.5 -ml-1 rounded-lg hover:bg-hearten-card text-hearten-text transition-colors"
              aria-label="Toggle menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18"/>
              </svg>
            </button>
            <a href="/" className="flex items-center gap-2.5 font-bold text-xl">
              <img src="/logo.svg" alt="Hearten" className="w-10 h-10" />
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
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

            <button onClick={() => router.push('/messages')}
              className="p-2 rounded-lg hover:bg-hearten-card text-hearten-muted hover:text-hearten-text transition-colors relative">
              <MessageCircle className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-hearten-rose text-white text-[10px] font-bold flex items-center justify-center leading-none" style={{ minWidth: '18px', height: '18px', padding: '0 2px' }}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <a
                  href={`/user/${encodeURIComponent(user.username)}`}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-hearten-card text-hearten-text text-sm transition-colors"
                >
                  {user.avatar_url ? (
                    <span className="w-6 h-6 rounded-full overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                    </span>
                  ) : (
                    <span>{user.emoji}</span>
                  )}
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowLogin(true)}
                  className="px-3 py-1.5 rounded-lg border border-hearten-border hover:bg-hearten-card text-hearten-text text-sm font-medium transition-colors"
                >
                  註冊
                </button>
                <button
                  onClick={() => setShowLogin(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-hearten-rose hover:bg-hearten-rose-light text-white text-sm font-medium transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">登入</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
