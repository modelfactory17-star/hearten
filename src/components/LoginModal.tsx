'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { db } from '@/lib/db';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: Props) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');

  if (!open) return null;

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (tab === 'register' && password.length < 6) {
        setError('密碼最少需要6個字');
        setLoading(false);
        return;
      }
      if (tab === 'login') {
        const result = await db.auth.login(email, password);
        if (result.ok) {
          setSuccess('登入成功！');
          setTimeout(() => onClose(), 600);
        } else {
          setError(result.error ?? '錯誤');
        }
      } else {
        const result = await db.auth.register(email, password, username);
        if (result.ok) {
          setSuccess('');
          setShowOtp(true);
        } else {
          setError(result.error ?? '錯誤');
        }
      }
    } catch {
      setError('網絡錯誤，請再試');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      setError('請輸入6位驗證碼');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await db.auth.verifyOtp(email, otp);
      if (result.ok) {
        setSuccess('驗證成功！歡迎加入 Hearten 💕');
        setTimeout(() => onClose(), 1000);
      } else {
        setError(result.error ?? '驗證失敗');
      }
    } catch {
      setError('網絡錯誤，請再試');
    } finally {
      setLoading(false);
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
          {showOtp ? (
            <>
              <div className="text-center mb-2">
                <p className="text-sm text-hearten-text">驗證碼已發送到</p>
                <p className="text-sm font-medium text-hearten-rose">{email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-hearten-text mb-1.5">6位驗證碼</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full bg-hearten-bg border border-hearten-border rounded-lg px-3 py-2.5 text-sm text-hearten-text placeholder-hearten-muted outline-none focus:border-hearten-rose transition-colors text-center tracking-[0.3em]"
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
                  autoFocus
                />
              </div>

              {error && <p className="text-hearten-rose text-sm">⚠️ {error}</p>}
              {success && <p className="text-green-400 text-sm">✅ {success}</p>}

              <button
                onClick={handleVerifyOtp}
                disabled={otp.length < 6 || loading}
                className="w-full py-2.5 rounded-xl bg-hearten-rose hover:bg-hearten-rose-light disabled:opacity-40 text-white font-medium text-sm transition-colors"
              >
                {loading ? '驗證中...' : '驗證'}
              </button>

              <button
                onClick={() => { setShowOtp(false); setError(''); setOtp(''); }}
                className="w-full text-xs text-hearten-dim hover:text-hearten-muted transition-colors"
              >
                ← 返回修改資料
              </button>
            </>
          ) : (
            <>
          <div>
            <label className="block text-sm font-medium text-hearten-text mb-1.5">電郵</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-hearten-bg border border-hearten-border rounded-lg px-3 py-2.5 text-sm text-hearten-text placeholder-hearten-muted outline-none focus:border-hearten-rose transition-colors"
            />
          </div>

          {tab === 'register' && (
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
          )}

          <div>
            <label className="block text-sm font-medium text-hearten-text mb-1.5">密碼</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={tab === 'register' ? '最少6個字' : '輸入密碼'}
              className="w-full bg-hearten-bg border border-hearten-border rounded-lg px-3 py-2.5 text-sm text-hearten-text placeholder-hearten-muted outline-none focus:border-hearten-rose transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {error && <p className="text-hearten-rose text-sm">⚠️ {error}</p>}
          {success && <p className="text-green-400 text-sm">✅ {success}</p>}

          <button
            onClick={handleSubmit}
            disabled={!email.trim() || !password || (tab === 'register' && !username.trim()) || loading}
            className="w-full py-2.5 rounded-xl bg-hearten-rose hover:bg-hearten-rose-light disabled:opacity-40 text-white font-medium text-sm transition-colors"
          >
            {loading ? '處理中...' : tab === 'login' ? '登入' : '註冊'}
          </button>

          <p className="text-xs text-hearten-dim text-center">
            {tab === 'login' ? '未有帳戶？' : '已經有帳戶？'}
            <button onClick={() => switchTab(tab === 'login' ? 'register' : 'login')} className="text-hearten-rose ml-1 hover:underline">
              {tab === 'login' ? '註冊' : '登入'}
            </button>
          </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
