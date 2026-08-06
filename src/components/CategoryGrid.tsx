'use client';

import { useRouter } from 'next/navigation';

const categories = [
  { icon: '💔', name: '分手復合', desc: '失戀療癒、復合建議、點樣放低', count: 342, today: '+12', color: 'breakup' },
  { icon: '💕', name: '暗戀 · 表白', desc: '唔敢表白？曖昧緊？一齊研究', count: 285, today: '+8', color: 'crush' },
  { icon: '💍', name: '婚姻關係', desc: '夫妻相處、婆媳問題、育兒壓力', count: 198, today: '+5', color: 'marriage' },
  { icon: '🌈', name: 'LGBTQ+ 社群', desc: '出櫃、身份認同、同志戀愛', count: 156, today: '+6', color: 'lgbtq' },
  { icon: '🌳', name: '心靈樹窿', desc: '咩都可以講，呢度冇人會 judge 你', count: 423, today: '+18', color: 'treehole' },
  { icon: '🃏', name: '塔羅占卜', desc: '每日一牌、愛情運勢、塔羅解惑', count: 87, today: '+3', color: 'tarot' },
  { icon: '💼', name: '在職戀愛區', desc: '職場邂逅、同事戀愛、Office 八卦', count: 134, today: '+7', color: 'work-love' },
  { icon: '🎓', name: '在學戀愛區', desc: '校園戀愛、暗戀師兄師姐、青春心事', count: 218, today: '+11', color: 'school-love' },
  { icon: '📋', name: '交友配套', desc: '點識人、點吸引、約會攻略 · 提升自己', count: 156, today: '+9', color: 'dating-kit' },
  { icon: '🔞', name: '一知半解', desc: '有D嘢，search 唔到答案。入嚟，呢度有人講', count: 203, today: '18+', color: 'bedroom' },
];

// Warm gradient backgrounds per category (lighter, brand-colored)
const darkGradients: Record<string, string> = {
  breakup: 'bg-[linear-gradient(135deg,#881337_0%,#be123c_40%,#e11d48_100%)]',
  crush: 'bg-[linear-gradient(135deg,#831843_0%,#be185d_40%,#ec4899_100%)]',
  marriage: 'bg-[linear-gradient(135deg,#92400e_0%,#d97706_40%,#f59e0b_100%)]',
  lgbtq: 'bg-[linear-gradient(135deg,#155e75_0%,#0891b2_40%,#06b6d4_100%)]',
  treehole: 'bg-[linear-gradient(135deg,#5b21b6_0%,#7c3aed_40%,#8b5cf6_100%)]',
  tarot: 'bg-[linear-gradient(135deg,#6b21a8_0%,#9333ea_40%,#a855f7_100%)]',
  'work-love': 'bg-[linear-gradient(135deg,#92400e_0%,#d97706_40%,#f59e0b_100%)]',
  'school-love': 'bg-[linear-gradient(135deg,#115e59_0%,#0d9488_40%,#14b8a6_100%)]',
  'dating-kit': 'bg-[linear-gradient(135deg,#4338ca_0%,#6366f1_40%,#8b5cf6_100%)]',
  bedroom: 'bg-[linear-gradient(135deg,#9f1239_0%,#e11d48_40%,#f43f5e_100%)]',
};

// Border colors for light mode per category
const lightBorders: Record<string, string> = {
  breakup: 'light:border-l-[4px] light:border-l-[#e11d48]',
  crush: 'light:border-l-[4px] light:border-l-[#ec4899]',
  marriage: 'light:border-l-[4px] light:border-l-[#f59e0b]',
  lgbtq: 'light:border-l-[4px] light:border-l-[#06b6d4]',
  treehole: 'light:border-l-[4px] light:border-l-[#8b5cf6]',
  tarot: 'light:border-l-[4px] light:border-l-[#a855f7]',
  'work-love': 'light:border-l-[4px] light:border-l-[#f59e0b]',
  'school-love': 'light:border-l-[4px] light:border-l-[#14b8a6]',
  'dating-kit': 'light:border-l-[4px] light:border-l-[#8b5cf6]',
  bedroom: 'light:border-l-[4px] light:border-l-[#881337]',
};

export default function CategoryGrid() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[14px] mb-2">
      {categories.map((cat) => (
        <button
          key={cat.color}
          onClick={() => router.push(`/category/${cat.color}`)}
          className={`relative rounded-[16px] overflow-hidden cursor-pointer transition-all duration-[0.25s] aspect-[5/4] flex flex-col justify-end p-[18px] border border-hearten-border hover:-translate-y-[3px] hover:border-hearten-border-hover text-left
            ${darkGradients[cat.color]}
            light:bg-hearten-card light:!bg-none ${lightBorders[cat.color]}
          `}
        >
          {/* Gradient overlay ::before */}
          <span className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,transparent_20%,rgba(0,0,0,0.25)_100%)] light:bg-[linear-gradient(180deg,transparent_30%,rgba(255,240,245,0.5)_100%)]" />

          {/* Content above overlay */}
          <span className="relative z-[2] text-[40px] mb-[10px] leading-none [filter:drop-shadow(0_4px_8px_rgba(0,0,0,0.5))]">
            {cat.icon}
          </span>
          <span className="relative z-[2] text-[16px] font-bold text-white light:text-hearten-text mb-[3px]">
            {cat.name}
          </span>
          <span className="relative z-[2] text-[12.5px] text-white/60 light:text-hearten-muted mb-[6px] leading-[1.4]">
            {cat.desc}
          </span>
          <span className="relative z-[2] flex items-center gap-[6px] text-[11.5px] text-white/40 light:text-hearten-dim">
            <span>{cat.count} 篇</span>
            <span className="w-[3px] h-[3px] rounded-full bg-white/30 light:bg-hearten-dim" />
            <span>今日 {cat.today}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
