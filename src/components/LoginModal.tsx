'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { login, register } from '@/lib/auth';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: Props) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!open) return null;

  const handleSubmit = () => {
    setError('');
    setSuccess('');
    const result = tab === 'login'
      ? login(username, password)
      : register(username, password);

    if (result.ok) {
      setSuccess(tab === 'login' ? '登入成功！' : '註冊成功！');
      setTimeout(() => onClose(), 600);
    } else {
      setError(result.error ?? '錯誤');
    }
  };

  const switchTab = (t: 'login' | 'register') => {
    setTab(t);
    setError('');
    setSuccess('');
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-hearten-card border border-hearten-border rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-1">
            <button
              onClick={() => switchTab('login')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                tab === 'login' ? 'bg-hearten-rose text-white' : 'text-hearten-muted hover:text-hearten-text'
              }`}
            >
              登入
            </button>
            <button
              onClick={() => switchTab('register')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                tab === 'register' ? 'bg-hearten-rose text-white' : 'text-hearten-muted hover:text-hearten-text'
              }`}
            >
              註冊
            </button>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-hearten-bg text-hearten-muted hover:text-hearten-text">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-hearten-text mb-1.5">用戶名稱</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="你嘅 Hearten 名稱"
              maxLength={16}
              className="w-full bg-hearten-bg border border-hearten-border rounded-lg px-3 py-2.5 text-sm text-hearten-text placeholder-hearten-muted outline-none focus:border-hearten-rose transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-hearten-text mb-1.5">密碼</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={tab === 'register' ? '最少4個字' : '輸入密碼'}
              className="w-full bg-hearten-bg border border-hearten-border rounded-lg px-3 py-2.5 text-sm text-hearten-text placeholder-hearten-muted outline-none focus:border-hearten-rose transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {error && <p className="text-hearten-rose text-sm">⚠️ {error}</p>}
          {success && <p className="text-green-400 text-sm">✅ {success}</p>}

          <button
            onClick={handleSubmit}
            disabled={!username.trim() || !password}
            className="w-full py-2.5 rounded-xl bg-hearten-rose hover:bg-hearten-rose-light disabled:opacity-40 text-white font-medium text-sm transition-colors"
          >
            {tab === 'login' ? '登入' : '註冊'}
          </button>

          <p className="text-xs text-hearten-dim text-center">
            {tab === 'login' ? '未有帳戶？' : '已經有帳戶？'}
            <button onClick={() => switchTab(tab === 'login' ? 'register' : 'login')} className="text-hearten-rose ml-1 hover:underline">
              {tab === 'login' ? '註冊' : '登入'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
