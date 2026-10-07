'use client';

import { useAdminTab } from './AdminContext';
import { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import {
  Users, FileText, MessageSquare, Heart,
  Trash2, Search, RefreshCw, Plus, UserCog, Pencil, X
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────

interface AdminUser { id: string; username: string; emoji: string; posts: number; joined: string; status: 'active' | 'banned' | 'flagged'; }
interface AdminPost { id: string; title: string; author: string; username: string; category: string; hearts: number; comments: number; time: string; body?: string; category_id?: string; emoji?: string; created_at?: string; }
interface AdminComment { id: string; body: string; author: string; username: string; post: string; time: string; created_at?: string; }
interface AdminPreset { id: string; username: string; emoji: string; email: string; account_type: string; posts: number; }

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);
  if (diffMin < 1) return '啱啱';
  if (diffMin < 60) return `${diffMin} 分鐘前`;
  if (diffHr < 24) return `${diffHr} 小時前`;
  if (diffDay < 7) return `${diffDay} 日前`;
  return date.toLocaleDateString('zh-HK', { month: 'short', day: 'numeric' });
}

const CATEGORIES = [
  { id: 'dating-life', icon: '💞', name: '戀愛日常' },
  { id: 'crush', icon: '💕', name: '暗戀表白' },
  { id: 'breakup', icon: '💔', name: '分手復合' },
  { id: 'marriage', icon: '💍', name: '婚姻關係' },
  { id: 'lgbtq', icon: '🌈', name: 'LGBTQ+' },
  { id: 'treehole', icon: '🌳', name: '心靈樹窿' },
  { id: 'tarot', icon: '🃏', name: '塔羅占卜' },
  { id: 'ziwei', icon: '⭐', name: '紫微斗數' },
  { id: 'work', icon: '💼', name: '在職戀愛' },
  { id: 'school', icon: '🎓', name: '在學戀愛' },
  { id: 'family', icon: '👨‍👩‍👧', name: '家庭關係' },
  { id: 'dating', icon: '📋', name: '交友配套' },
  { id: 'bedroom', icon: '🔞', name: '一知半解' },
];

function mapPostRow(row: Record<string, unknown>): AdminPost {
  return {
    id: row.id as string, title: row.title as string,
    author: ((row.profiles as Record<string, unknown> | null)?.username as string) || '匿名用戶',
    username: ((row.profiles as Record<string, unknown> | null)?.username as string) || '',
    category: (row.category as string) || '',
    hearts: (row.hearts as number) || 0,
    comments: (row.replies as number) || 0,
    time: timeAgo(row.created_at as string),
    body: (row.body as string) || '',
    category_id: (row.category_id as string) || '',
    emoji: (row.emoji as string) || '😔',
    created_at: (row.created_at as string) || '',
  };
}

function mapCommentRow(row: Record<string, unknown>): AdminComment {
  return {
    id: row.id as string, body: row.body as string,
    author: ((row.profiles as Record<string, unknown> | null)?.username as string) || '匿名用戶',
    username: ((row.profiles as Record<string, unknown> | null)?.username as string) || '',
    post: ((row.posts as Record<string, unknown> | null)?.title as string) || '',
    time: timeAgo(row.created_at as string),
    created_at: (row.created_at as string) || '',
  };
}

function toLocalInput(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminContent() {
  const { tab } = useAdminTab();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [postForm, setPostForm] = useState<{ post: AdminPost | null } | null>(null);
  const [commentForm, setCommentForm] = useState<{ comment: AdminComment | null } | null>(null);

  // Data
  const [stats, setStats] = useState({ users: 0, posts: 0, comments: 0, hearts: 0 });
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [presets, setPresets] = useState<AdminPreset[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      if (tab === 'dashboard') {
        const res = await fetch('/api/admin/stats');
        const s = await res.json();
        if (!cancelled) { setStats(s); setLoading(false); }
      } else if (tab === 'users') {
        const res = await fetch('/api/admin/users');
        const u = await res.json();
        if (!cancelled) { setUsers(Array.isArray(u) ? u : []); setLoading(false); }
      } else if (tab === 'posts') {
        const res = await fetch('/api/admin/posts');
        const raw = await res.json();
        const p = (Array.isArray(raw) ? raw : []).map(mapPostRow);
        if (!cancelled) { setPosts(p); setLoading(false); }
      } else if (tab === 'comments') {
        const res = await fetch('/api/admin/comments');
        const raw = await res.json();
        const c = (Array.isArray(raw) ? raw : []).map(mapCommentRow);
        if (!cancelled) { setComments(c); setLoading(false); }
      } else if (tab === 'presets') {
        const p = await db.admin.presets();
        if (!cancelled) { setPresets(p); setLoading(false); }
      } else {
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [tab]);

  async function handleDelete(type: 'user' | 'post' | 'comment', id: string) {
    if (!confirm(`確定要刪除這個${type === 'user' ? '用戶' : type === 'post' ? '文章' : '留言'}？此操作無法復原。`)) return;
    setDeleting(id);
    const res = await fetch('/api/admin/delete', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, id }) });
    if (res.ok) {
      if (type === 'user') setUsers(prev => prev.filter(u => u.id !== id));
      else if (type === 'post') setPosts(prev => prev.filter(p => p.id !== id));
      else setComments(prev => prev.filter(c => c.id !== id));
    } else {
      const { error } = await res.json();
      alert(`刪除失敗：${error}`);
    }
    setDeleting(null);
  }

  async function refreshPosts() {
    const res = await fetch('/api/admin/posts');
    const raw = await res.json();
    setPosts((Array.isArray(raw) ? raw : []).map(mapPostRow));
  }

  async function refreshComments() {
    const res = await fetch('/api/admin/comments');
    const raw = await res.json();
    setComments((Array.isArray(raw) ? raw : []).map(mapCommentRow));
  }

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
            <button onClick={async () => { setSearch(''); const res = await fetch('/api/admin/users'); const u = await res.json(); setUsers(Array.isArray(u) ? u : []); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-200 hover:bg-[#1a1a2e] transition-colors">
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
                      <a href={`/user/${encodeURIComponent(user.username)}?admin=1`} target="_blank" rel="noopener noreferrer"
                        className="text-sm text-[#e11d48] hover:underline font-medium">{user.username}</a>
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
                      <button onClick={() => handleDelete('user', user.id)} disabled={deleting === user.id} className="p-1.5 rounded-lg text-gray-500 hover:text-[#e11d48] hover:bg-[#e11d48]/10 transition-colors disabled:opacity-30" title="刪除">
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
            <div className="flex items-center gap-2">
              <button onClick={() => setPostForm({ post: null })} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-[#e11d48] hover:bg-[#e11d48]/80 text-white transition-colors">
                <Plus className="w-3.5 h-3.5" />加文章
              </button>
              <button onClick={async () => {
                const res = await fetch('/api/admin/posts');
                const raw = await res.json();
                const p = (Array.isArray(raw) ? raw : []).map(mapPostRow);
                setPosts(p);
              }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-200 hover:bg-[#1a1a2e] transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />刷新
              </button>
            </div>
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
                  <td className="py-3 px-4 text-sm">
                    {post.username ? (
                      <a href={`/user/${encodeURIComponent(post.username)}?admin=1`} target="_blank" rel="noopener noreferrer"
                        className="text-[#e11d48] hover:underline">{post.author}</a>
                    ) : (
                      <span className="text-gray-400">{post.author}</span>
                    )}
                  </td>
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
                      <button onClick={() => setPostForm({ post })} className="p-1.5 rounded-lg text-gray-500 hover:text-[#e11d48] hover:bg-[#e11d48]/10 transition-colors" title="編輯">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete('post', post.id)} disabled={deleting === post.id} className="p-1.5 rounded-lg text-gray-500 hover:text-[#e11d48] hover:bg-[#e11d48]/10 transition-colors disabled:opacity-30" title="刪除">
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
            <div className="flex items-center gap-2">
              <button onClick={() => setCommentForm({ comment: null })} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-[#e11d48] hover:bg-[#e11d48]/80 text-white transition-colors">
                <Plus className="w-3.5 h-3.5" />加留言
              </button>
              <button onClick={async () => {
                const res = await fetch('/api/admin/comments');
                const raw = await res.json();
                const c = (Array.isArray(raw) ? raw : []).map(mapCommentRow);
                setComments(c);
              }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-200 hover:bg-[#1a1a2e] transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />刷新
              </button>
            </div>
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
                  <td className="py-3 px-4 text-sm">
                    {comment.username ? (
                      <a href={`/user/${encodeURIComponent(comment.username)}?admin=1`} target="_blank" rel="noopener noreferrer"
                        className="text-[#e11d48] hover:underline">{comment.author}</a>
                    ) : (
                      <span className="text-gray-400">{comment.author}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500 line-clamp-1 max-w-[200px]">{comment.post}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{comment.time}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setCommentForm({ comment })} className="p-1.5 rounded-lg text-gray-500 hover:text-[#e11d48] hover:bg-[#e11d48]/10 transition-colors" title="編輯">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete('comment', comment.id)} disabled={deleting === comment.id} className="p-1.5 rounded-lg text-gray-500 hover:text-[#e11d48] hover:bg-[#e11d48]/10 transition-colors disabled:opacity-30" title="刪除">
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

      {/* ─── PRESETS ─── */}
      {tab === 'presets' && <PresetsPanel presets={presets} loading={loading} onRefresh={() => db.admin.presets().then(setPresets)} />}

      {postForm && <PostFormModal post={postForm.post} onClose={() => setPostForm(null)} onSaved={() => { setPostForm(null); refreshPosts(); }} />}
      {commentForm && <CommentFormModal comment={commentForm.comment} onClose={() => setCommentForm(null)} onSaved={() => { setCommentForm(null); refreshComments(); }} />}
    </div>
  );
}

// ─── Presets Panel ───

function PresetsPanel({ presets, loading, onRefresh }: { presets: AdminPreset[]; loading: boolean; onRefresh: () => void }) {
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [result, setResult] = useState<{ username: string; email: string; password: string } | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  async function handleCreate() {
    if (!newName.trim() || newName.trim().length < 2) return;
    setCreating(true);
    const res = await fetch('/api/admin/presets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: newName.trim() }),
    });
    const data = await res.json();
    if (data.ok) {
      setResult(data.user);
      setNewName('');
      onRefresh();
    } else {
      alert('建立失敗：' + (data.error || '未知錯誤'));
    }
    setCreating(false);
  }

  async function handleToggle(id: string, currentType: string) {
    setToggling(id);
    const res = await fetch('/api/admin/presets', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, account_type: currentType }),
    });
    const data = await res.json();
    if (data.ok) {
      onRefresh();
    } else {
      alert('切換失敗：' + (data.error || '未知錯誤'));
    }
    setToggling(null);
  }

  return (
    <div className="space-y-4">
      {/* Create Card */}
      <div className="bg-[#0d0d14] border border-[#1a1a2e] rounded-xl p-5">
        <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#e11d48]" />
          建立預設 Account
        </h3>
        <div className="flex items-center gap-3">
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            placeholder="輸入用戶名稱..."
            className="flex-1 bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-[#e11d48] transition-colors"
          />
          <button
            onClick={handleCreate}
            disabled={creating || !newName.trim()}
            className="px-5 py-2.5 rounded-lg bg-[#e11d48] hover:bg-[#e11d48]/80 text-white text-sm font-medium transition-colors disabled:opacity-40 shrink-0"
          >
            {creating ? '建立中...' : '建立'}
          </button>
        </div>

        {result && (
          <div className="mt-4 p-4 bg-emerald-400/10 border border-emerald-400/30 rounded-lg space-y-1 text-sm">
            <p className="text-emerald-400 font-semibold">✅ Account 已建立</p>
            <p className="text-gray-300">用戶名：<span className="text-white font-mono">{result.username}</span></p>
            <p className="text-gray-300">電郵：<span className="text-white font-mono text-xs">{result.email}</span></p>
            <p className="text-gray-300">密碼：<span className="text-white font-mono">{result.password}</span></p>
            <button onClick={() => setResult(null)} className="mt-2 text-xs text-gray-500 hover:text-gray-300">關閉</button>
          </div>
        )}
      </div>

      {/* Presets List */}
      <div className="bg-[#0d0d14] border border-[#1a1a2e] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-[#1a1a2e]">
          <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <UserCog className="w-4 h-4 text-[#e11d48]" />
            預設 Account 列表
          </span>
          <button onClick={onRefresh} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-200 hover:bg-[#1a1a2e] transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />刷新
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-500 text-sm">載入中...</div>
        ) : presets.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-gray-500 text-sm">
            未有預設 Account — 喺上面建立
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a1a2e] text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left py-3 px-4 font-medium">用戶</th>
                <th className="text-left py-3 px-4 font-medium">電郵</th>
                <th className="text-center py-3 px-4 font-medium">文章</th>
                <th className="text-center py-3 px-4 font-medium">類型</th>
                <th className="text-right py-3 px-4 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {presets.map(p => (
                <tr key={p.id} className="border-b border-[#1a1a2e] hover:bg-[#111118] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-400/20 flex items-center justify-center text-sm">
                        {p.emoji}
                      </div>
                      <a href={`/user/${encodeURIComponent(p.username)}?admin=1`} target="_blank" rel="noopener noreferrer" className="text-sm text-[#e11d48] hover:underline font-medium">{p.username}</a>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500 font-mono text-xs">{p.email}</td>
                  <td className="py-3 px-4 text-center text-sm text-gray-300">{p.posts}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-400/10 text-purple-400">
                      預設
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleToggle(p.id, p.account_type)}
                      disabled={toggling === p.id}
                      className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 transition-colors disabled:opacity-30"
                      title="切換為一般會員"
                    >
                      {toggling === p.id ? '...' : '設為一般'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="flex items-center justify-between p-4 border-t border-[#1a1a2e]">
          <span className="text-xs text-gray-500">共 {presets.length} 個預設 Account</span>
        </div>
      </div>
    </div>
  );
}

// ─── Post Form Modal ───

type AuthorOpt = { id: string; username: string; emoji: string };

function PostFormModal({ post, onClose, onSaved }: { post: AdminPost | null; onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState(post?.title || '');
  const [body, setBody] = useState(post?.body || '');
  const [categoryId, setCategoryId] = useState(post?.category_id || 'dating-life');
  const [createdAt, setCreatedAt] = useState(toLocalInput(post?.created_at || new Date().toISOString()));
  const [userId, setUserId] = useState('');
  const [authors, setAuthors] = useState<AuthorOpt[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!post) {
      Promise.all([db.admin.users(), db.admin.presets()]).then(([real, preset]) => {
        const all: AuthorOpt[] = [
          ...((real as unknown as AuthorOpt[]) || []).map(u => ({ id: u.id, username: u.username, emoji: u.emoji || '🐱' })),
          ...((preset as unknown as AuthorOpt[]) || []).map(u => ({ id: u.id, username: u.username, emoji: u.emoji || '🐱' })),
        ];
        setAuthors(all);
        if (all.length) setUserId(all[0].id);
      });
    }
  }, [post]);

  async function save() {
    if (!title.trim() || !body.trim()) { alert('標題同內文不能為空'); return; }
    if (!post && !userId) { alert('請選擇作者'); return; }
    setSaving(true);
    const cat = CATEGORIES.find(c => c.id === categoryId);
    const category = cat ? `${cat.icon} ${cat.name}` : categoryId;
    const payload: Record<string, unknown> = {
      title: title.trim(), body, category, category_id: categoryId,
      created_at: createdAt ? new Date(createdAt).toISOString() : undefined,
    };
    if (post) payload.id = post.id;
    else payload.user_id = userId;
    const res = await fetch('/api/admin/posts', {
      method: post ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) onSaved();
    else { const { error } = await res.json(); alert('儲存失敗：' + (error || '未知錯誤')); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-lg bg-[#0d0d14] border border-[#1a1a2e] rounded-xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-medium text-gray-200">{post ? '編輯文章' : '加文章'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:text-gray-200"><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-4">
          {!post && (
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">作者</label>
              <select value={userId} onChange={e => setUserId(e.target.value)} className="w-full bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-[#e11d48]">
                {authors.map(a => <option key={a.id} value={a.id}>{a.emoji} {a.username}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">分類</label>
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-[#e11d48]">
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">標題</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-[#e11d48]" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">內文</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} rows={6} className="w-full bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-[#e11d48] resize-y" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">日期時間（可改，留空用而家）</label>
            <input type="datetime-local" value={createdAt} onChange={e => setCreatedAt(e.target.value)} className="w-full bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-[#e11d48]" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs text-gray-400 hover:text-gray-200 hover:bg-[#1a1a2e] transition-colors">取消</button>
            <button onClick={save} disabled={saving} className="px-5 py-2 rounded-lg bg-[#e11d48] hover:bg-[#e11d48]/80 text-white text-sm font-medium transition-colors disabled:opacity-40">{saving ? '儲存中...' : '儲存'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Comment Form Modal ───

function CommentFormModal({ comment, onClose, onSaved }: { comment: AdminComment | null; onClose: () => void; onSaved: () => void }) {
  const [body, setBody] = useState(comment?.body || '');
  const [createdAt, setCreatedAt] = useState(toLocalInput(comment?.created_at || new Date().toISOString()));
  const [userId, setUserId] = useState('');
  const [postId, setPostId] = useState('');
  const [authors, setAuthors] = useState<AuthorOpt[]>([]);
  const [posts, setPosts] = useState<{ id: string; title: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!comment) {
      Promise.all([db.admin.users(), db.admin.presets()]).then(([real, preset]) => {
        const all: AuthorOpt[] = [
          ...((real as unknown as AuthorOpt[]) || []).map(u => ({ id: u.id, username: u.username, emoji: u.emoji || '🐱' })),
          ...((preset as unknown as AuthorOpt[]) || []).map(u => ({ id: u.id, username: u.username, emoji: u.emoji || '🐱' })),
        ];
        setAuthors(all);
        if (all.length) setUserId(all[0].id);
      });
      fetch('/api/admin/posts').then(r => r.json()).then(raw => {
        const arr = (Array.isArray(raw) ? raw : []).map((row: Record<string, unknown>) => ({ id: row.id as string, title: row.title as string }));
        setPosts(arr);
        if (arr.length) setPostId(arr[0].id);
      });
    }
  }, [comment]);

  async function save() {
    if (!body.trim()) { alert('留言內容不能為空'); return; }
    if (!comment && (!userId || !postId)) { alert('請選擇作者同文章'); return; }
    setSaving(true);
    const payload: Record<string, unknown> = { body, created_at: createdAt ? new Date(createdAt).toISOString() : undefined };
    if (comment) payload.id = comment.id;
    else { payload.user_id = userId; payload.post_id = postId; }
    const res = await fetch('/api/admin/comments', {
      method: comment ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) onSaved();
    else { const { error } = await res.json(); alert('儲存失敗：' + (error || '未知錯誤')); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-lg bg-[#0d0d14] border border-[#1a1a2e] rounded-xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-medium text-gray-200">{comment ? '編輯留言' : '加留言'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:text-gray-200"><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-4">
          {!comment && (
            <>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">作者</label>
                <select value={userId} onChange={e => setUserId(e.target.value)} className="w-full bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-[#e11d48]">
                  {authors.map(a => <option key={a.id} value={a.id}>{a.emoji} {a.username}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">回覆文章</label>
                <select value={postId} onChange={e => setPostId(e.target.value)} className="w-full bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-[#e11d48]">
                  {posts.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
            </>
          )}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">留言內容</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} rows={5} className="w-full bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-[#e11d48] resize-y" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">日期時間（可改，留空用而家）</label>
            <input type="datetime-local" value={createdAt} onChange={e => setCreatedAt(e.target.value)} className="w-full bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-[#e11d48]" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs text-gray-400 hover:text-gray-200 hover:bg-[#1a1a2e] transition-colors">取消</button>
            <button onClick={save} disabled={saving} className="px-5 py-2 rounded-lg bg-[#e11d48] hover:bg-[#e11d48]/80 text-white text-sm font-medium transition-colors disabled:opacity-40">{saving ? '儲存中...' : '儲存'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
