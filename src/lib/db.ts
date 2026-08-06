'use client';

import { createClient } from '@/utils/supabase/client';

// ─── Types ───────────────────────────────────────────────

export interface AuthUser {
  id: string;
  username: string;
  emoji: string;
  joined: string;
}

export interface Post {
  id: string;
  emoji: string;
  title: string;
  body: string;
  preview: string;
  category: string;
  categoryId: string;
  hearts: number;
  replies: number;
  time: string;
  anonymous: string;
}

export interface Comment {
  id: string;
  postId: string;
  parentId?: string;
  emoji: string;
  anonymous: string;
  body: string;
  time: string;
  hearts: number;
  isOP: boolean;
  replies: Comment[];
}

// ─── Auth ─────────────────────────────────────────────────

export const auth = {
  async register(email: string, password: string, username: string) {
    const supabase = createClient();
    if (username.trim().length < 2) return { ok: false, error: '名稱最少2個字' };
    if (password.length < 6) return { ok: false, error: '密碼最少6個字' };
    if (!email.includes('@')) return { ok: false, error: '請輸入有效電郵' };

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(), password,
      options: { data: { username: username.trim() } },
    });
    if (error) {
      if (error.message.includes('already registered')) return { ok: false, error: '呢個電郵已經註冊咗' };
      return { ok: false, error: error.message };
    }
    if (data.user?.identities?.length === 0) return { ok: false, error: '呢個電郵已經註冊咗' };

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: false },
    });
    if (otpError) return { ok: false, error: '發送驗證碼失敗' };
    return { ok: true };
  },

  async verifyOtp(email: string, token: string) {
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({ email: email.trim(), token: token.trim(), type: 'email' });
    if (error) return { ok: false, error: '驗證碼錯誤' };
    return { ok: true };
  },

  async login(email: string, password: string) {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) return { ok: false, error: '電郵或密碼錯誤' };
    return { ok: true };
  },

  async logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
  },

  async getUser(): Promise<AuthUser | null> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: profile } = await supabase.from('profiles').select('username, emoji, joined').eq('id', user.id).single();
    return {
      id: user.id,
      username: profile?.username ?? user.user_metadata?.username ?? 'user',
      emoji: profile?.emoji ?? '🐱',
      joined: profile?.joined ?? '',
    };
  },
};

// ─── Posts ────────────────────────────────────────────────

const EMOJIS = ['🐱','🐶','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🦄','🐙','🦋','🌺'];
function randEmoji() { return EMOJIS[Math.floor(Math.random() * EMOJIS.length)]; }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPost(row: any): Post {
  return {
    id: row.id, emoji: row.emoji || '😔',
    title: row.title, body: row.body,
    preview: row.preview || row.body?.slice(0, 120),
    category: row.category, categoryId: row.category_id,
    hearts: row.hearts || 0, replies: row.replies || 0,
    time: timeAgo(row.created_at),
    anonymous: row.profiles?.username || '匿名用戶',
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapComment(row: any): Comment {
  return {
    id: row.id, postId: row.post_id,
    parentId: row.parent_id || undefined,
    emoji: row.profiles?.emoji || row.emoji || '🐱',
    anonymous: row.profiles?.username || '匿名用戶',
    body: row.body, time: timeAgo(row.created_at),
    hearts: row.hearts || 0, isOP: row.is_op || false, replies: [],
  };
}

export const posts = {
  async list(): Promise<Post[]> {
    const supabase = createClient();
    const { data } = await supabase.from('posts').select('*, profiles(username, emoji)').order('created_at', { ascending: false });
    return (data || []).map(mapPost);
  },

  async getById(id: string): Promise<Post | null> {
    const supabase = createClient();
    const { data } = await supabase.from('posts').select('*, profiles(username, emoji)').eq('id', id).single();
    return data ? mapPost(data) : null;
  },

  async create(userId: string, title: string, body: string, category: string, categoryId: string): Promise<Post | null> {
    const supabase = createClient();
    const emoji = randEmoji();
    const preview = body.slice(0, 120) + (body.length > 120 ? '...' : '');
    const catIcon = ({ breakup:'💔',crush:'💕',marriage:'💍',lgbtq:'🌈',treehole:'🌳',tarot:'🃏',work:'💼',school:'🎓',dating:'📋',bedroom:'🔞' } as Record<string,string>)[categoryId] || '💬';

    const { data, error } = await supabase.from('posts').insert({
      user_id: userId, emoji, title, body, preview,
      category: `${catIcon} ${category}`, category_id: categoryId,
    }).select().single();
    if (error || !data) return null;
    return { id: data.id, emoji: data.emoji, title: data.title, body: data.body, preview: data.preview, category: data.category, categoryId: data.category_id, hearts: 0, replies: 0, time: '啱啱', anonymous: '' };
  },
};

// ─── Comments ─────────────────────────────────────────────

export const comments = {
  async list(postId: string): Promise<Comment[]> {
    const supabase = createClient();
    const { data } = await supabase.from('comments').select('*, profiles(username, emoji)').eq('post_id', postId).order('created_at', { ascending: true });
    return (data || []).map(mapComment);
  },

  async create(userId: string, postId: string, body: string, parentId?: string): Promise<Comment | null> {
    const supabase = createClient();
    const { data, error } = await supabase.from('comments').insert({
      user_id: userId, post_id: postId, parent_id: parentId || null, body,
    }).select('*, profiles(username, emoji)').single();
    if (error || !data) return null;
    return { id: data.id, postId: data.post_id, parentId: data.parent_id || undefined, emoji: data.profiles?.emoji || '🐱', anonymous: data.profiles?.username || '匿名用戶', body: data.body, time: '啱啱', hearts: 0, isOP: false, replies: [] };
  },
};

// ─── Likes ────────────────────────────────────────────────

export const likes = {
  async toggle(userId: string, targetType: 'post' | 'comment', targetId: string): Promise<boolean> {
    const supabase = createClient();
    const { data: existing } = await supabase.from('likes').select('id').eq('user_id', userId).eq('target_type', targetType).eq('target_id', targetId).maybeSingle();
    if (existing) {
      await supabase.from('likes').delete().eq('id', existing.id);
      return false;
    } else {
      await supabase.from('likes').insert({ user_id: userId, target_type: targetType, target_id: targetId });
      return true;
    }
  },

  async isLiked(userId: string, targetType: 'post' | 'comment', targetId: string): Promise<boolean> {
    const supabase = createClient();
    const { data } = await supabase.from('likes').select('id').eq('user_id', userId).eq('target_type', targetType).eq('target_id', targetId).maybeSingle();
    return !!data;
  },

  async count(targetType: 'post' | 'comment', targetId: string): Promise<number> {
    const supabase = createClient();
    const { count } = await supabase.from('likes').select('*', { count: 'exact', head: true }).eq('target_type', targetType).eq('target_id', targetId);
    return count || 0;
  },

  async batchCounts(type: 'post' | 'comment', ids: string[]): Promise<Record<string, number>> {
    if (ids.length === 0) return {};
    const supabase = createClient();
    const { data } = await supabase.from('likes').select('target_id').eq('target_type', type).in('target_id', ids);
    const counts: Record<string, number> = {};
    for (const row of (data || [])) { counts[row.target_id] = (counts[row.target_id] || 0) + 1; }
    return counts;
  },
};

// ─── Admin ────────────────────────────────────────────────

export const admin = {
  async stats() {
    const supabase = createClient();
    const [{ count: users }, { count: posts }, { count: comments }, { count: hearts }] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('posts').select('*', { count: 'exact', head: true }),
      supabase.from('comments').select('*', { count: 'exact', head: true }),
      supabase.from('likes').select('*', { count: 'exact', head: true }),
    ]);
    return { users: users || 0, posts: posts || 0, comments: comments || 0, hearts: hearts || 0 };
  },

  async users() {
    const supabase = createClient();
    const { data: profiles } = await supabase.from('profiles').select('id, username, emoji, joined');
    // Get post counts per user
    const { data: postCounts } = await supabase.from('posts').select('user_id');
    const counts: Record<string, number> = {};
    for (const p of (postCounts || [])) { counts[p.user_id] = (counts[p.user_id] || 0) + 1; }
    return (profiles || []).map(p => ({
      id: p.id, username: p.username, emoji: p.emoji || '🐱',
      posts: counts[p.id] || 0, joined: p.joined ? p.joined.slice(0, 10) : '',
      status: 'active' as const,
    }));
  },

  async posts() {
    const supabase = createClient();
    const { data } = await supabase.from('posts').select('*, profiles(username)').order('created_at', { ascending: false });
    return (data || []).map((row: Record<string, unknown>) => ({
      id: row.id as string, title: row.title as string,
      author: (row.profiles as { username?: string } | null)?.username || '匿名用戶',
      category: row.category as string, hearts: (row.hearts as number) || 0,
      comments: (row.replies as number) || 0,
      time: timeAgo(row.created_at as string),
    }));
  },

  async comments() {
    const supabase = createClient();
    const { data } = await supabase.from('comments').select('*, profiles(username), posts(title)').order('created_at', { ascending: false }).limit(100);
    return (data || []).map((row: Record<string, unknown>) => ({
      id: row.id as string, body: row.body as string,
      author: (row.profiles as { username?: string } | null)?.username || '匿名用戶',
      post: (row.posts as { title?: string } | null)?.title || '',
      time: timeAgo(row.created_at as string),
    }));
  },
};

// ─── Bookmarks ────────────────────────────────────────────

export const bookmarks = {
  async toggle(userId: string, postId: string): Promise<boolean> {
    const supabase = createClient();
    const { data: existing } = await supabase.from('bookmarks').select('post_id').eq('user_id', userId).eq('post_id', postId).maybeSingle();
    if (existing) {
      await supabase.from('bookmarks').delete().eq('user_id', userId).eq('post_id', postId);
      return false;
    } else {
      await supabase.from('bookmarks').insert({ user_id: userId, post_id: postId });
      return true;
    }
  },

  async isBookmarked(userId: string, postId: string): Promise<boolean> {
    const supabase = createClient();
    const { data } = await supabase.from('bookmarks').select('post_id').eq('user_id', userId).eq('post_id', postId).maybeSingle();
    return !!data;
  },

  async list(userId: string): Promise<string[]> {
    const supabase = createClient();
    const { data } = await supabase.from('bookmarks').select('post_id').eq('user_id', userId);
    return (data || []).map(b => b.post_id);
  },
};

// ─── Helpers ──────────────────────────────────────────────

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

// ─── Unified export ────────────────────────────────────────

export const db = { auth, posts, comments, likes, bookmarks, admin };
