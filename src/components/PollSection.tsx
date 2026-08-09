'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/db';
import type { Poll } from '@/lib/db';

// Fallback demo polls when DB is empty
const DEMO_POLLS: Poll[] = [
  {
    id: 'demo-home-1', title: '💬 你覺得「已讀不回」幾耐算係有問題？',
    description: '', status: 'active', totalVotes: 2847,
    options: [
      { id: 'h1a', text: '1-3 小時', votes: 1281 },
      { id: 'h1b', text: '半日', votes: 854 },
      { id: 'h1c', text: '1 日以上', votes: 512 },
      { id: 'h1d', text: '冇問題，人人忙', votes: 200 },
    ],
    userVotes: [], createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-home-2', title: '💍 結婚之後，你覺得財政應該點管理？',
    description: '', status: 'active', totalVotes: 1932,
    options: [
      { id: 'h2a', text: '聯名戶口，共同管理', votes: 811 },
      { id: 'h2b', text: '各自獨立，分擔開支', votes: 638 },
      { id: 'h2c', text: '主力一方管晒', votes: 483 },
    ],
    userVotes: [], createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-home-3', title: '❤️ 另一半最緊要咩特質？',
    description: '', status: 'active', totalVotes: 3201,
    options: [
      { id: 'h3a', text: '幽默感', votes: 1152 },
      { id: 'h3b', text: '責任感', votes: 960 },
      { id: 'h3c', text: '溝通能力', votes: 1089 },
    ],
    userVotes: [], createdAt: new Date().toISOString(),
  },
];

function formatVotes(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString();
}

export default function PollSection() {
  const router = useRouter();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.polls.list().then(data => {
      const active = data.filter(p => p.status === 'active').slice(0, 3);
      setPolls(active.length > 0 ? active : DEMO_POLLS);
      setLoading(false);
    }).catch(() => {
      setPolls(DEMO_POLLS);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-[14px]">
      {polls.map((poll) => {
        const maxV = Math.max(1, ...poll.options.map(o => o.votes));
        return (
          <div
            key={poll.id}
            onClick={() => router.push('/polls')}
            className="bg-hearten-card border border-hearten-border rounded-[14px] p-5 cursor-pointer transition-all duration-[0.2s] hover:border-hearten-rose/50 hover:-translate-y-[1px]"
          >
            {/* Header */}
            <div className="flex items-center gap-[10px] mb-[14px]">
              <span className="text-[10px] font-bold uppercase px-[10px] py-1 rounded-[8px] tracking-[0.05em] bg-green-500/15 text-green-500">
                ● 投票中
              </span>
            </div>

            {/* Question */}
            <div className="text-[15px] font-semibold text-hearten-text mb-[14px] leading-[1.4]">
              {poll.title}
            </div>

            {/* Options */}
            {poll.options.slice(0, 3).map((opt) => {
              const pct = Math.round((opt.votes / maxV) * 100);
              return (
                <div
                  key={opt.id}
                  className="flex items-center gap-[10px] py-[10px] px-3 rounded-[10px] mb-[6px] relative overflow-hidden border border-hearten-border bg-hearten-rose/[0.04] cursor-pointer transition-all duration-[0.15s]"
                >
                  <span
                    className="absolute left-0 top-0 bottom-0 bg-hearten-rose/10 rounded-l-[10px] transition-[width] duration-[0.5s]"
                    style={{ width: `${pct}%` }}
                  />
                  <span className="relative z-[1] flex-1 text-[13.5px] text-hearten-muted truncate">{opt.text}</span>
                  <span className="relative z-[1] text-[13px] font-bold text-hearten-rose">{pct}%</span>
                </div>
              );
            })}

            {/* Footer */}
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11.5px] text-hearten-dim">
                🗳 {formatVotes(poll.totalVotes)} 人已投票
              </span>
              <span className="text-[11.5px] text-hearten-rose font-medium">
                去投票 →
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
