'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import Footer from '@/components/Footer';
import FeedCard from '@/components/FeedCard';
import { type Post } from '@/lib/db';

// URL slug → db category_id mapping (CategoryGrid uses different slugs than db)
const SLUG_TO_DB: Record<string, string> = {
  'dating-life': 'dating-life',
  crush: 'crush',
  breakup: 'breakup',
  marriage: 'marriage',
  lgbtq: 'lgbtq',
  treehole: 'treehole',
  tarot: 'tarot',
  'work-love': 'work',
  'school-love': 'school',
  family: 'family',
  'dating-kit': 'dating',
  bedroom: 'bedroom',
};

const CAT_INFO: Record<string, { icon: string; name: string; desc: string }> = {
  'dating-life': { icon: '💑', name: '戀愛日常', desc: '拍拖大小事、甜蜜日常、相處之道' },
  crush: { icon: '💕', name: '暗戀表白', desc: '唔敢表白？曖昧緊？一齊研究' },
  breakup: { icon: '💔', name: '分手復合', desc: '失戀療癒、復合建議、點樣放低' },
  marriage: { icon: '💍', name: '婚姻關係', desc: '夫妻相處、婆媳問題、育兒壓力' },
  lgbtq: { icon: '🌈', name: 'LGBTQ+', desc: '出櫃、身份認同、同志戀愛' },
  treehole: { icon: '🌳', name: '心靈樹窿', desc: '咩都可以講，呢度冇人會 judge 你' },
  tarot: { icon: '🃏', name: '塔羅占卜', desc: '每日一牌、愛情運勢、塔羅解惑' },
  'work-love': { icon: '💼', name: '在職戀愛', desc: '職場邂逅、同事戀愛、Office 八卦' },
  'school-love': { icon: '🎓', name: '在學戀愛', desc: '校園戀愛、暗戀師兄師姐、青春心事' },
  family: { icon: '👨‍👩‍👧', name: '家庭關係', desc: '家人看法、另一半同屋企人相處之首' },
  'dating-kit': { icon: '📋', name: '交友配套', desc: '點識人、點吸引、約會攻略 · 提升自己' },
  bedroom: { icon: '🔞', name: '一知半解', desc: '有D嘢，search 唔到答案。入嚟，呢度有人講' },
};

const RULES: Record<string, string[]> = {
  'dating-life': ['尊重每對情侶嘅相處方式', '禁止人身攻擊或嘲笑他人伴侶', '分享甜蜜同時保持低調，唔好放閃放到人眼冤'],
  crush: ['尊重每個人嘅感情，唔好笑人哋嘅暗戀對象', '禁止未經同意公開他人身份', '曖昧係甜蜜嘅，唔好催人表白白'],
  breakup: ['尊重每個傷心嘅人，唔好落井下石', '禁止人身攻擊／公審前任', '分享自身經歷比教訓別人更有用'],
  marriage: ['尊重不同家庭觀念，家家有本難念的經', '禁止煽動離婚或惡意批評伴侶', '育兒觀點因人而異，理性討論'],
  lgbtq: ['呢度係安全空間，絕對禁止歧視言論', '尊重每個人嘅性取向同性別認同', '未出櫃人士嘅私隱必須保護'],
  treehole: ['咩都可以講，但唔好傷害他人', '禁止人身攻擊、網絡欺凌', '聆聽比批判更重要'],
  tarot: ['塔羅係參考，唔係絕對，保持理性', '禁止利用恐懼情緒操控他人', '尊重不同占卜師嘅解讀方式'],
  'work-love': ['尊重職場私隱，唔好爆料公司內部', '禁止未經同意分享同事資料', 'Office 戀愛有風險，理性評估'],
  'school-love': ['校園戀愛要互相尊重，禁止欺凌', '學業為重，戀愛係Bonus', '未滿18歲請保護自己，唔好分享個人資料'],
  family: ['理性討論家庭問題，禁止人身攻擊家人', '尊重不同家庭背景同價值觀', '解決方案比單純抱怨更有價值'],
  'dating-kit': ['互相尊重係基本，禁止物化他人', '分享真實經驗，禁止虛假人設', '安全約會第一，見面揀公眾地方'],
  bedroom: ['18+ 內容，未滿18歲請離開', '禁止未經同意分享他人私密照/影片', '尊重每個人嘅性觀念，禁止slut-shaming'],
};

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const dbCategory = SLUG_TO_DB[slug];
  const info = CAT_INFO[slug];
  const rules = RULES[slug];

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!dbCategory) return;
    fetch(`/api/posts?category=${encodeURIComponent(dbCategory)}`)
      .then(r => r.json())
      .then(data => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [dbCategory]);

  if (!info) {
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
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <LeftSidebar />
        </div>

        {/* Mobile sidebar overlay */}
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

        {/* Main Area */}
        <main className="flex-1 min-w-0 px-7 py-6 max-md:px-4">
          {/* Category Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{info.icon}</span>
                <div>
                  <h1 className="text-[22px] font-bold text-hearten-text">{info.name}</h1>
                  <p className="text-sm text-hearten-muted mt-1">{info.desc}</p>
                </div>
              </div>
              <button
                onClick={() => router.push(`/write?category=${encodeURIComponent(slug)}`)}
                className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-hearten-rose hover:bg-hearten-rose-light text-white text-sm font-semibold transition-all duration-[0.15s] hover:-translate-y-[1px]"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                開新話題
              </button>
            </div>
            <div className="mt-3 text-sm text-hearten-dim">
              {loading ? '載入中…' : `${posts.length} 篇貼文`}
            </div>
          </div>

          {/* 版規 */}
          {rules && (
            <div className="mb-6 bg-hearten-card border border-hearten-border rounded-xl p-4">
              <h3 className="text-sm font-bold text-hearten-muted uppercase tracking-wider mb-3">📋 版規</h3>
              <ul className="space-y-1.5">
                {rules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-hearten-muted">
                    <span className="text-hearten-rose mt-0.5 shrink-0">{i + 1}.</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Posts */}
          {loading ? (
            <div className="text-hearten-muted text-center py-12">載入中…</div>
          ) : posts.length === 0 ? (
            <div className="text-hearten-muted text-center py-12">
              <p className="text-lg mb-2">仲未有貼文</p>
              <p className="text-sm">成為第一個喺呢個話題出 post 嘅人！</p>
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
