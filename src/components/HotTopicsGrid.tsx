'use client';

import { useRouter } from 'next/navigation';

const hotTopics = [
  { emoji: '💒', name: '何太事件 · 你點睇？', count: '328 人討論中', badge: 'hot', slug: 'hotai' },
  { emoji: '📱', name: '交友 app 邊個最好用？', count: '256 人討論中', badge: 'hot', slug: 'dating-app' },
  { emoji: '💸', name: '情人節禮物 budget 幾多？', count: '189 人討論中', badge: 'new', slug: 'valentine-gift' },
  { emoji: '🏠', name: '結婚買樓 · 香港現實', count: '412 人討論中', badge: 'hot', slug: 'marriage-flat' },
  { emoji: '👶', name: '生唔生仔？年輕一代點揀', count: '297 人討論中', badge: 'hot', slug: 'baby-choice' },
  { emoji: '🌐', name: 'Long D 移民潮 · 異地戀點算', count: '173 人討論中', badge: 'new', slug: 'long-d' },
];

export default function HotTopicsGrid() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[10px]">
      {hotTopics.map((topic) => (
        <div
          key={topic.name}
          onClick={() => router.push(`/hot/${topic.slug}`)}
          className="flex items-center gap-3 px-4 py-[14px] rounded-[12px] bg-hearten-card border border-hearten-border cursor-pointer transition-all duration-[0.15s] hover:border-hearten-border-hover hover:bg-hearten-card-hover"
        >
          <span className="text-[28px] flex-shrink-0">{topic.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-hearten-text whitespace-nowrap overflow-hidden text-ellipsis">
              {topic.name}
            </div>
            <div className="text-xs text-hearten-dim mt-[2px]">{topic.count}</div>
          </div>
          {topic.badge === 'hot' ? (
            <span className="ml-auto text-[10px] font-semibold px-[6px] py-[2px] rounded-[8px] bg-hearten-amber text-black">
              🔥
            </span>
          ) : (
            <span className="ml-auto text-[10px] font-semibold px-[6px] py-[2px] rounded-[8px] bg-hearten-rose text-white">
              新
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
