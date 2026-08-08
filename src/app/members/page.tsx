'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import Footer from '@/components/Footer';
import { db } from '@/lib/db';

interface Member {
  id: string;
  username: string;
  emoji: string;
  avatar_url: string | null;
  bio: string | null;
  posts_count: number;
  hearts_received: number;
  joined: string;
}

const PODIUM_MEDALS = ['🥇', '🥈', '🥉'];
const PODIUM_HEIGHTS = ['h-28', 'h-20', 'h-16'];
const PODIUM_COLORS = [
  'bg-amber-400',
  'bg-slate-300',
  'bg-amber-700',
];

export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const stats = await db.admin.users();
      // Get profile details for top users
      const enriched = await Promise.all(
        stats.slice(0, 24).map(async (s) => {
          const profile = await db.auth.getUserByUsername(s.username);
          return {
            id: s.id,
            username: s.username,
            emoji: s.emoji || '🐱',
            avatar_url: profile?.avatar_url || null,
            bio: profile?.bio || null,
            posts_count: s.posts,
            hearts_received: profile?.hearts_received || 0,
            joined: s.joined,
          };
        })
      );
      const sorted = enriched.sort((a, b) => b.posts_count - a.posts_count);
      setMembers(sorted);
      setLoading(false);
    }
    load();
  }, []);

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
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">👥</span>
            <h1 className="text-[22px] font-bold text-hearten-text">會員追蹤</h1>
          </div>
          <p className="text-sm text-hearten-muted mb-8">認識 Hearten 最活躍嘅會員，睇下佢哋嘅故事</p>

          {loading ? (
            <div className="text-hearten-muted text-center py-12">載入中…</div>
          ) : members.length === 0 ? (
            <div className="text-hearten-muted text-center py-12">暫時未有會員</div>
          ) : (
            <>
              {/* Podium: Top 3 */}
              <div className="flex items-end justify-center gap-3 sm:gap-5 mb-10 mt-4">
                {members.slice(0, 3).map((m, i) => (
                  <div
                    key={m.id}
                    onClick={() => router.push(`/user/${encodeURIComponent(m.username)}`)}
                    className="flex flex-col items-center cursor-pointer group"
                  >
                    {/* Avatar */}
                    <div className="relative mb-2">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-[3px] border-hearten-border bg-hearten-card group-hover:border-hearten-rose transition-all">
                        {m.avatar_url ? (
                          <img src={m.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="w-full h-full flex items-center justify-center text-3xl">{m.emoji}</span>
                        )}
                      </div>
                      <span className="absolute -top-1 -right-1 text-2xl drop-shadow-md">{PODIUM_MEDALS[i]}</span>
                    </div>
                    {/* Name */}
                    <p className="text-sm font-bold text-hearten-text mb-1 text-center">{m.username}</p>
                    <p className="text-xs text-hearten-dim">{m.posts_count} 貼文 · {m.hearts_received} ❤️</p>
                    {/* Podium block */}
                    <div className={`w-20 sm:w-24 ${PODIUM_HEIGHTS[i]} ${PODIUM_COLORS[i]} rounded-t-lg mt-2 flex items-end justify-center pb-1`}>
                      <span className="text-white text-2xl font-black">{i + 1}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Grid: #4+ */}
              {members.length > 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {members.slice(3).map((m, i) => (
                    <div
                      key={m.id}
                      onClick={() => router.push(`/user/${encodeURIComponent(m.username)}`)}
                      className="p-5 rounded-xl bg-hearten-card border border-hearten-border cursor-pointer hover:border-hearten-rose transition-all text-center"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-hearten-dim">#{i + 4}</span>
                        {m.avatar_url ? (
                          <span className="w-12 h-12 rounded-full overflow-hidden inline-block">
                            <img src={m.avatar_url} alt="" className="w-full h-full object-cover" />
                          </span>
                        ) : (
                          <span className="text-3xl">{m.emoji}</span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-hearten-text mb-1">{m.username}</h3>
                      {m.bio && (
                        <p className="text-sm text-hearten-muted mb-3 line-clamp-2">{m.bio}</p>
                      )}
                      <div className="flex items-center justify-center gap-4 text-sm text-hearten-dim">
                        <span>{m.posts_count} 貼文</span>
                        <span>{m.hearts_received} ❤️</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {members.length <= 3 && (
                <p className="text-hearten-muted text-center text-sm mt-3">更多會員即將加入 ✨</p>
              )}
            </>
          )}
        </main>

        <RightSidebar />
      </div>

      <Footer />
    </div>
  );
}
