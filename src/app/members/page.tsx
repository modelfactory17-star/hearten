'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import Footer from '@/components/Footer';
import IconBadge from '@/components/IconBadge';
import { Users, MessageCircle, Heart, Bookmark, UserPlus } from 'lucide-react';

const MEMBER_FEATURES = [
  { icon: MessageCircle, title: 'Inbox 私訊', desc: '同其他會員一對一傾，唔使公開。' },
  { icon: UserPlus, title: '互相追蹤', desc: 'follow 你欣賞嘅會員，第一時間睇到佢哋嘅心事。' },
  { icon: Heart, title: '俾心心同留言', desc: '支持同路人，等對方知道你喺度。' },
  { icon: Bookmark, title: '收藏帖子', desc: 'save 低想再睇嘅內容，隨時重溫。' },
];

export default function MembersPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-hearten-bg">
      <Header onMenuToggle={() => setMobileMenuOpen(v => !v)} />

      <div className="flex max-w-[1500px] mx-auto">
        <div className="hidden lg:block">
          <LeftSidebar />
        </div>

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

        <main className="flex-1 min-w-0 px-7 py-8 max-md:px-4">
          <div className="flex items-center gap-3 mb-2">
            <IconBadge icon={Users} size="md" />
            <h1 className="text-2xl font-bold text-hearten-text">會員追蹤</h1>
          </div>
          <p className="text-sm text-hearten-muted mb-8">Hearten 係實名註冊社群。會員之間可以互相追蹤、Inbox 私訊，一齊傾心事。</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {MEMBER_FEATURES.map((f) => (
              <div key={f.title} className="bg-hearten-card border border-hearten-border rounded-xl p-5">
                <IconBadge icon={f.icon} size="md" className="mb-3" />
                <h2 className="text-lg font-bold text-hearten-text mb-1">{f.title}</h2>
                <p className="text-sm text-hearten-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-hearten-card border border-hearten-border rounded-xl p-6 text-center">
            <p className="text-base font-semibold text-hearten-text mb-1">想認識大家？</p>
            <p className="text-sm text-hearten-muted mb-4">註冊成為會員，就可以入去社群一齊傾。</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link href="/register" className="px-5 py-2.5 rounded-xl bg-hearten-rose hover:bg-hearten-rose-light text-white text-sm font-semibold transition-colors">註冊成為會員</Link>
              <Link href="/" className="px-5 py-2.5 rounded-xl border border-hearten-border text-hearten-text hover:border-hearten-rose text-sm font-semibold transition-colors">睇社群</Link>
            </div>
          </div>
        </main>

        <RightSidebar />
      </div>

      <Footer />
    </div>
  );
}
