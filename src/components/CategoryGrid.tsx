'use client';

import { useRouter } from 'next/navigation';

const categories = [
  { icon: '💑', name: '戀愛日常', desc: '拍拖大小事、甜蜜日常、相處之道', count: 0, today: 'new', color: 'dating-life' },
  { icon: '💕', name: '暗戀表白', desc: '唔敢表白？曖昧緊？一齊研究', count: 285, today: '+8', color: 'crush' },
  { icon: '💔', name: '分手復合', desc: '失戀療癒、復合建議、點樣放低', count: 342, today: '+12', color: 'breakup' },
  { icon: '💍', name: '婚姻關係', desc: '夫妻相處、婆媳問題、育兒壓力', count: 198, today: '+5', color: 'marriage' },
  { icon: '🌈', name: 'LGBTQ+', desc: '出櫃、身份認同、同志戀愛', count: 156, today: '+6', color: 'lgbtq' },
  { icon: '🌳', name: '心靈樹窿', desc: '咩都可以講，呢度冇人會 judge 你', count: 423, today: '+18', color: 'treehole' },
  { icon: '🃏', name: '塔羅占卜', desc: '每日一牌、愛情運勢、塔羅解惑', count: 87, today: '+3', color: 'tarot' },
  { icon: '💼', name: '在職戀愛', desc: '職場邂逅、同事戀愛、Office 八卦', count: 134, today: '+7', color: 'work-love' },
  { icon: '🎓', name: '在學戀愛', desc: '校園戀愛、暗戀師兄師姐、青春心事', count: 218, today: '+11', color: 'school-love' },
  { icon: '👨‍👩‍👧', name: '家庭關係', desc: '家人看法、另一半同屋企人相處', count: 0, today: 'new', color: 'family' },
  { icon: '📋', name: '交友配套', desc: '點識人、點吸引、約會攻略 · 提升自己', count: 156, today: '+9', color: 'dating-kit' },
  { icon: '🔞', name: '一知半解', desc: '有D嘢，search 唔到答案。入嚟，呢度有人講', count: 203, today: '18+', color: 'bedroom' },
];

// Warm gradient backgrounds — light, pastel tones
const darkGradients: Record<string, string> = {
  'dating-life': 'bg-[linear-gradient(135deg,#ffe4e6_0%,#fda4af_40%,#fb7185_100%)]',
  crush: 'bg-[linear-gradient(135deg,#fce7f3_0%,#f9a8d4_40%,#f472b6_100%)]',
  breakup: 'bg-[linear-gradient(135deg,#fecdd3_0%,#fda4af_40%,#fb7185_100%)]',
  marriage: 'bg-[linear-gradient(135deg,#fef3c7_0%,#fcd34d_40%,#f59e0b_100%)]',
  lgbtq: 'bg-[linear-gradient(135deg,#cffafe_0%,#67e8f9_40%,#06b6d4_100%)]',
  treehole: 'bg-[linear-gradient(135deg,#ede9fe_0%,#c4b5fd_40%,#8b5cf6_100%)]',
  tarot: 'bg-[linear-gradient(135deg,#f3e8ff_0%,#d8b4fe_40%,#a855f7_100%)]',
  'work-love': 'bg-[linear-gradient(135deg,#fef3c7_0%,#fcd34d_40%,#f59e0b_100%)]',
  'school-love': 'bg-[linear-gradient(135deg,#ccfbf1_0%,#5eead4_40%,#14b8a6_100%)]',
  family: 'bg-[linear-gradient(135deg,#e0e7ff_0%,#a5b4fc_40%,#818cf8_100%)]',
  'dating-kit': 'bg-[linear-gradient(135deg,#e0e7ff_0%,#a5b4fc_40%,#6366f1_100%)]',
  bedroom: 'bg-[linear-gradient(135deg,#ffe4e6_0%,#fda4af_40%,#f43f5e_100%)]',
};

export default function CategoryGrid() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[6px] mb-2">
      {categories.map((cat) => (
        <button
          key={cat.color}
          onClick={() => router.push(`/category/${cat.color}`)}
          className={`relative rounded-[6px] overflow-hidden cursor-pointer transition-all duration-[0.25s] aspect-[4/3] flex flex-col justify-end pt-[14px] pr-[16px] pb-[10px] pl-[16px] border border-hearten-border hover:-translate-y-[3px] hover:border-hearten-border-hover text-left
            ${darkGradients[cat.color]}
          `}
        >
          {/* Gradient overlay ::before */}
          <span className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,transparent_10%,rgba(0,0,0,0.12)_100%)] light:bg-[linear-gradient(180deg,transparent_10%,rgba(255,255,255,0.3)_100%)]" />

          {/* Content above overlay */}
          <span className="relative z-[2] text-[40px] mb-[10px] leading-none">
            {cat.icon}
          </span>
          <span className="relative z-[2] text-[16px] font-bold text-hearten-text mb-[3px]">
            {cat.name}
          </span>
          <span className="relative z-[2] text-sm text-hearten-muted mb-[6px] leading-[1.4]">
            {cat.desc}
          </span>
          <span className="relative z-[2] flex items-center gap-[6px] text-xs text-hearten-dim">
            <span>{cat.count} 篇</span>
            <span className="w-[3px] h-[3px] rounded-full bg-hearten-dim" />
            <span>{cat.today === 'new' || cat.today === '18+' ? cat.today : `今日 ${cat.today}`}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
