'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface HotTopic {
  emoji: string;
  text: string;
  num: string;
  slug: string;
  image: string | null;
}

export default function HotTopicsGrid() {
  const router = useRouter();
  const [topics, setTopics] = useState<HotTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sidebar')
      .then(r => r.json())
      .then(data => {
        if (data.hotTopics?.length) setTopics(data.hotTopics);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[10px]">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="h-[68px] rounded-[12px] bg-hearten-card border border-hearten-border animate-pulse" />
        ))}
      </div>
    );
  }

  if (!topics.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[10px]">
      {topics.map((topic) => (
        <div
          key={topic.slug}
          onClick={() => router.push(`/post/${topic.slug}`)}
          className="flex items-center gap-3 px-4 py-[14px] rounded-[12px] bg-hearten-card border border-hearten-border cursor-pointer transition-all duration-[0.15s] hover:border-hearten-border-hover hover:bg-hearten-card-hover"
        >
          <span className="text-[28px] flex-shrink-0">{topic.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-hearten-text whitespace-nowrap overflow-hidden text-ellipsis">
              {topic.text}
            </div>
            <div className="text-xs text-hearten-dim mt-[2px]">{topic.num}</div>
          </div>
          {topic.image && (
            <img src={topic.image} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
}
