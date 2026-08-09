'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Image, X } from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import { db, type AuthUser } from '@/lib/db';
import { createClient } from '@/utils/supabase/client';

const CATEGORIES = [
  { id: 'dating-life', icon: '💑', name: '戀愛日常' },
  { id: 'crush', icon: '💕', name: '暗戀表白' },
  { id: 'breakup', icon: '💔', name: '分手復合' },
  { id: 'marriage', icon: '💍', name: '婚姻關係' },
  { id: 'lgbtq', icon: '🌈', name: 'LGBTQ+' },
  { id: 'treehole', icon: '🌳', name: '心靈樹窿' },
  { id: 'tarot', icon: '🃏', name: '塔羅占卜' },
  { id: 'work', icon: '💼', name: '在職戀愛' },
  { id: 'school', icon: '🎓', name: '在學戀愛' },
  { id: 'family', icon: '👨‍👩‍👧', name: '家庭關係' },
  { id: 'dating', icon: '📋', name: '交友配套' },
  { id: 'bedroom', icon: '🔞', name: '一知半解' },
];

export default function WritePage() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [newPostSlug, setNewPostSlug] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Image upload
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadingImg, setUploadingImg] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);

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
    const newPost = await db.posts.create(user.id, title.trim(), body.trim(), cat.name, category, uploadedImages);
    setLoading(false);
    if (!newPost) { setError('發佈失敗，請再試'); return; }
    setNewPostSlug(newPost.slug);
    setSubmitted(true);
  };

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith('image/')) { setError('只支援圖片格式'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('圖片太大，上限 5MB'); return; }
    setError('');
    setUploadingImg(true);
    const supabase = createClient();
    const path = `post-images/${user.id}/${Date.now()}.${file.name.split('.').pop()}`;
    const { error: upErr } = await supabase.storage.from('post-images').upload(path, file);
    if (!upErr) {
      const { data: { publicUrl } } = supabase.storage.from('post-images').getPublicUrl(path);
      setUploadedImages(prev => [...prev, publicUrl]);
    } else {
      setError(`上傳失敗：${upErr.message}`);
    }
    setUploadingImg(false);
    if (imageRef.current) imageRef.current.value = '';
  }

  function removeImage(index: number) {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  }

  const layout = (content: React.ReactNode) => (
    <div className="min-h-screen bg-hearten-bg">
      <Header onMenuToggle={() => setMobileMenuOpen(v => !v)} />
      <div className="flex max-w-[1500px] mx-auto">
        <div className="hidden lg:block"><LeftSidebar /></div>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-[260px] bg-hearten-bg shadow-xl animate-slide-in overflow-y-auto">
              <div className="flex justify-end p-3">
                <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-hearten-card text-hearten-muted">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
              <LeftSidebar />
            </div>
          </div>
        )}
        <main className="flex-1 min-w-0 px-7 py-6 max-md:px-4">
          {content}
        </main>
        <RightSidebar />
      </div>
      <Footer />
    </div>
  );

  if (submitted) {
    return layout(
      <div className="max-w-lg mx-auto py-20 text-center">
        <div className="text-5xl mb-4">💌</div>
        <h1 className="text-xl font-bold text-hearten-text mb-2">心事已發出！</h1>
        <p className="text-hearten-muted mb-6">
          你嘅心事已經發布到「{CATEGORIES.find(c => c.id === category)?.name}」。
        </p>
        <p className="text-hearten-dim text-sm mb-8">其他會員而家可以睇到同回覆你嘅心事。</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => router.push(`/post/${newPostSlug}`)} className="px-6 py-2.5 rounded-xl bg-hearten-rose text-white font-medium transition-colors hover:bg-hearten-rose-light">
            睇自己個 Post
          </button>
          <button onClick={() => router.push('/')} className="px-6 py-2.5 rounded-xl border border-hearten-border text-hearten-text hover:border-hearten-rose transition-colors font-medium">
            睇其他心事
          </button>
          <button onClick={() => { setSubmitted(false); setTitle(''); setBody(''); setCategory(''); }} className="px-6 py-2.5 rounded-xl border border-hearten-border text-hearten-text hover:border-hearten-rose transition-colors font-medium">
            再寫一篇
          </button>
        </div>
      </div>
    );
  }

  return layout(
    <div className="max-w-lg mx-auto">
      <div className="bg-hearten-card border border-hearten-border rounded-2xl p-6">
        <h1 className="text-xl font-bold text-hearten-text mb-1">分享你嘅心事 💭</h1>
        <p className="text-sm text-hearten-muted mb-6">分享你嘅故事，同其他會員真誠交流。</p>

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

        {/* Images */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-hearten-text mb-2">附加圖片</label>
          {uploadedImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {uploadedImages.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-hearten-border">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(i)}
                    className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <input ref={imageRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <button onClick={() => imageRef.current?.click()} disabled={uploadingImg}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-hearten-border hover:border-hearten-rose text-hearten-muted hover:text-hearten-text text-sm transition-colors">
            <Image className="w-4 h-4" />
            {uploadingImg ? '上傳中...' : uploadedImages.length > 0 ? `再加多張 (${uploadedImages.length})` : '加入圖片'}
          </button>
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
          {loading ? '發佈中...' : '發布心事'}
        </button>
      </div>
    </div>
  );
}
