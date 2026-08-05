'use client';

import { useState } from 'react';
import { TrendingUp, Clock, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import FeedCard from '@/components/FeedCard';
import RightSidebar from '@/components/RightSidebar';
import CategoryGrid from '@/components/CategoryGrid';

const mockPosts = [
  {
    id: '1',
    emoji: '😔',
    title: '男朋友成日已讀不回，係咪即係唔愛我？',
    preview: '我同男朋友一齊咗半年，最近佢成日已讀不回，幾個鐘先覆一次。我問佢係咪唔想理我，佢又話係我諗多咗...我真係好攰，唔知點算好。',
    category: '💔 分手',
    hearts: 42,
    replies: 18,
    time: '2 小時前',
    anonymous: '匿名小熊',
  },
  {
    id: '2',
    emoji: '🌍',
    title: '遠距離戀愛 — 英國 vs 香港，8 個鐘時差點維持？',
    preview: '男朋友去咗英國讀 master，我仲喺香港做嘢。每日得朝早同凌晨可以傾幾分鐘，慢慢覺得佢好似離我愈嚟愈遠...大家有冇試過 long d？',
    category: '💕 暗戀',
    hearts: 67,
    replies: 34,
    time: '5 小時前',
    anonymous: '倫敦的月光',
  },
  {
    id: '3',
    emoji: '💔',
    title: '發現佢電話有第二個女仔嘅曖昧訊息',
    preview: '噚日佢沖涼嘅時候，佢電話彈咗個 notification，我唔小心睇到...係一個叫「Tracy❤️」嘅女仔 send 嚟嘅。我個心即刻涼咗一半，唔知應唔應該出聲...',
    category: '💔 分手',
    hearts: 128,
    replies: 56,
    time: '8 小時前',
    anonymous: '心碎的魚',
  },
  {
    id: '4',
    emoji: '😔',
    title: '30歲仲係處男/女，覺得自己好失敗',
    preview: '身邊個個朋友都結咗婚有埋小朋友，我連拖都未拍過。成日覺得係咪自己有問題，定係緣份未到...有時夜晚諗起會喊。',
    category: '🌳 樹窿',
    hearts: 89,
    replies: 47,
    time: '12 小時前',
    anonymous: '深夜咖啡',
  },
  {
    id: '5',
    emoji: '💍',
    title: '結婚 5 年，老公話對我冇咗感覺',
    preview: '我哋有個 3 歲嘅小朋友。上星期佢突然話：「我覺得我哋之間得返責任，冇咗愛。」我好崩潰，唔知點面對...小朋友點算...',
    category: '💍 婚姻',
    hearts: 203,
    replies: 89,
    time: '1 日前',
    anonymous: '迷失的媽媽',
  },
  {
    id: '6',
    emoji: '🌈',
    title: '出櫃之後，屋企人話要斷絕關係',
    preview: '上個月同爸媽出咗櫃，佢哋嘅反應比我想像中仲要差。老豆話當冇生過我呢個仔，阿媽日日喊。我知我做嘅嘢冇錯，但個心真係好痛...',
    category: '🌈 LGBTQ+',
    hearts: 312,
    replies: 124,
    time: '1 日前',
    anonymous: '彩虹下的我',
  },
  {
    id: '7',
    emoji: '🃏',
    title: '塔羅話我今年會遇到真命天子，但係...',
    preview: '搵咗塔羅師傅睇，話我今年 10 月會遇到 the one。但而家都 8 月啦，完全冇跡象...係咪我太心急？定係塔羅唔準？',
    category: '🃏 塔羅',
    hearts: 45,
    replies: 22,
    time: '2 日前',
    anonymous: '等愛的玫瑰',
  },
];

type SortMode = 'trending' | 'latest';

export default function Home() {
  const [sort, setSort] = useState<SortMode>('trending');

  return (
    <div className="min-h-screen bg-hearten-bg">
      <Header />

      <div className="flex max-w-[1400px] mx-auto">
        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Main Feed */}
        <main className="flex-1 min-w-0 px-6 py-6">
          {/* Hero Title */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-hearten-text mb-1">揀個話題，開始傾 💬</h1>
            <p className="text-sm text-hearten-muted">搵一個你關心嘅話題，睇吓其他香港人嘅故事、認識新朋友</p>
          </div>

          {/* Category Grid */}
          <CategoryGrid />

          {/* Section Divider */}
          <div className="flex items-center gap-3 my-8">
            <h2 className="text-sm font-bold text-hearten-muted uppercase tracking-wider">💬 最新心事</h2>
            <div className="flex-1 h-px bg-hearten-border" />
          </div>

          {/* Sort Tabs — sticky */}
          <div className="sticky top-14 z-40 bg-hearten-bg/90 backdrop-blur -mx-6 px-6 py-3 border-b border-hearten-border mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSort('trending')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    sort === 'trending'
                      ? 'bg-hearten-rose/10 text-hearten-rose'
                      : 'text-hearten-muted hover:text-white'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  熱門
                </button>
                <button
                  onClick={() => setSort('latest')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    sort === 'latest'
                      ? 'bg-hearten-rose/10 text-hearten-rose'
                      : 'text-hearten-muted hover:text-white'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  最新
                </button>
              </div>

              {/* Mobile CTA */}
              <button className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-hearten-rose text-white text-sm font-medium">
                <MessageCircle className="w-4 h-4" />
                寫心事
              </button>
            </div>
          </div>

          {/* Feed */}
          <div className="space-y-3">
            {mockPosts.map((post) => (
              <FeedCard key={post.id} {...post} />
            ))}
          </div>

          {/* Load more */}
          <div className="py-6 text-center">
            <button className="px-6 py-2.5 rounded-xl border border-hearten-border text-sm text-hearten-muted hover:text-white hover:border-gray-500 transition-colors">
              載入更多心事...
            </button>
          </div>
        </main>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
}
