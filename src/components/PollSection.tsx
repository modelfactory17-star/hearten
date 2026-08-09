'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/db';
import type { Poll } from '@/lib/db';

function formatVotes(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString();
}

export default function PollSection() {
  const router = useRouter();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.polls.list().then(data => {
      const active = data.filter(p => p.status === 'active').slice(0, 2);
      setPolls(active);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading || polls.length === 0) return null;

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
              <span className="text-[11.5px] text-hearten-rose hover:underline">
                去投票 →
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
