'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import Footer from '@/components/Footer';
import { db, Poll } from '@/lib/db';

// ─── Demo fallback data (shown when DB has no polls) ───

const DEMO_POLLS: Poll[] = [
  {
    id: 'demo-1', title: '你最鍾意邊種約會方式？',
    description: '第一次約會嘅時候，邊種方式最得你心？',
    status: 'active', totalVotes: 156,
    options: [
      { id: 'd1a', text: '🎬 睇戲 + 食飯', votes: 68 },
      { id: 'd1b', text: '☕ 咖啡店傾偈', votes: 42 },
      { id: 'd1c', text: '🌳 公園散步', votes: 21 },
      { id: 'd1d', text: '🎨 手作工作坊', votes: 25 },
    ],
    userVotes: [], createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-2', title: '另一半最需要咩特質？',
    description: '揀伴侶嘅時候，邊樣最重要？（可選多項）',
    status: 'active', totalVotes: 312,
    options: [
      { id: 'd2a', text: '💬 溝通能力', votes: 128 },
      { id: 'd2b', text: '😂 幽默感', votes: 89 },
      { id: 'd2c', text: '🫂 同理心', votes: 56 },
      { id: 'd2d', text: '💪 責任感', votes: 39 },
    ],
    userVotes: [], createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-3', title: '你點睇異地戀？',
    description: 'Long D 有冇將來？分享你嘅睇法',
    status: 'active', totalVotes: 198,
    options: [
      { id: 'd3a', text: '❤️ 只要有愛就得', votes: 72 },
      { id: 'd3b', text: '⚠️ 好難維持，但可以試', votes: 84 },
      { id: 'd3c', text: '❌ 唔睇好，遲早分手', votes: 42 },
    ],
    userVotes: [], createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-4', title: '情人節禮物預算幾多？',
    description: '上個情人節，你花咗幾多錢買禮物？',
    status: 'closed', totalVotes: 445,
    options: [
      { id: 'd4a', text: '💰 $500 以下', votes: 180 },
      { id: 'd4b', text: '💸 $500 - $1,000', votes: 156 },
      { id: 'd4c', text: '💎 $1,000 - $3,000', votes: 78 },
      { id: 'd4d', text: '👑 $3,000 以上', votes: 31 },
    ],
    userVotes: [], createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-5', title: '結婚要唔要擺酒？',
    description: '傳統擺酒 vs 簡單註冊，你點揀？',
    status: 'closed', totalVotes: 387,
    options: [
      { id: 'd5a', text: '🎉 一定要擺，開心 share', votes: 145 },
      { id: 'd5b', text: '🤝 簡單食餐飯算', votes: 167 },
      { id: 'd5c', text: '✈️ 旅行結婚更開心', votes: 75 },
    ],
    userVotes: [], createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-6', title: '另一半同屋企人相處問題？',
    description: '屋企人唔鍾意你另一半，你會點做？',
    status: 'closed', totalVotes: 298,
    options: [
      { id: 'd6a', text: '🙋 企另一半嗰邊', votes: 112 },
      { id: 'd6b', text: '🏠 盡量協調兩邊', votes: 98 },
      { id: 'd6c', text: '😔 聽屋企人話分手', votes: 45 },
      { id: 'd6d', text: '⏳ 俾啲時間大家', votes: 43 },
    ],
    userVotes: [], createdAt: new Date().toISOString(),
  },
];

// ─── Poll Card Component ───

function PollCard({ poll, userId, isAdmin, authChecked, onVote, onClose }: {
  poll: Poll;
  userId: string | null;
  isAdmin: boolean;
  authChecked: boolean;
  onVote: (pollId: string, optionIds: string[]) => void;
  onClose: (pollId: string) => void;
}) {
  const [selected, setSelected] = useState<string[]>(poll.userVotes || []);
  const [voting, setVoting] = useState(false);
  const isActive = poll.status === 'active';
  const hasVoted = poll.userVotes && poll.userVotes.length > 0;

  // Reset selection when poll data changes
  useEffect(() => { setSelected(poll.userVotes || []); }, [poll.userVotes, poll.id]);

  const toggleOption = (oid: string) => {
    if (!isActive || !userId || voting) return;
    setSelected(prev =>
      prev.includes(oid) ? prev.filter(id => id !== oid) : [...prev, oid]
    );
  };

  const handleVote = async () => {
    if (selected.length === 0 || !userId) return;
    setVoting(true);
    await onVote(poll.id, selected);
    setVoting(false);
  };

  const maxVoteForBar = Math.max(1, ...poll.options.map(o => o.votes));

  return (
    <div className="bg-hearten-card border border-hearten-border rounded-xl p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold px-2 py-[3px] rounded-full ${
              isActive ? 'bg-green-500/15 text-green-500' : 'bg-hearten-dim/15 text-hearten-dim'
            }`}>
              {isActive ? '進行中' : '已結束'}
            </span>
          </div>
          <h3 className="text-base font-bold text-hearten-text">{poll.title}</h3>
          {poll.description && (
            <p className="text-sm text-hearten-muted mt-1">{poll.description}</p>
          )}
        </div>
        {isAdmin && isActive && (
          <button
            onClick={() => onClose(poll.id)}
            className="shrink-0 text-xs text-hearten-muted hover:text-hearten-rose transition-colors px-2 py-1 rounded-lg hover:bg-hearten-rose/10"
          >
            結束投票
          </button>
        )}
      </div>

      {/* Options */}
      <div className="mt-4 space-y-2">
        {poll.options.map((opt) => {
          const isSelected = selected.includes(opt.id);
          const showBar = !isActive || hasVoted;
          const pct = Math.round((opt.votes / maxVoteForBar) * 100);

          return (
            <div key={opt.id} className="relative">
              {showBar && (
                <div
                  className="absolute inset-0 rounded-lg transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: isSelected ? 'rgb(225 29 72 / 0.25)' : 'rgb(148 163 184 / 0.12)',
                    minWidth: '4px',
                  }}
                />
              )}
              <button
                onClick={() => toggleOption(opt.id)}
                disabled={!isActive || !userId || hasVoted}
                className={`relative w-full flex items-center justify-between px-4 py-3 rounded-lg border text-left transition-all
                  ${isActive && userId && !hasVoted
                    ? isSelected
                      ? 'border-hearten-rose bg-hearten-rose/10 cursor-pointer'
                      : 'border-hearten-border hover:border-hearten-border-hover cursor-pointer'
                    : 'border-transparent cursor-default'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  {/* Checkbox indicator */}
                  {isActive && !hasVoted && userId && (
                    <div className={`w-[18px] h-[18px] rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                      isSelected ? 'bg-hearten-rose border-hearten-rose' : 'border-hearten-dim'
                    }`}>
                      {isSelected && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                      )}
                    </div>
                  )}
                  <span className={`text-sm ${hasVoted && isSelected ? 'font-semibold text-hearten-text' : 'text-hearten-text'}`}>
                    {opt.text}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {showBar && (
                    <span className="text-sm font-semibold text-hearten-dim tabular-nums">{opt.votes}</span>
                  )}
                  {hasVoted && isSelected && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-hearten-rose">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Vote button + info */}
      <div className="mt-4 flex items-center justify-between">
        {!authChecked ? null : !userId ? (
          <p className="text-sm text-hearten-dim">
            <button
              onClick={() => window.dispatchEvent(new Event('hearten:open-login'))}
              className="text-hearten-rose hover:underline font-medium"
            >
              登入
            </button>
            {' '}以參與投票
          </p>
        ) : isActive && !hasVoted ? (
          <>
            <p className="text-xs text-hearten-dim">可選多項</p>
            {selected.length > 0 && (
              <button
                onClick={handleVote}
                disabled={voting}
                className="px-4 py-1.5 rounded-lg bg-hearten-rose hover:bg-hearten-rose-light text-white text-sm font-semibold transition-all"
              >
                {voting ? '投票中...' : '提交投票'}
              </button>
            )}
          </>
        ) : (
          <p className="text-xs text-hearten-dim">
            {hasVoted ? '✅ 你已經投票' : isAdmin ? '' : ''}
          </p>
        )}
        <p className="text-xs text-hearten-dim">
          {poll.totalVotes > 0 ? `${poll.totalVotes} 人投票` : '未有人投票'}
        </p>
      </div>
    </div>
  );
}

// ─── Create Poll Modal ───

function CreatePollModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const addOption = () => setOptions([...options, '']);
  const removeOption = (i: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, idx) => idx !== i));
  };
  const updateOption = (i: number, val: string) => {
    const copy = [...options];
    copy[i] = val;
    setOptions(copy);
  };

  const handleCreate = async () => {
    setError('');
    if (!title.trim()) { setError('請輸入投票標題'); return; }
    const filled = options.filter(o => o.trim());
    if (filled.length < 2) { setError('最少需要2個選項'); return; }
    setCreating(true);
    const result = await db.polls.create(title.trim(), description.trim(), filled.map(o => o.trim()));
    setCreating(false);
    if (result) {
      onCreated();
      onClose();
    } else {
      setError('建立失敗，請再試一次');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-hearten-card border border-hearten-border rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-hearten-text">建立新投票</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-hearten-bg text-hearten-muted">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-400/10 px-3 py-2 rounded-lg mb-4">{error}</p>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-hearten-text mb-1.5 block">投票標題</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="例如：你最鍾意邊種約會方式？"
              className="w-full px-3 py-2.5 rounded-lg bg-hearten-bg border border-hearten-border text-hearten-text placeholder-hearten-dim focus:outline-none focus:border-hearten-rose text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-hearten-text mb-1.5 block">描述（可選）</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="補充說明..."
              className="w-full px-3 py-2.5 rounded-lg bg-hearten-bg border border-hearten-border text-hearten-text placeholder-hearten-dim focus:outline-none focus:border-hearten-rose text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-hearten-text mb-2 block">選項</label>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={opt}
                    onChange={e => updateOption(i, e.target.value)}
                    placeholder={`選項 ${i + 1}`}
                    className="flex-1 px-3 py-2.5 rounded-lg bg-hearten-bg border border-hearten-border text-hearten-text placeholder-hearten-dim focus:outline-none focus:border-hearten-rose text-sm"
                  />
                  {options.length > 2 && (
                    <button
                      onClick={() => removeOption(i)}
                      className="p-2 rounded-lg hover:bg-hearten-rose/10 text-hearten-muted hover:text-hearten-rose"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addOption}
              className="mt-2 text-sm text-hearten-rose hover:text-hearten-rose-light font-medium"
            >
              + 新增選項
            </button>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-hearten-border text-hearten-muted hover:text-hearten-text text-sm font-medium transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="flex-1 px-4 py-2.5 rounded-xl bg-hearten-rose hover:bg-hearten-rose-light text-white text-sm font-semibold transition-all disabled:opacity-50"
          >
            {creating ? '建立中...' : '建立投票'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [useDemo, setUseDemo] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const reloadPolls = async () => {
    setLoading(true);
    if (!useDemo) {
      const data = await db.polls.list(userId || undefined);
      if (data.length > 0) {
        setPolls(data);
      } else {
        setPolls(DEMO_POLLS);
        setUseDemo(true);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    // Check auth — use getSession() for instant cached result
    (async () => {
      const supabase = (await import('@/utils/supabase/client')).createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userId = session.user.id;
        setUserId(userId);
        // Check admin
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', userId).single();
        setIsAdmin(profile?.role === 'admin');
        // Load polls
        setLoading(true);
        const data = await db.polls.list(userId);
        if (data.length === 0) {
          setPolls(DEMO_POLLS);
          setUseDemo(true);
        } else {
          setPolls(data);
          setUseDemo(false);
        }
        setLoading(false);
      } else {
        setLoading(true);
        setPolls(DEMO_POLLS);
        setUseDemo(true);
        setLoading(false);
      }
      setAuthChecked(true);
    })();
  }, []);

  const handleVote = async (pollId: string, optionIds: string[]) => {
    if (!userId || useDemo) {
      // Demo: simulate vote locally
      setPolls(prev => prev.map(p => {
        if (p.id !== pollId) return p;
        const newOpts = p.options.map(o => ({
          ...o,
          votes: optionIds.includes(o.id) ? o.votes + (p.userVotes.includes(o.id) ? 0 : 1) : o.votes - (p.userVotes.includes(o.id) && !optionIds.includes(o.id) ? 1 : 0),
        }));
        return {
          ...p,
          options: newOpts,
          userVotes: optionIds,
          totalVotes: p.totalVotes + (p.userVotes.length === 0 ? 1 : 0),
        };
      }));
      return;
    }

    const ok = await db.polls.vote(pollId, optionIds, userId);
    if (ok) reloadPolls();
  };

  const handleClose = async (pollId: string) => {
    if (useDemo) {
      setPolls(prev => prev.map(p => p.id === pollId ? { ...p, status: 'closed' as const } : p));
      return;
    }
    const ok = await db.polls.closePoll(pollId);
    if (ok) reloadPolls();
  };

  const activePolls = polls.filter(p => p.status === 'active');
  const closedPolls = polls.filter(p => p.status === 'closed');

  return (
    <div className="min-h-screen bg-hearten-bg">
      <Header onMenuToggle={() => setMobileMenuOpen(v => !v)} />

      <div className="flex max-w-[1500px] mx-auto">
        <div className="hidden lg:block">
          <LeftSidebar />
        </div>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-[260px] bg-hearten-bg shadow-xl animate-slide-in overflow-y-auto">
              <div className="flex justify-end p-3">
                <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-hearten-card text-hearten-muted">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
              <LeftSidebar />
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0 px-7 py-8 max-md:px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📊</span>
              <h1 className="text-[22px] font-bold text-hearten-text">投票區</h1>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-hearten-rose hover:bg-hearten-rose-light text-white text-sm font-semibold transition-all"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                新投票
              </button>
            )}
          </div>
          <p className="text-sm text-hearten-muted mb-8">參與投票表達你嘅意見，每個投票每人可以投多個選項</p>

          {loading ? (
            <div className="text-hearten-muted text-center py-12">載入中…</div>
          ) : (
            <div className="space-y-8">
              {/* Active polls */}
              {activePolls.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <h2 className="text-sm font-bold uppercase tracking-[0.04em] text-hearten-muted">進行中 · {activePolls.length}</h2>
                  </div>
                  <div className="space-y-4">
                    {activePolls.map(p => (
                      <PollCard key={p.id} poll={p} userId={userId} isAdmin={isAdmin} authChecked={authChecked} onVote={handleVote} onClose={handleClose} />
                    ))}
                  </div>
                </section>
              )}

              {/* Closed polls */}
              {closedPolls.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-hearten-dim" />
                    <h2 className="text-sm font-bold uppercase tracking-[0.04em] text-hearten-muted">已結束 · {closedPolls.length}</h2>
                  </div>
                  <div className="space-y-4">
                    {closedPolls.map(p => (
                      <PollCard key={p.id} poll={p} userId={userId} isAdmin={isAdmin} authChecked={authChecked} onVote={handleVote} onClose={handleClose} />
                    ))}
                  </div>
                </section>
              )}

              {activePolls.length === 0 && closedPolls.length === 0 && (
                <div className="text-hearten-muted text-center py-12">
                  <p className="text-4xl mb-3">📊</p>
                  <p>暫時未有投票</p>
                  {isAdmin && (
                    <button onClick={() => setShowCreate(true)} className="mt-3 text-sm text-hearten-rose hover:underline">
                      建立第一個投票
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </main>

        <RightSidebar />
      </div>

      <Footer />

      {showCreate && (
        <CreatePollModal
          onClose={() => setShowCreate(false)}
          onCreated={() => reloadPolls()}
        />
      )}
    </div>
  );
}
