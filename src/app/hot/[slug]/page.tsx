'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import Footer from '@/components/Footer';
import FeedCard from '@/components/FeedCard';
import { db, type Post } from '@/lib/db';

const TOPICS: Record<string, { icon: string; name: string; desc: string; relatedCategories: string[] }> = {
  'hotai': {
    icon: '💒',
    name: '何太事件 · 你點睇？',
    desc: '近期全城熱話，何太事件引發唔少討論。你點睇婚姻、金錢同感情之間嘅關係？',
    relatedCategories: ['marriage', 'breakup'],
  },
  'dating-app': {
    icon: '📱',
    name: '交友 app 邊個最好用？',
    desc: 'Tinder、Coffee Meets Bagel、Heymandi…邊個 app 最啱香港人用？分享你嘅真實經驗。',
    relatedCategories: ['dating', 'crush'],
  },
  'valentine-gift': {
    icon: '💸',
    name: '情人節禮物 budget 幾多？',
    desc: '情人節送咩好？budget 幾多先合理？男女角度大不同，一齊傾下。',
    relatedCategories: ['marriage', 'crush', 'dating'],
  },
  'marriage-flat': {
    icon: '🏠',
    name: '結婚買樓 · 香港現實',
    desc: '香港樓價高企，後生仔結婚係咪一定要買樓？租樓住先得唔得？現實vs理想。',
    relatedCategories: ['marriage'],
  },
  'baby-choice': {
    icon: '👶',
    name: '生唔生仔？年輕一代點揀',
    desc: '生育成本高、經濟壓力大，越嚟越多香港年輕夫婦選擇唔生。你點睇？',
    relatedCategories: ['marriage'],
  },
  'long-d': {
    icon: '🌐',
    name: 'Long D 移民潮 · 異地戀點算',
    desc: '移民潮下唔少情侶變 Long D。時差、距離、信任…異地戀點樣維繫？',
    relatedCategories: ['breakup', 'marriage'],
  },
};

export default function HotTopicPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const topic = TOPICS[slug];

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!topic) return;
    // Fetch posts from related categories
    Promise.all(topic.relatedCategories.map((cat) => db.posts.listByCategory(cat)))
      .then((results) => {
        // Flatten + dedupe (each sub-array is already sorted by created_at DESC)
        const seen = new Set<string>();
        const all: Post[] = [];
        for (const batch of results) {
          for (const p of batch) {
            if (!seen.has(p.id)) {
              seen.add(p.id);
              all.push(p);
            }
          }
        }
        setPosts(all.slice(0, 50));
        setLoading(false);
      });
  }, [slug]);

  if (!topic) {
    return (
      <div className="min-h-screen bg-hearten-bg">
        <Header onMenuToggle={() => setMobileMenuOpen(v => !v)} />
        <div className="flex max-w-[1500px] mx-auto">
          <div className="hidden lg:block"><LeftSidebar /></div>
          <main className="flex-1 min-w-0 px-7 py-6 max-md:px-4">
            <div className="flex items-center justify-center h-64 text-hearten-muted">呢個話題唔存在</div>
          </main>
          <RightSidebar />
        </div>
      </div>
    );
  }

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

        <main className="flex-1 min-w-0 px-7 py-6 max-md:px-4">
          {/* Topic Header */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{topic.icon}</span>
              <div>
                <h1 className="text-[22px] font-bold text-hearten-text">{topic.name}</h1>
                <p className="text-sm text-hearten-muted mt-1">{topic.desc}</p>
              </div>
            </div>
            <div className="mt-3 text-sm text-hearten-dim">
              {loading ? '載入中…' : `${posts.length} 篇相關貼文`}
            </div>
          </div>

          {/* Related Category Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {topic.relatedCategories.map((cat) => (
              <span
                key={cat}
                onClick={() => router.push(`/category/${cat}`)}
                className="px-3 py-1.5 rounded-lg bg-hearten-card border border-hearten-border text-sm text-hearten-muted cursor-pointer hover:border-hearten-rose hover:text-hearten-rose transition-all"
              >
                📂 {cat === 'breakup' ? '分手' : cat === 'crush' ? '暗戀' : cat === 'marriage' ? '婚姻' : cat === 'dating' ? '交友配套' : cat}
              </span>
            ))}
          </div>

          {/* Posts */}
          {loading ? (
            <div className="text-hearten-muted text-center py-12">載入中…</div>
          ) : posts.length === 0 ? (
            <div className="text-hearten-muted text-center py-12">
              <p className="text-base mb-2">仲未有相關貼文</p>
              <p className="text-sm">成為第一個討論呢個話題嘅人！</p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <FeedCard
                  key={post.id}
                  id={post.id}
                  emoji={post.emoji}
                  avatar_url={post.avatar_url}
                  title={post.title}
                  preview={post.preview}
                  category={post.category}
                  hearts={post.hearts}
                  replies={post.replies}
                  time={post.time}
                  anonymous={post.anonymous}
                  onClick={() => router.push(`/post/${post.slug}`)}
                />
              ))}
            </div>
          )}
        </main>

        <RightSidebar />
      </div>

      <Footer />
    </div>
  );
}
