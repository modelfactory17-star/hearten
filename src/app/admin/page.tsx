'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  Users, FileText, MessageSquare, Heart,
  Eye, Trash2, Ban, Search,
  RefreshCw, Download, UserCheck, MoreHorizontal
} from 'lucide-react';

// ─── Mock Data ───────────────────────────────────────────────

const STATS = [
  { label: '總用戶', value: '1,247', change: '+12%', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: '總文章', value: '3,892', change: '+8%', icon: FileText, color: 'text-[#e11d48]', bg: 'bg-[#e11d48]/10' },
  { label: '總留言', value: '15,603', change: '+23%', icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { label: '總心心', value: '48,291', change: '+18%', icon: Heart, color: 'text-pink-400', bg: 'bg-pink-400/10' },
];

const MOCK_USERS = [
  { id: '1', username: '月光下的貓', email: 'moonlight@email.com', emoji: '🐱', posts: 23, joined: '2026-07-12', status: 'active' },
  { id: '2', username: '檸檬茶走甜', email: 'lemon@email.com', emoji: '🍋', posts: 19, joined: '2026-07-15', status: 'active' },
  { id: '3', username: '維港的風', email: 'harbour@email.com', emoji: '🌊', posts: 17, joined: '2026-07-18', status: 'active' },
  { id: '4', username: '深夜巴士', email: 'bus@email.com', emoji: '🚌', posts: 15, joined: '2026-07-20', status: 'active' },
  { id: '5', username: '旺角小王子', email: 'prince@email.com', emoji: '🤴', posts: 14, joined: '2026-07-22', status: 'active' },
  { id: '6', username: 'man168', email: 'man168@hotmail.com', emoji: '😈', posts: 3, joined: '2026-08-02', status: 'banned' },
  { id: '7', username: 'spam_bot_01', email: 'spam@tempmail.com', emoji: '🤖', posts: 47, joined: '2026-08-01', status: 'flagged' },
];

const MOCK_POSTS = [
  { id: '1', title: '出櫃之後，屋企人話要斷絕關係', author: '月光下的貓', category: 'LGBTQ+', hearts: 312, comments: 124, time: '2 小時前', status: 'published' },
  { id: '2', title: '結婚 5 年，老公話對我冇咗感覺', author: '檸檬茶走甜', category: '婚姻', hearts: 203, comments: 89, time: '4 小時前', status: 'published' },
  { id: '3', title: '發現佢電話有第二個女仔嘅曖昧訊息', author: '維港的風', category: '暗戀', hearts: 128, comments: 56, time: '6 小時前', status: 'published' },
  { id: '4', title: '30歲仲係處男，覺得自己好失敗', author: '深夜巴士', category: '樹窿', hearts: 89, comments: 47, time: '8 小時前', status: 'published' },
  { id: '5', title: '[廣告] 加我微信賺大錢 $$$', author: 'spam_bot_01', category: '樹窿', hearts: 0, comments: 2, time: '1 小時前', status: 'flagged' },
];

const MOCK_COMMENTS = [
  { id: '1', body: '加油！做自己就夠 💪', author: '檸檬茶走甜', post: '出櫃之後，屋企人話要斷絕關係', time: '1 小時前', status: 'published' },
  { id: '2', body: '同路人，我都經歷過⋯慢慢嚟', author: '旺角小王子', post: '出櫃之後，屋企人話要斷絕關係', time: '45 分鐘前', status: 'published' },
  { id: '3', body: '離婚啦，唔好委屈自己', author: '維港的風', post: '結婚 5 年，老公話對我冇咗感覺', time: '3 小時前', status: 'published' },
  { id: '4', body: '加我 TG @scam123 教你賺錢', author: 'spam_bot_01', post: '30歲仲係處男', time: '30 分鐘前', status: 'flagged' },
];

export default function AdminPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'dashboard';
  const [search, setSearch] = useState('');
  const [userFilter, setUserFilter] = useState<string>('all');

  return (
    <div className="space-y-6">
      {/* ─── DASHBOARD ─── */}
      {tab === 'dashboard' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {STATS.map(s => (
              <div key={s.label} className="bg-[#0d0d14] border border-[#1a1a2e] rounded-xl p-5 hover:border-[#2a2a3e] transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{s.label}</span>
                  <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}>
                    <s.icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white mb-1">{s.value}</p>
                <span className="text-xs text-emerald-400 font-medium">{s.change} 本週</span>
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
              <select
                value={userFilter}
                onChange={e => setUserFilter(e.target.value)}
                className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg px-3 py-1.5 text-xs text-gray-400 outline-none"
              >
                <option value="all">全部狀態</option>
                <option value="active">正常</option>
                <option value="banned">已停權</option>
                <option value="flagged">已標記</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-200 hover:bg-[#1a1a2e] transition-colors">
                <Download className="w-3.5 h-3.5" />
                匯出
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-200 hover:bg-[#1a1a2e] transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />
                刷新
              </button>
            </div>
          </div>

          {/* Table */}
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a1a2e] text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left py-3 px-4 font-medium">用戶</th>
                <th className="text-left py-3 px-4 font-medium">Email</th>
                <th className="text-center py-3 px-4 font-medium">文章</th>
                <th className="text-left py-3 px-4 font-medium">加入日期</th>
                <th className="text-center py-3 px-4 font-medium">狀態</th>
                <th className="text-right py-3 px-4 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_USERS.map(user => (
                <tr key={user.id} className="border-b border-[#1a1a2e] hover:bg-[#111118] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#e11d48]/20 flex items-center justify-center text-sm">
                        {user.emoji}
                      </div>
                      <span className="text-sm text-gray-200 font-medium">{user.username}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-400">{user.email}</td>
                  <td className="py-3 px-4 text-center text-sm text-gray-300">{user.posts}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{user.joined}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      user.status === 'active' ? 'bg-emerald-400/10 text-emerald-400' :
                      user.status === 'banned' ? 'bg-[#e11d48]/10 text-[#e11d48]' :
                      'bg-amber-400/10 text-amber-400'
                    }`}>
                      {user.status === 'active' ? '正常' : user.status === 'banned' ? '已停權' : '已標記'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {user.status === 'active' ? (
                        <button className="p-1.5 rounded-lg text-gray-500 hover:text-[#e11d48] hover:bg-[#e11d48]/10 transition-colors" title="停權">
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors" title="解除停權">
                          <UserCheck className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button className="p-1.5 rounded-lg text-gray-500 hover:text-[#e11d48] hover:bg-[#e11d48]/10 transition-colors" title="刪除">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-[#1a1a2e] transition-colors">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-[#1a1a2e]">
            <span className="text-xs text-gray-500">顯示 1-7 項，共 1,247 項</span>
            <div className="flex items-center gap-1">
              <button className="px-2.5 py-1 rounded text-xs text-gray-500 hover:bg-[#1a1a2e] transition-colors">上一頁</button>
              <button className="px-2.5 py-1 rounded text-xs bg-[#e11d48] text-white font-medium">1</button>
              <button className="px-2.5 py-1 rounded text-xs text-gray-400 hover:bg-[#1a1a2e] transition-colors">2</button>
              <button className="px-2.5 py-1 rounded text-xs text-gray-400 hover:bg-[#1a1a2e] transition-colors">3</button>
              <span className="px-1 text-gray-600">...</span>
              <button className="px-2.5 py-1 rounded text-xs text-gray-400 hover:bg-[#1a1a2e] transition-colors">125</button>
              <button className="px-2.5 py-1 rounded text-xs text-gray-500 hover:bg-[#1a1a2e] transition-colors">下一頁</button>
            </div>
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
              <select className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg px-3 py-1.5 text-xs text-gray-400 outline-none">
                <option>全部狀態</option>
                <option>已發布</option>
                <option>已標記</option>
                <option>已刪除</option>
              </select>
              <select className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg px-3 py-1.5 text-xs text-gray-400 outline-none">
                <option>全部分類</option>
                <option>心靈樹窿</option>
                <option>分手復合</option>
                <option>暗戀表白</option>
                <option>婚姻關係</option>
                <option>LGBTQ+</option>
              </select>
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a1a2e] text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left py-3 px-4 font-medium">標題</th>
                <th className="text-left py-3 px-4 font-medium">作者</th>
                <th className="text-center py-3 px-4 font-medium">分類</th>
                <th className="text-center py-3 px-4 font-medium">❤️</th>
                <th className="text-center py-3 px-4 font-medium">💬</th>
                <th className="text-left py-3 px-4 font-medium">時間</th>
                <th className="text-center py-3 px-4 font-medium">狀態</th>
                <th className="text-right py-3 px-4 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_POSTS.map(post => (
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
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      post.status === 'published' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-amber-400/10 text-amber-400'
                    }`}>
                      {post.status === 'published' ? '已發布' : '已標記'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 transition-colors" title="查看">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg text-gray-500 hover:text-[#e11d48] hover:bg-[#e11d48]/10 transition-colors" title="刪除">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between p-4 border-t border-[#1a1a2e]">
            <span className="text-xs text-gray-500">顯示 1-5 項，共 3,892 項</span>
            <div className="flex items-center gap-1">
              <button className="px-2.5 py-1 rounded text-xs text-gray-500 hover:bg-[#1a1a2e]">上一頁</button>
              <button className="px-2.5 py-1 rounded text-xs bg-[#e11d48] text-white font-medium">1</button>
              <button className="px-2.5 py-1 rounded text-xs text-gray-400 hover:bg-[#1a1a2e]">2</button>
              <span className="px-1 text-gray-600">...</span>
              <button className="px-2.5 py-1 rounded text-xs text-gray-400 hover:bg-[#1a1a2e]">390</button>
              <button className="px-2.5 py-1 rounded text-xs text-gray-500 hover:bg-[#1a1a2e]">下一頁</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── COMMENTS ─── */}
      {tab === 'comments' && (
        <div className="bg-[#0d0d14] border border-[#1a1a2e] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#1a1a2e]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                placeholder="搜尋留言..."
                className="w-56 bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-300 placeholder-gray-600 outline-none focus:border-[#e11d48] transition-colors"
              />
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a1a2e] text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left py-3 px-4 font-medium">內容</th>
                <th className="text-left py-3 px-4 font-medium">作者</th>
                <th className="text-left py-3 px-4 font-medium">文章</th>
                <th className="text-left py-3 px-4 font-medium">時間</th>
                <th className="text-center py-3 px-4 font-medium">狀態</th>
                <th className="text-right py-3 px-4 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_COMMENTS.map(comment => (
                <tr key={comment.id} className="border-b border-[#1a1a2e] hover:bg-[#111118] transition-colors">
                  <td className="py-3 px-4 max-w-xs">
                    <span className="text-sm text-gray-300 line-clamp-1">{comment.body}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-400">{comment.author}</td>
                  <td className="py-3 px-4 text-sm text-gray-500 line-clamp-1 max-w-[200px]">{comment.post}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{comment.time}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      comment.status === 'published' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-amber-400/10 text-amber-400'
                    }`}>
                      {comment.status === 'published' ? '正常' : '已標記'}
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

          <div className="flex items-center justify-between p-4 border-t border-[#1a1a2e]">
            <span className="text-xs text-gray-500">顯示 1-4 項，共 15,603 項</span>
          </div>
        </div>
      )}
    </div>
  );
}
