'use client';

interface Member {
  name: string;
  location: string;
  avatar: string;
  avatarType: 'male' | 'female';
  status: 'single' | 'dating' | 'married' | 'complex';
  level: 'newbie' | 'regular' | 'senior' | 'vip';
  interests: { label: string; match: boolean }[];
  bio: string;
  posts: number;
  staffPick?: boolean;
}

const members: Member[] = [
  {
    name: '港島阿傑',
    location: '📍 港島 · 28歲 · 💼 在職',
    avatar: '🙋',
    avatarType: 'male',
    status: 'single',
    level: 'vip',
    interests: [
      { label: '🏔️ 行山', match: true },
      { label: '📸 攝影', match: true },
      { label: '☕ 咖啡', match: false },
      { label: '🎬 電影', match: false },
      { label: '🐱 貓奴', match: false },
    ],
    bio: '做緊 IT，鍾意行山同影相。想搵個可以一齊睇日落嘅人 🌅',
    posts: 23,
  },
  {
    name: '檸檬茶走甜',
    location: '📍 九龍 · 25歲 · 💼 在職',
    avatar: '🙋‍♀️',
    avatarType: 'female',
    status: 'single',
    level: 'senior',
    interests: [
      { label: '🎨 設計', match: true },
      { label: '🐱 貓奴', match: true },
      { label: '🍳 煮食', match: false },
      { label: '📺 煲劇', match: false },
      { label: '✈️ 旅行', match: false },
    ],
    bio: 'designer · 貓奴 · 鍾意睇劇同煮嘢食。希望遇到一個識得珍惜我嘅人 🐱',
    posts: 19,
  },
  {
    name: '中大文學生',
    location: '📍 新界 · 21歲 · 🎓 在學',
    avatar: '🧑',
    avatarType: 'male',
    status: 'single',
    level: 'regular',
    interests: [
      { label: '📚 閱讀', match: true },
      { label: '🎸 結他', match: false },
      { label: '🎬 電影', match: false },
      { label: '☕ 咖啡', match: false },
    ],
    bio: '中文系 year 3，鍾意文學同音樂。想識一個可以一齊去圖書館嘅人 📖',
    posts: 8,
  },
  {
    name: '港大護理系',
    location: '📍 港島 · 20歲 · 🎓 在學',
    avatar: '👩‍🎓',
    avatarType: 'female',
    status: 'single',
    level: 'newbie',
    interests: [
      { label: '🏃 跑步', match: true },
      { label: '🐶 狗奴', match: false },
      { label: '🎵 K-Pop', match: false },
      { label: '🍰 甜品', match: false },
    ],
    bio: '護理系 year 2 · 活潑開朗 · 鍾意運動同食好西。想識多啲朋友～ 🏃‍♀️',
    posts: 3,
  },
];

const statusBadge = {
  single: { label: '💚 單身', className: 'bg-[rgba(34,197,94,0.15)] text-[#22c55e] dark:bg-[rgba(34,197,94,0.15)] dark:text-[#22c55e] light:bg-[rgba(22,163,74,0.1)] light:text-[#16a34a]' },
  dating: { label: '💙 戀愛中', className: 'bg-[rgba(59,130,246,0.12)] text-[#3b82f6]' },
  married: { label: '💜 已婚', className: 'bg-[rgba(168,85,247,0.12)] text-[#a855f7]' },
  complex: { label: '💛 關係複雜', className: 'bg-[rgba(245,158,11,0.12)] text-[#f59e0b]' },
};

const levelBadge: Record<string, { label: string; className: string }> = {
  newbie: { label: '新手', className: 'bg-[#374151] text-[#9ca3af]' },
  regular: { label: '進階', className: 'bg-[rgba(59,130,246,0.18)] text-[#60a5fa]' },
  senior: { label: '資深', className: 'bg-[rgba(168,85,247,0.18)] text-[#a78bfa]' },
  vip: { label: 'VIP', className: 'bg-[linear-gradient(135deg,#f59e0b,#e11d48)] text-white' },
};

export default function MemberGrid() {
  return (
    <>
      {/* Level Legend */}
      <div className="flex flex-wrap items-center gap-2 mb-[14px]">
        <span className="text-[11px] text-hearten-dim">💚 單身</span>
        <span className="text-[11px] text-hearten-dim">💙 戀愛中</span>
        <span className="text-[11px] text-hearten-dim">💜 已婚</span>
        <span className="text-[11px] text-hearten-dim">💛 關係複雜</span>
        <span className="ml-auto text-[11px] text-hearten-dim flex items-center gap-[5px]">
          等級：
          <span className="text-[10px] font-bold px-[7px] py-[2px] rounded-[6px] tracking-[0.03em] bg-[#374151] text-[#9ca3af]">新手</span>
          <span className="text-[10px] font-bold px-[7px] py-[2px] rounded-[6px] tracking-[0.03em] bg-[rgba(59,130,246,0.18)] text-[#60a5fa]">進階</span>
          <span className="text-[10px] font-bold px-[7px] py-[2px] rounded-[6px] tracking-[0.03em] bg-[rgba(168,85,247,0.18)] text-[#a78bfa]">資深</span>
          <span className="text-[10px] font-bold px-[7px] py-[2px] rounded-[6px] tracking-[0.03em] bg-[linear-gradient(135deg,#f59e0b,#e11d48)] text-white">VIP</span>
        </span>
      </div>

      {/* Member Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[14px]">
        {members.map((m) => (
          <div
            key={m.name}
            className={`relative bg-hearten-card border border-hearten-border rounded-[14px] p-5 transition-all duration-[0.2s] cursor-pointer hover:border-hearten-border-hover hover:-translate-y-[2px]
              ${m.staffPick ? 'border-[rgba(245,158,11,0.3)]' : ''}
            `}
          >
            {m.staffPick && (
              <span className="absolute -top-[10px] left-4 bg-[linear-gradient(135deg,#f59e0b,#e11d48)] text-white text-[10px] font-bold px-[10px] py-[3px] rounded-[8px] z-[2]">
                ⭐ 今日推薦
              </span>
            )}

            {/* Member Header */}
            <div className="flex items-start gap-3 mb-[10px]">
              {/* Avatar */}
              <div
                className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-[22px] border-2
                  ${m.avatarType === 'male'
                    ? 'bg-[linear-gradient(135deg,#1a2a3a,#1a3040)] border-[rgba(59,130,246,0.3)]'
                    : 'bg-[linear-gradient(135deg,#2a1a28,#301a30)] border-[rgba(244,114,182,0.3)]'
                  }
                `}
              >
                {m.avatar}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="text-[14.5px] font-bold text-hearten-text">{m.name}</div>
                <div className="text-[11.5px] text-hearten-dim mt-[2px]">{m.location}</div>
                <div className="flex items-center gap-1 mt-[6px] flex-wrap">
                  <span className={`inline-flex items-center gap-1 text-[10.5px] font-semibold px-2 py-[2px] rounded-[10px] ${statusBadge[m.status].className}`}>
                    {statusBadge[m.status].label}
                  </span>
                  <span className={`text-[10px] font-bold px-[7px] py-[2px] rounded-[6px] tracking-[0.03em] ${levelBadge[m.level].className}`}>
                    {levelBadge[m.level].label}
                  </span>
                </div>
              </div>
            </div>

            {/* Interest Tags */}
            <div className="flex flex-wrap gap-[5px] mt-2">
              {m.interests.map((tag) => (
                <span
                  key={tag.label}
                  className={`text-[10.5px] font-medium px-2 py-[3px] rounded-[8px] border transition-all duration-[0.15s] cursor-pointer
                    ${tag.match
                      ? 'border-[#22c55e] text-[#22c55e] bg-[rgba(34,197,94,0.15)]'
                      : 'border-hearten-border text-hearten-muted bg-transparent hover:border-hearten-rose hover:text-hearten-rose hover:bg-hearten-rose/10'
                    }
                  `}
                >
                  {tag.label}
                </span>
              ))}
            </div>

            {/* Bio */}
            <p className="text-[12.5px] text-hearten-muted mt-2 leading-[1.5] line-clamp-2">
              {m.bio}
            </p>

            {/* Footer */}
            <div className="flex items-center gap-2 mt-[14px]">
              <button className="flex items-center justify-center gap-[6px] py-[7px] px-[14px] rounded-[10px] border border-hearten-rose bg-transparent text-hearten-rose text-[12.5px] font-semibold cursor-pointer transition-all duration-[0.15s] flex-1 hover:bg-hearten-rose hover:text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[14px] h-[14px]">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Inbox
              </button>
              <span className="text-[11.5px] text-hearten-dim">{m.posts} 帖</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
