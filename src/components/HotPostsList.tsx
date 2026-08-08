'use client';

interface HotPost {
  rank: number;
  title: string;
  author: string;
  time: string;
  category: string;
  hearts: number;
  comments: number;
}

const hotPosts: HotPost[] = [
  { rank: 1, title: '出櫃之後，屋企人話要斷絕關係', author: '彩虹下的我', time: '2 小時前', category: '🌈 LGBTQ+', hearts: 312, comments: 124 },
  { rank: 2, title: '結婚 5 年，老公話對我冇咗感覺', author: '迷失的媽媽', time: '5 小時前', category: '💍 婚姻', hearts: 203, comments: 89 },
  { rank: 3, title: '發現佢電話有第二個女仔嘅曖昧訊息', author: '心碎的魚', time: '8 小時前', category: '💔 分手', hearts: 128, comments: 56 },
  { rank: 4, title: '30歲仲未拍過拖，覺得自己好失敗', author: '深夜咖啡', time: '12 小時前', category: '🌳 樹窿', hearts: 89, comments: 47 },
  { rank: 5, title: '遠距離戀愛 — 英國 vs 香港點維持？', author: '倫敦的月光', time: '1 日前', category: '💕 暗戀', hearts: 67, comments: 34 },
  { rank: 6, title: '男朋友成日已讀不回，係咪唔愛我？', author: '匿名小熊', time: '2 日前', category: '💔 分手', hearts: 42, comments: 18 },
];

export default function HotPostsList() {
  return (
    <div className="flex flex-col gap-2">
      {hotPosts.map((post) => (
        <div
          key={post.rank}
          className="flex items-center gap-[14px] px-4 py-[14px] rounded-[12px] bg-hearten-card border border-hearten-border cursor-pointer transition-all duration-[0.15s] hover:bg-hearten-card-hover hover:border-hearten-border-hover"
        >
          {/* Rank */}
          <span
            className={`w-7 text-[14px] font-bold text-center flex-shrink-0
              ${post.rank <= 3 ? 'text-hearten-rose' : 'text-hearten-dim'}
            `}
          >
            {post.rank}
          </span>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="text-[14.5px] font-semibold text-hearten-text whitespace-nowrap overflow-hidden text-ellipsis mb-[3px]">
              {post.title}
            </div>
            <div className="text-sm text-hearten-dim">
              {post.author} · {post.time} · {post.category}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-[14px] flex-shrink-0">
            <span className="flex items-center gap-1 text-[12.5px] text-hearten-dim">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[14px] h-[14px]">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {post.hearts}
            </span>
            <span className="flex items-center gap-1 text-[12.5px] text-hearten-dim">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[14px] h-[14px]">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              {post.comments}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
