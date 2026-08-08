'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    // Check if we have a recovery session
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true);
      }
    });
    // Also check current session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
  }, []);

  const handleReset = async () => {
    if (password.length < 6) {
      setError('密碼最少需要6個字');
      return;
    }
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess('密碼已重設！');
      setTimeout(() => router.push('/'), 1500);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-hearten-bg flex items-center justify-center p-4">
      <div className="bg-hearten-card border border-hearten-border rounded-2xl p-6 w-full max-w-sm">
        <h1 className="text-lg font-bold text-hearten-text mb-2">🔐 重設密碼</h1>

        {!ready ? (
          <p className="text-sm text-hearten-muted">正在驗證...</p>
        ) : success ? (
          <p className="text-green-400 text-sm">✅ {success}</p>
        ) : (
          <>
            <p className="text-sm text-hearten-muted mb-4">請輸入新密碼</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="最少6個字"
              className="w-full bg-hearten-bg border border-hearten-border rounded-lg px-3 py-2.5 text-sm text-hearten-text placeholder-hearten-muted outline-none focus:border-hearten-rose transition-colors mb-3"
              onKeyDown={(e) => e.key === 'Enter' && handleReset()}
            />
            {error && <p className="text-hearten-rose text-sm mb-3">⚠️ {error}</p>}
            <button
              onClick={handleReset}
              disabled={password.length < 6 || loading}
              className="w-full py-2.5 rounded-xl bg-hearten-rose hover:bg-hearten-rose-light disabled:opacity-40 text-white font-medium text-sm transition-colors"
            >
              {loading ? '處理中...' : '重設密碼'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
