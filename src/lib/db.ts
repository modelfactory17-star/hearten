'use client';

import { createClient } from '@/utils/supabase/client';

// ─── Types ───────────────────────────────────────────────

export interface AuthUser {
  id: string;
  username: string;
  emoji: string;
  avatar_url: string | null;
  joined: string;
  message_notifications: boolean;
}

export interface Post {
  id: string;
  slug: string;
  emoji: string;
  avatar_url: string | null;
  title: string;
  body: string;
  preview: string;
  category: string;
  categoryId: string;
  hearts: number;
  replies: number;
  time: string;
  anonymous: string;
  images: string[];
}

export interface Comment {
  id: string;
  postId: string;
  parentId?: string;
  emoji: string;
  avatar_url: string | null;
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
      if (error.message.includes('rate')) return { ok: false, error: '發送驗證碼失敗，請稍後再試' };
      return { ok: false, error: error.message };
    }
    if (data.user?.identities?.length === 0) return { ok: false, error: '呢個電郵已經註冊咗' };
    return { ok: true };
  },

  async verifyOtp(email: string, token: string) {
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({ email: email.trim(), token: token.trim(), type: 'signup' });
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
    const { data: profile } = await supabase.from('profiles').select('username, emoji, avatar_url, joined, message_notifications').eq('id', user.id).single();
    return {
      id: user.id,
      username: profile?.username ?? user.user_metadata?.username ?? 'user',
      emoji: profile?.emoji ?? '🐱',
      avatar_url: profile?.avatar_url ?? null,
      joined: profile?.joined ?? '',
      message_notifications: profile?.message_notifications ?? false,
    };
  },

  async getUserByUsername(username: string) {
    const supabase = createClient();
    const { data } = await supabase.from('profiles').select('id, username, emoji, avatar_url, bio, status, joined, posts_count, hearts_received, email').eq('username', username).single();
    return data || null;
  },

  async updateProfile(userId: string, updates: { emoji?: string; bio?: string; status?: string; avatar_url?: string | null; message_notifications?: boolean }) {
    const supabase = createClient();
    const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
    return { ok: !error, error: error?.message };
  },

  async resetPassword(email: string) {
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback`,
    });
    return { ok: !error, error: error?.message };
  },
};

// ─── Posts ────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPost(row: any): Post {
  return {
    id: row.id, slug: row.slug || '',
    emoji: row.profiles?.emoji || row.emoji || '😔',
    avatar_url: row.profiles?.avatar_url || null,
    title: row.title, body: row.body,
    preview: row.preview || row.body?.slice(0, 120),
    category: row.category, categoryId: row.category_id,
    hearts: row.hearts || 0, replies: row.replies || 0,
    time: timeAgo(row.created_at),
    anonymous: row.profiles?.username || '匿名用戶',
    images: Array.isArray(row.images) ? row.images : [],
  };
}

// ─── Slug generator ───────────────────────────────────────

function generateSlug(title: string): string {
  const base = title
    .replace(/[^\w\u4e00-\u9fff\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 30)
    .replace(/-$/, '');
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}-${suffix}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapComment(row: any): Comment {
  return {
    id: row.id, postId: row.post_id,
    parentId: row.parent_id || undefined,
    emoji: row.profiles?.emoji || row.emoji || '🐱',
    avatar_url: row.profiles?.avatar_url || null,
    anonymous: row.profiles?.username || '匿名用戶',
    body: row.body, time: timeAgo(row.created_at),
    hearts: row.hearts || 0, isOP: row.is_op || false, replies: [],
  };
}

export const posts = {
  async list(): Promise<Post[]> {
    const supabase = createClient();
    const { data } = await supabase.from('posts').select('*, profiles!posts_user_id_fkey(username, emoji, avatar_url)').order('created_at', { ascending: false });
    return (data || []).map(mapPost);
  },

  async getById(id: string): Promise<Post | null> {
    const supabase = createClient();
    const { data } = await supabase.from('posts').select('*, profiles!posts_user_id_fkey(username, emoji, avatar_url)').eq('id', id).single();
    return data ? mapPost(data) : null;
  },

  async getBySlug(slug: string): Promise<Post | null> {
    const supabase = createClient();
    const { data } = await supabase.from('posts').select('*, profiles!posts_user_id_fkey(username, emoji, avatar_url)').eq('slug', slug).single();
    return data ? mapPost(data) : null;
  },

  async listByCategory(categoryId: string): Promise<Post[]> {
    const supabase = createClient();
    const { data } = await supabase.from('posts').select('*, profiles!posts_user_id_fkey(username, emoji, avatar_url)').eq('category_id', categoryId).order('created_at', { ascending: false });
    return (data || []).map(mapPost);
  },

  async create(userId: string, title: string, body: string, category: string, categoryId: string, images: string[] = []): Promise<Post | null> {
    const supabase = createClient();
    const preview = body.slice(0, 120) + (body.length > 120 ? '...' : '');
    const catIcon = ({ 'dating-life':'💑',crush:'💕',breakup:'💔',marriage:'💍',lgbtq:'🌈',treehole:'🌳',tarot:'🃏',work:'💼',school:'🎓',family:'👨‍👩‍👧',dating:'📋',bedroom:'🔞' } as Record<string,string>)[categoryId] || '💬';
    const slug = generateSlug(title);

    const { data, error } = await supabase.from('posts').insert({
      user_id: userId, title, body, preview, slug,
      category: `${catIcon} ${category}`, category_id: categoryId,
      images: images.length > 0 ? images : null,
    }).select('*, profiles!posts_user_id_fkey(username, emoji, avatar_url)').single();
    if (error) {
      console.error('[db.posts.create] Supabase error:', error);
      return null;
    }
    if (!data) return null;
    return mapPost(data);
  },

  async getByUser(username: string): Promise<Post[]> {
    const supabase = createClient();
    const { data } = await supabase.from('posts').select('*, profiles!posts_user_id_fkey(username, emoji, avatar_url)').eq('profiles.username', username).order('created_at', { ascending: false });
    return (data || []).map(mapPost);
  },
};

// ─── Comments ─────────────────────────────────────────────

export const comments = {
  async list(postId: string): Promise<Comment[]> {
    const supabase = createClient();
    const { data } = await supabase.from('comments').select(`
      *,
      profiles:user_id (username, emoji, avatar_url)
    `).eq('post_id', postId).order('created_at', { ascending: true });
    return (data || []).map(mapComment);
  },

  async create(userId: string, postId: string, body: string, parentId?: string): Promise<Comment | null> {
    const supabase = createClient();
    const { data, error } = await supabase.from('comments').insert({
      user_id: userId, post_id: postId, parent_id: parentId || null, body,
    }).select(`
      *,
      profiles:user_id (username, emoji, avatar_url)
    `).single();
    if (error || !data) return null;
    return { id: data.id, postId: data.post_id, parentId: data.parent_id || undefined, emoji: data.profiles?.emoji || '🐱', avatar_url: data.profiles?.avatar_url || null, anonymous: data.profiles?.username || '匿名用戶', body: data.body, time: '啱啱', hearts: 0, isOP: false, replies: [] };
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
    const { data: profiles } = await supabase.from('profiles').select('id, username, emoji, joined').neq('account_type', 'preset');
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

  async presets() {
    const supabase = createClient();
    const { data } = await supabase.from('profiles').select('id, username, emoji, email, account_type, posts_count').eq('account_type', 'preset').order('username');
    return (data || []).map((p: Record<string, unknown>) => ({
      id: p.id as string, username: p.username as string,
      emoji: p.emoji as string, email: p.email as string,
      account_type: p.account_type as string,
      posts: p.posts_count as number,
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

// ─── Moods ────────────────────────────────────────────────

export const moods = {
  async toggle(userId: string, postId: string, mood: string): Promise<boolean> {
    const supabase = createClient();
    const { data: existing } = await supabase.from('post_moods')
      .select('id').eq('post_id', postId).eq('user_id', userId).eq('mood', mood).maybeSingle();
    if (existing) {
      await supabase.from('post_moods').delete().eq('id', existing.id);
      return false;
    } else {
      await supabase.from('post_moods').insert({ post_id: postId, user_id: userId, mood });
      return true;
    }
  },

  async countByPost(postId: string): Promise<Record<string, number>> {
    const supabase = createClient();
    const { data } = await supabase.from('post_moods').select('mood').eq('post_id', postId);
    const counts: Record<string, number> = { support: 0, sad: 0, angry: 0, pig: 0 };
    for (const row of (data || [])) { counts[row.mood] = (counts[row.mood] || 0) + 1; }
    return counts;
  },

  async getUserMoods(userId: string, postId: string): Promise<string[]> {
    const supabase = createClient();
    const { data } = await supabase.from('post_moods')
      .select('mood').eq('post_id', postId).eq('user_id', userId);
    return (data || []).map(r => r.mood);
  },
};

// ─── Polls ────────────────────────────────────────────────

export interface Poll {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'closed';
  options: PollOption[];
  totalVotes: number;
  userVotes: string[];    // option ids the current user voted for
  createdAt: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export const polls = {
  async list(userId?: string): Promise<Poll[]> {
    const supabase = createClient();
    const { data: pollData } = await supabase.from('polls').select('*').order('created_at', { ascending: false });
    if (!pollData || pollData.length === 0) return [];

    const pollIds = pollData.map(p => p.id);

    // Fetch all options for these polls
    const { data: optionsData } = await supabase.from('poll_options')
      .select('*').in('poll_id', pollIds).order('sort_order');

    // Fetch all vote counts
    const { data: votesData } = await supabase.from('poll_votes')
      .select('option_id').in('poll_id', pollIds);

    // Fetch current user's votes
    const userVoteMap: Record<string, string[]> = {};
    if (userId) {
      const { data: userVotes } = await supabase.from('poll_votes')
        .select('poll_id, option_id').eq('user_id', userId).in('poll_id', pollIds);
      for (const v of (userVotes || [])) {
        if (!userVoteMap[v.poll_id]) userVoteMap[v.poll_id] = [];
        userVoteMap[v.poll_id].push(v.option_id);
      }
    }

    // Count votes per option
    const voteCounts: Record<string, number> = {};
    for (const v of (votesData || [])) {
      voteCounts[v.option_id] = (voteCounts[v.option_id] || 0) + 1;
    }

    return pollData.map(p => {
      const opts = (optionsData || []).filter(o => o.poll_id === p.id).map(o => ({
        id: o.id, text: o.text, votes: voteCounts[o.id] || 0,
      }));
      const totalVotes = opts.reduce((sum, o) => sum + o.votes, 0);
      return {
        id: p.id, title: p.title, description: p.description || '',
        status: p.status, options: opts, totalVotes,
        userVotes: userVoteMap[p.id] || [],
        createdAt: p.created_at,
      };
    });
  },

  async create(title: string, description: string, optionTexts: string[]): Promise<Poll | null> {
    const supabase = createClient();
    // Insert poll
    const { data: poll, error } = await supabase.from('polls').insert({
      title, description, status: 'active',
    }).select().single();
    if (error || !poll) return null;

    // Insert options
    const opts = optionTexts.map((text, i) => ({
      poll_id: poll.id, text, sort_order: i,
    }));
    await supabase.from('poll_options').insert(opts);

    return {
      id: poll.id, title: poll.title, description: poll.description || '',
      status: poll.status,
      options: optionTexts.map((text) => ({ id: '', text, votes: 0 })),
      totalVotes: 0, userVotes: [], createdAt: poll.created_at,
    };
  },

  async vote(pollId: string, optionIds: string[], userId: string): Promise<boolean> {
    const supabase = createClient();
    // Get existing votes for this user in this poll
    const { data: existing } = await supabase.from('poll_votes')
      .select('id, option_id').eq('poll_id', pollId).eq('user_id', userId);

    const existingIds = (existing || []).map(v => v.option_id);
    const existingRowIds: Record<string, string> = {};
    for (const v of (existing || [])) { existingRowIds[v.option_id] = v.id; }

    // Options to add (in new list but not in existing)
    const toAdd = optionIds.filter(id => !existingIds.includes(id));
    // Options to remove (in existing but not in new list)
    const toRemove = existingIds.filter(id => !optionIds.includes(id));

    if (toAdd.length > 0) {
      const rows = toAdd.map(oid => ({ poll_id: pollId, option_id: oid, user_id: userId }));
      await supabase.from('poll_votes').insert(rows);
    }
    for (const oid of toRemove) {
      if (existingRowIds[oid]) {
        await supabase.from('poll_votes').delete().eq('id', existingRowIds[oid]);
      }
    }

    return true;
  },

  async closePoll(pollId: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase.from('polls').update({ status: 'closed' }).eq('id', pollId);
    return !error;
  },
};

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

// ─── Messages ──────────────────────────────────────────────

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  body: string;
  read: boolean;
  created_at: string;
  sender_name?: string;
  sender_emoji?: string;
  receiver_name?: string;
  receiver_emoji?: string;
}

export const messages = {
  async send(senderId: string, receiverId: string, body: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase.from('messages').insert({
      sender_id: senderId, receiver_id: receiverId, body,
    });
    return !error;
  },

  async conversation(userId: string, otherId: string): Promise<Message[]> {
    const supabase = createClient();
    const { data } = await supabase.from('messages').select(`
      *,
      sender:sender_id (username, emoji),
      receiver:receiver_id (username, emoji)
    `).or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .or(`sender_id.eq.${otherId},receiver_id.eq.${otherId}`)
      .order('created_at', { ascending: true });

    return (data || []).map((m: Record<string, unknown>) => ({
      id: m.id as string,
      sender_id: m.sender_id as string,
      receiver_id: m.receiver_id as string,
      body: m.body as string,
      read: m.read as boolean,
      created_at: m.created_at as string,
      sender_name: (m.sender as { username?: string } | null)?.username,
      sender_emoji: (m.sender as { emoji?: string } | null)?.emoji,
      receiver_name: (m.receiver as { username?: string } | null)?.username,
      receiver_emoji: (m.receiver as { emoji?: string } | null)?.emoji,
    }));
  },
};

// ─── Friendships ───────────────────────────────────────────

export type FriendStatus = 'none' | 'pending_sent' | 'pending_received' | 'accepted';

export interface FriendItem {
  id: string;
  friend: { id: string; username: string; emoji: string; avatar_url: string | null } | null;
  starred: boolean;
  blocked: boolean;
  created_at: string;
}

export const friendships = {
  async request(requesterId: string, addresseeId: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase.from('friendships').upsert({
      requester_id: requesterId, addressee_id: addresseeId, status: 'pending',
    }, { onConflict: 'requester_id,addressee_id' });
    return !error;
  },

  async getStatus(userId: string, otherId: string): Promise<FriendStatus> {
    const supabase = createClient();
    // Check both directions
    const { data } = await supabase.from('friendships').select('*')
      .or(`and(requester_id.eq.${userId},addressee_id.eq.${otherId}),and(requester_id.eq.${otherId},addressee_id.eq.${userId})`)
      .maybeSingle();

    if (!data) return 'none';
    if (data.status === 'accepted') return 'accepted';
    if (data.requester_id === userId) return 'pending_sent';
    return 'pending_received';
  },

  async respond(friendshipId: string, status: 'accepted' | 'rejected'): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase.from('friendships').update({ status }).eq('id', friendshipId);
    return !error;
  },

  /** List accepted friends for a user (via API to bypass RLS) */
  async list(userId: string): Promise<FriendItem[]> {
    const res = await fetch(`/api/friends?user_id=${encodeURIComponent(userId)}`);
    if (!res.ok) return [];
    return res.json();
  },

  /** Toggle star on a friendship (via API) */
  async toggleStar(friendshipId: string): Promise<boolean | null> {
    const res = await fetch('/api/friends', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'star', friendship_id: friendshipId }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.starred;
  },

  /** Toggle block on a friendship (via API) */
  async toggleBlock(friendshipId: string): Promise<boolean | null> {
    const res = await fetch('/api/friends', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'block', friendship_id: friendshipId }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.blocked;
  },

  /** Delete a friendship (via API) */
  async remove(friendshipId: string): Promise<boolean> {
    const res = await fetch('/api/friends', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', friendship_id: friendshipId }),
    });
    return res.ok;
  },
};

// ─── Unified export ────────────────────────────────────────

export const db = { auth, posts, comments, likes, bookmarks, moods, admin, polls, messages, friendships };
