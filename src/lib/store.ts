'use client';

import { createClient } from '@/utils/supabase/client';
import type { Post, Comment } from './data';

const EMOJIS = ['🐱', '🐶', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦄', '🐙', '🦋', '🌺'];

function randomEmoji(): string {
  return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
}

// --- Posts ---

export async function fetchPosts(): Promise<Post[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('posts')
    .select('*, profiles(username, emoji)')
    .order('created_at', { ascending: false });

  if (!data) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((row: any) => ({
    id: row.id,
    emoji: row.emoji || '😔',
    title: row.title,
    body: row.body,
    preview: row.preview || row.body.slice(0, 120),
    category: row.category,
    categoryId: row.category_id,
    hearts: row.hearts || 0,
    replies: row.replies || 0,
    time: timeAgo(row.created_at),
    anonymous: row.profiles?.username || '匿名用戶',
  }));
}

export async function createPost(
  userId: string,
  title: string,
  body: string,
  category: string,
  categoryId: string,
): Promise<Post | null> {
  const supabase = createClient();
  const emoji = randomEmoji();
  const preview = body.slice(0, 120) + (body.length > 120 ? '...' : '');

  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: userId,
      emoji,
      title,
      body,
      preview,
      category: `${getCategoryIcon(categoryId)} ${category}`,
      category_id: categoryId,
    })
    .select()
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    emoji: data.emoji,
    title: data.title,
    body: data.body,
    preview: data.preview,
    category: data.category,
    categoryId: data.category_id,
    hearts: 0,
    replies: 0,
    time: '啱啱',
    anonymous: '',
  };
}

// --- Comments ---

export async function fetchComments(postId: string): Promise<Comment[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('comments')
    .select('*, profiles(username, emoji)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (!data) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((row: any) => ({
    id: row.id,
    postId: row.post_id,
    parentId: row.parent_id || undefined,
    emoji: row.profiles?.emoji || row.emoji || '🐱',
    anonymous: row.profiles?.username || '匿名用戶',
    body: row.body,
    time: timeAgo(row.created_at),
    hearts: row.hearts || 0,
    isOP: row.is_op || false,
    replies: [],
  }));
}

export async function addComment(
  userId: string,
  postId: string,
  body: string,
  parentId?: string,
): Promise<Comment | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('comments')
    .insert({
      user_id: userId,
      post_id: postId,
      parent_id: parentId || null,
      body,
    })
    .select('*, profiles(username, emoji)')
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    postId: data.post_id,
    parentId: data.parent_id || undefined,
    emoji: data.profiles?.emoji || '🐱',
    anonymous: data.profiles?.username || '匿名用戶',
    body: data.body,
    time: '啱啱',
    hearts: 0,
    isOP: false,
    replies: [],
  };
}

// --- Bookmarks ---

export async function fetchBookmarks(userId: string): Promise<string[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('bookmarks')
    .select('post_id')
    .eq('user_id', userId);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((b: any) => b.post_id);
}

export async function toggleBookmarkDB(userId: string, postId: string): Promise<boolean> {
  const supabase = createClient();

  const { data: existing } = await supabase
    .from('bookmarks')
    .select('post_id')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .single();

  if (existing) {
    await supabase.from('bookmarks').delete().eq('user_id', userId).eq('post_id', postId);
    return false;
  } else {
    await supabase.from('bookmarks').insert({ user_id: userId, post_id: postId });
    return true;
  }
}

export async function isPostBookmarked(userId: string, postId: string): Promise<boolean> {
  const supabase = createClient();
  const { data } = await supabase
    .from('bookmarks')
    .select('post_id')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .single();

  return !!data;
}

// --- Helpers ---

function getCategoryIcon(categoryId: string): string {
  const map: Record<string, string> = {
    breakup: '💔', crush: '💕', marriage: '💍', lgbtq: '🌈',
    treehole: '🌳', tarot: '🃏', work: '💼', school: '🎓',
    dating: '📋', bedroom: '🔞',
  };
  return map[categoryId] || '💬';
}

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
