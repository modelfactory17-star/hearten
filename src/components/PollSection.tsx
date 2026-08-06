'use client';

interface PollOption {
  text: string;
  pct: number;
}

interface Poll {
  question: string;
  daysLeft: number;
  options: PollOption[];
  votes: number;
}

const polls: Poll[] = [
  {
    question: '💬 你覺得「已讀不回」幾耐算係有問題？',
    daysLeft: 2,
    options: [
      { text: '1-3 小時', pct: 45 },
      { text: '半日', pct: 30 },
      { text: '1 日以上', pct: 18 },
      { text: '冇問題，人人忙', pct: 7 },
    ],
    votes: 2847,
  },
  {
    question: '💍 結婚之後，你覺得財政應該點管理？',
    daysLeft: 5,
    options: [
      { text: '聯名戶口，共同管理', pct: 42 },
      { text: '各自獨立，分擔開支', pct: 33 },
      { text: '主力一方管晒', pct: 25 },
    ],
    votes: 1932,
  },
];

function formatVotes(n: number): string {
  return n.toLocaleString('en-US');
}

export default function PollSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-[14px]">
      {polls.map((poll, i) => (
        <div
          key={i}
          className="bg-hearten-card border border-hearten-border rounded-[14px] p-5 cursor-pointer transition-all duration-[0.2s] hover:border-hearten-border-hover hover:bg-hearten-card-hover"
        >
          {/* Poll Header */}
          <div className="flex items-center gap-[10px] mb-[14px]">
            <span className="text-[10px] font-bold uppercase px-[10px] py-1 rounded-[8px] tracking-[0.05em] bg-[rgba(34,197,94,0.15)] text-[#22c55e] dark:bg-[rgba(34,197,94,0.15)] dark:text-[#22c55e] light:bg-[rgba(22,163,74,0.1)] light:text-[#16a34a]">
              ● 投票中
            </span>
            <span className="ml-auto text-[11.5px] text-hearten-dim">仲有 {poll.daysLeft} 日</span>
          </div>

          {/* Question */}
          <div className="text-[15px] font-semibold text-hearten-text mb-[14px] leading-[1.4]">
            {poll.question}
          </div>

          {/* Options */}
          {poll.options.map((opt, j) => (
            <div
              key={j}
              className="flex items-center gap-[10px] py-[10px] px-3 rounded-[10px] mb-[6px] relative overflow-hidden border border-hearten-border bg-[#0d0d12] dark:bg-[#0d0d12] light:bg-hearten-bg cursor-pointer transition-all duration-[0.15s] hover:border-hearten-rose"
            >
              {/* Bar */}
              <span
                className="absolute left-0 top-0 bottom-0 bg-hearten-rose/15 dark:bg-hearten-rose/15 light:bg-hearten-rose/10 rounded-l-[10px] transition-[width] duration-[0.5s]"
                style={{ width: `${opt.pct}%` }}
              />
              <span className="relative z-[1] flex-1 text-[13.5px] text-hearten-muted">{opt.text}</span>
              <span className="relative z-[1] text-[13px] font-bold text-hearten-rose">{opt.pct}%</span>
            </div>
          ))}

          {/* Votes */}
          <div className="text-[11.5px] text-hearten-dim mt-2 text-right">
            🗳 {formatVotes(poll.votes)} 人已投票
          </div>
        </div>
      ))}
    </div>
  );
}
