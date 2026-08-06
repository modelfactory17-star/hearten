'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send } from 'lucide-react';
import { db, type AuthUser } from '@/lib/db';

const CATEGORIES = [
  { id: 'breakup', icon: '💔', name: '分手復合' },
  { id: 'crush', icon: '💕', name: '暗戀 · 表白' },
  { id: 'marriage', icon: '💍', name: '婚姻關係' },
  { id: 'lgbtq', icon: '🌈', name: 'LGBTQ+ 社群' },
  { id: 'treehole', icon: '🌳', name: '心靈樹窿' },
  { id: 'tarot', icon: '🃏', name: '塔羅占卜' },
  { id: 'work', icon: '💼', name: '在職戀愛區' },
  { id: 'school', icon: '🎓', name: '在學戀愛區' },
  { id: 'dating', icon: '📋', name: '交友配套' },
  { id: 'bedroom', icon: '🔞', name: '一知半解' },
];

export default function WritePage() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    db.auth.getUser().then(setUser);
  }, []);

  const handleSubmit = async () => {
    if (!user) {
      window.dispatchEvent(new Event('hearten:open-login'));
      return;
    }
    if (!category) { setError('請選擇話題分類'); return; }
    if (!title.trim()) { setError('請輸入標題'); return; }
    if (!body.trim()) { setError('請寫低你嘅心事'); return; }
    setError('');
    setLoading(true);
    const cat = CATEGORIES.find(c => c.id === category)!;
    const newPost = await db.posts.create(user.id, title.trim(), body.trim(), cat.name, category);
    setLoading(false);
    if (!newPost) { setError('發佈失敗，請再試'); return; }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-hearten-bg">
        <div className="sticky top-0 z-50 h-14 border-b border-hearten-border bg-hearten-bg/90 backdrop-blur flex items-center px-4">
          <button onClick={() => router.push('/')} className="flex items-center gap-1 text-hearten-muted hover:text-hearten-text transition-colors text-base">
            <ArrowLeft className="w-5 h-5" />
            返回首頁
          </button>
        </div>
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="text-5xl mb-4">💌</div>
          <h1 className="text-xl font-bold text-hearten-text mb-2">心事已發出！</h1>
          <p className="text-hearten-muted mb-6">
            你嘅心事已經匿名發布到「{CATEGORIES.find(c => c.id === category)?.name}」。
          </p>
          <p className="text-hearten-dim text-sm mb-8">其他會員而家可以睇到同回覆你嘅心事。</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => router.push('/')} className="px-6 py-2.5 rounded-xl bg-hearten-rose text-white font-medium transition-colors hover:bg-hearten-rose-light">
              睇其他心事
            </button>
            <button onClick={() => { setSubmitted(false); setTitle(''); setBody(''); setCategory(''); }} className="px-6 py-2.5 rounded-xl border border-hearten-border text-hearten-text hover:border-hearten-rose transition-colors font-medium">
              再寫一篇
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hearten-bg">
      {/* Top bar */}
      <div className="sticky top-0 z-50 h-14 border-b border-hearten-border bg-hearten-bg/90 backdrop-blur flex items-center px-4 gap-4">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-hearten-muted hover:text-hearten-text transition-colors text-base">
          <ArrowLeft className="w-5 h-5" />
          返回上頁
        </button>
        <div className="flex-1" />
        <span className="text-base font-medium text-hearten-muted">寫心事</span>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-hearten-card border border-hearten-border rounded-2xl p-6">
          <h1 className="text-xl font-bold text-hearten-text mb-1">分享你嘅心事 💭</h1>
          <p className="text-sm text-hearten-muted mb-6">所有心事都會匿名發布，冇人知道你係邊個。</p>

          {/* Category */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-hearten-text mb-2">話題分類</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                    category === cat.id
                      ? 'bg-hearten-rose/20 border border-hearten-rose/40 text-hearten-rose'
                      : 'border border-hearten-border text-hearten-muted hover:border-gray-500 hover:text-hearten-muted'
                  }`}
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-hearten-text mb-2">標題</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="用一句話概括你嘅心事..."
              maxLength={80}
              className="w-full bg-hearten-bg border border-hearten-border rounded-lg px-4 py-3 text-base text-hearten-text placeholder-hearten-muted outline-none focus:border-hearten-rose transition-colors"
            />
            <p className="text-xs text-hearten-dim mt-1 text-right">{title.length}/80</p>
          </div>

          {/* Body */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-hearten-text mb-2">內容</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="放心寫低你想講嘅嘢，呢度冇人會 judge 你..."
              rows={8}
              className="w-full bg-hearten-bg border border-hearten-border rounded-lg px-4 py-3 text-base text-hearten-text placeholder-hearten-muted outline-none resize-none focus:border-hearten-rose transition-colors"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-hearten-rose text-sm mb-4">⚠️ {error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !category || !title.trim() || !body.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-hearten-rose hover:bg-hearten-rose-light disabled:opacity-40 text-white font-medium text-base transition-colors"
          >
            <Send className="w-5 h-5" />
            {loading ? '發佈中...' : '匿名發布心事'}
          </button>
        </div>
      </div>
    </div>
  );
}
