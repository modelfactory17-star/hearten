'use client';

import { useAdminTab } from './AdminContext';
import { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import {
  Users, FileText, MessageSquare, Heart,
  Trash2, Search, RefreshCw
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────

interface AdminUser { id: string; username: string; emoji: string; posts: number; joined: string; status: 'active' | 'banned' | 'flagged'; }
interface AdminPost { id: string; title: string; author: string; category: string; hearts: number; comments: number; time: string; }
interface AdminComment { id: string; body: string; author: string; post: string; time: string; }

export default function AdminContent() {
  const { tab } = useAdminTab();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Data
  const [stats, setStats] = useState({ users: 0, posts: 0, comments: 0, hearts: 0 });
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [comments, setComments] = useState<AdminComment[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      if (tab === 'dashboard') {
        const s = await db.admin.stats();
        if (!cancelled) { setStats(s); setLoading(false); }
      } else if (tab === 'users') {
        const u = await db.admin.users();
        if (!cancelled) { setUsers(u); setLoading(false); }
      } else if (tab === 'posts') {
        const p = await db.admin.posts();
        if (!cancelled) { setPosts(p); setLoading(false); }
      } else if (tab === 'comments') {
        const c = await db.admin.comments();
        if (!cancelled) { setComments(c); setLoading(false); }
      } else {
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [tab]);

  return (
    <div className="space-y-6">
      {/* ─── DASHBOARD ─── */}
      {tab === 'dashboard' && (
        <>
          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-500 text-sm">載入中...</div>
          ) : (
          <>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {([
              { label: '總用戶', value: stats.users.toLocaleString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
              { label: '總文章', value: stats.posts.toLocaleString(), icon: FileText, color: 'text-[#e11d48]', bg: 'bg-[#e11d48]/10' },
              { label: '總留言', value: stats.comments.toLocaleString(), icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-400/10' },
              { label: '總心心', value: stats.hearts.toLocaleString(), icon: Heart, color: 'text-pink-400', bg: 'bg-pink-400/10' },
            ]).map(s => (
              <div key={s.label} className="bg-[#0d0d14] border border-[#1a1a2e] rounded-xl p-5 hover:border-[#2a2a3e] transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{s.label}</span>
                  <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}>
                    <s.icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white mb-1">{s.value}</p>
                <span className="text-xs text-gray-600">Supabase 即時數據</span>
              </div>
            ))}
          </div>

          {/* Charts placeholder */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0d0d14] border border-[#1a1a2e] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-300">📈 用戶增長</h3>
                <select className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg px-3 py-1 text-xs text-gray-400 outline-none">
                  <option>過去 7 日</option>
                  <option>過去 30 日</option>
                </select>
              </div>
              <div className="h-48 flex items-end gap-2 px-2">
                {[35, 42, 28, 55, 38, 48, 62].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-[#e11d48]/60 hover:bg-[#e11d48] rounded-t transition-all cursor-pointer" style={{ height: `${h * 2}px` }} />
                    <span className="text-[10px] text-gray-600">{['一','二','三','四','五','六','日'][i]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#0d0d14] border border-[#1a1a2e] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-300">📊 文章分類分佈</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: '心靈樹窿', pct: 28, color: 'bg-emerald-500' },
                  { label: '分手復合', pct: 22, color: 'bg-[#e11d48]' },
                  { label: '暗戀表白', pct: 18, color: 'bg-pink-400' },
                  { label: '婚姻關係', pct: 14, color: 'bg-purple-400' },
                  { label: 'LGBTQ+', pct: 10, color: 'bg-blue-400' },
                  { label: '其他', pct: 8, color: 'bg-gray-500' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-20 text-right">{item.label}</span>
                    <div className="flex-1 bg-[#1a1a2e] rounded-full h-2">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 w-8">{item.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-[#0d0d14] border border-[#1a1a2e] rounded-xl p-5">
            <h3 className="text-sm font-medium text-gray-300 mb-4">🕐 最近動態</h3>
            <div className="space-y-3">
              {[
                { action: '新用戶註冊', detail: '檸檬茶走甜 加入了 Hearten', time: '2 分鐘前', color: 'text-blue-400' },
                { action: '新文章', detail: '「遠距離戀愛點維持」發布於 心靈樹窿', time: '15 分鐘前', color: 'text-emerald-400' },
                { action: '留言舉報', detail: 'spam_bot_01 的留言被舉報', time: '30 分鐘前', color: 'text-amber-400' },
                { action: '用戶被停權', detail: 'man168 已被停權', time: '1 小時前', color: 'text-[#e11d48]' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span className="text-gray-300 flex-1">{item.detail}</span>
                  <span className="text-xs text-gray-600">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </>
        )}
      </>
      )}

      {/* ─── USERS ─── */}
      {tab === 'users' && (
        <div className="bg-[#0d0d14] border border-[#1a1a2e] rounded-xl overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 border-b border-[#1a1a2e]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  placeholder="搜尋用戶..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-56 bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-300 placeholder-gray-600 outline-none focus:border-[#e11d48] transition-colors"
                />
              </div>
            </div>
            <button onClick={() => { setSearch(''); db.admin.users().then(setUsers); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-200 hover:bg-[#1a1a2e] transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />刷新
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-500 text-sm">載入中...</div>
          ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a1a2e] text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left py-3 px-4 font-medium">用戶</th>
                <th className="text-left py-3 px-4 font-medium">ID</th>
                <th className="text-center py-3 px-4 font-medium">文章</th>
                <th className="text-left py-3 px-4 font-medium">加入日期</th>
                <th className="text-center py-3 px-4 font-medium">狀態</th>
                <th className="text-right py-3 px-4 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(u => !search || u.username.includes(search)).map(user => (
                <tr key={user.id} className="border-b border-[#1a1a2e] hover:bg-[#111118] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#e11d48]/20 flex items-center justify-center text-sm">
                        {user.emoji}
                      </div>
                      <span className="text-sm text-gray-200 font-medium">{user.username}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500 font-mono text-xs truncate max-w-[120px]">{user.id}</td>
                  <td className="py-3 px-4 text-center text-sm text-gray-300">{user.posts}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{user.joined}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-400/10 text-emerald-400">
                      正常
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg text-gray-500 hover:text-[#e11d48] hover:bg-[#e11d48]/10 transition-colors" title="刪除">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}

          <div className="flex items-center justify-between p-4 border-t border-[#1a1a2e]">
            <span className="text-xs text-gray-500">共 {users.length} 個用戶</span>
          </div>
        </div>
      )}

      {/* ─── POSTS ─── */}
      {tab === 'posts' && (
        <div className="bg-[#0d0d14] border border-[#1a1a2e] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#1a1a2e]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  placeholder="搜尋文章..."
                  className="w-56 bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-300 placeholder-gray-600 outline-none focus:border-[#e11d48] transition-colors"
                />
              </div>
            </div>
            <button onClick={() => db.admin.posts().then(setPosts)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-200 hover:bg-[#1a1a2e] transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />刷新
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-500 text-sm">載入中...</div>
          ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a1a2e] text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left py-3 px-4 font-medium">標題</th>
                <th className="text-left py-3 px-4 font-medium">作者</th>
                <th className="text-center py-3 px-4 font-medium">分類</th>
                <th className="text-center py-3 px-4 font-medium">❤️</th>
                <th className="text-center py-3 px-4 font-medium">💬</th>
                <th className="text-left py-3 px-4 font-medium">時間</th>
                <th className="text-right py-3 px-4 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className="border-b border-[#1a1a2e] hover:bg-[#111118] transition-colors">
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-200 font-medium line-clamp-1">{post.title}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-400">{post.author}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-[#e11d48]/10 text-[#e11d48] font-medium">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-400">{post.hearts}</td>
                  <td className="py-3 px-4 text-center text-sm text-gray-400">{post.comments}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{post.time}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg text-gray-500 hover:text-[#e11d48] hover:bg-[#e11d48]/10 transition-colors" title="刪除">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}

          <div className="flex items-center justify-between p-4 border-t border-[#1a1a2e]">
            <span className="text-xs text-gray-500">共 {posts.length} 篇文章</span>
          </div>
        </div>
      )}

      {/* ─── COMMENTS ─── */}
      {tab === 'comments' && (
        <div className="bg-[#0d0d14] border border-[#1a1a2e] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#1a1a2e]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  placeholder="搜尋留言..."
                  className="w-56 bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-300 placeholder-gray-600 outline-none focus:border-[#e11d48] transition-colors"
                />
              </div>
            </div>
            <button onClick={() => db.admin.comments().then(setComments)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-200 hover:bg-[#1a1a2e] transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />刷新
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-500 text-sm">載入中...</div>
          ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a1a2e] text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left py-3 px-4 font-medium">內容</th>
                <th className="text-left py-3 px-4 font-medium">作者</th>
                <th className="text-left py-3 px-4 font-medium">文章</th>
                <th className="text-left py-3 px-4 font-medium">時間</th>
                <th className="text-right py-3 px-4 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {comments.map(comment => (
                <tr key={comment.id} className="border-b border-[#1a1a2e] hover:bg-[#111118] transition-colors">
                  <td className="py-3 px-4 max-w-xs">
                    <span className="text-sm text-gray-300 line-clamp-1">{comment.body}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-400">{comment.author}</td>
                  <td className="py-3 px-4 text-sm text-gray-500 line-clamp-1 max-w-[200px]">{comment.post}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{comment.time}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg text-gray-500 hover:text-[#e11d48] hover:bg-[#e11d48]/10 transition-colors" title="刪除">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}

          <div className="flex items-center justify-between p-4 border-t border-[#1a1a2e]">
            <span className="text-xs text-gray-500">共 {comments.length} 條留言</span>
          </div>
        </div>
      )}
    </div>
  );
}
