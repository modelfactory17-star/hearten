'use client';

const categories = [
  { icon: '💔', name: '分手復合', desc: '失戀療癒、復合建議、點樣放低', count: 342, today: 12, color: 'breakup' },
  { icon: '💕', name: '暗戀 · 表白', desc: '唔敢表白？曖昧緊？一齊研究', count: 285, today: 8, color: 'crush' },
  { icon: '💍', name: '婚姻關係', desc: '夫妻相處、婆媳問題、育兒壓力', count: 198, today: 5, color: 'marriage' },
  { icon: '🌈', name: 'LGBTQ+ 社群', desc: '出櫃、身份認同、同志戀愛', count: 156, today: 6, color: 'lgbtq' },
  { icon: '🌳', name: '心靈樹窿', desc: '咩都可以講，呢度冇人會 judge 你', count: 423, today: 18, color: 'treehole' },
  { icon: '🃏', name: '塔羅占卜', desc: '每日一牌、愛情運勢、塔羅解惑', count: 87, today: 3, color: 'tarot' },
  { icon: '💼', name: '在職戀愛區', desc: '職場邂逅、同事戀愛、Office 八卦', count: 134, today: 7, color: 'work' },
  { icon: '🎓', name: '在學戀愛區', desc: '校園戀愛、暗戀師兄師姐、青春心事', count: 218, today: 11, color: 'school' },
  { icon: '📋', name: '交友配套', desc: '點識人、點吸引、約會攻略 · 提升自己', count: 156, today: 9, color: 'dating' },
  { icon: '🔞', name: '一知半解', desc: '有D嘢，search 唔到答案。入嚟，呢度有人講', count: 203, today: '18+', color: 'bedroom' },
];

const colorMap: Record<string, string> = {
  breakup: 'border-l-rose-500 hover:bg-rose-500/5',
  crush: 'border-l-pink-400 hover:bg-pink-400/5',
  marriage: 'border-l-amber-400 hover:bg-amber-400/5',
  lgbtq: 'border-l-purple-400 hover:bg-purple-400/5',
  treehole: 'border-l-green-400 hover:bg-green-400/5',
  tarot: 'border-l-indigo-400 hover:bg-indigo-400/5',
  work: 'border-l-blue-400 hover:bg-blue-400/5',
  school: 'border-l-cyan-400 hover:bg-cyan-400/5',
  dating: 'border-l-orange-400 hover:bg-orange-400/5',
  bedroom: 'border-l-red-500 hover:bg-red-500/5',
};

export default function CategoryGrid() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-sm font-bold text-hearten-muted uppercase tracking-wider">📂 話題分類</h2>
        <div className="flex-1 h-px bg-hearten-border" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {categories.map((cat) => (
          <button
            key={cat.name}
            className={`text-left bg-hearten-card border border-hearten-border border-l-2 ${colorMap[cat.color]} rounded-xl p-4 transition-all hover:-translate-y-0.5 hover:border-hearten-border-hover cursor-pointer`}
          >
            <span className="text-2xl block mb-2">{cat.icon}</span>
            <div className="font-semibold text-sm text-hearten-text mb-1">{cat.name}</div>
            <div className="text-xs text-hearten-muted mb-2 leading-relaxed">{cat.desc}</div>
            <div className="flex items-center gap-1.5 text-xs text-hearten-dim">
              <span>{cat.count} 篇</span>
              <span className="w-1 h-1 rounded-full bg-hearten-dim" />
              <span>今日 +{cat.today}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
