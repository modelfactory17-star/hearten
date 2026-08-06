'use client';

import type { Post, Comment } from './data';

const POSTS_KEY = 'hearten_user_posts';
const COMMENTS_KEY = 'hearten_user_comments';

// --- Posts ---

export function getUserPosts(): Post[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addUserPost(post: Post): void {
  const posts = getUserPosts();
  posts.unshift(post);
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  window.dispatchEvent(new Event('hearten:posts-updated'));
}

// --- Comments ---

export function getUserComments(postId: string): Comment[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(COMMENTS_KEY);
    const all: Comment[] = raw ? JSON.parse(raw) : [];
    return all.filter((c) => c.postId === postId);
  } catch {
    return [];
  }
}

export function addUserComment(comment: Comment): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(COMMENTS_KEY);
    const all: Comment[] = raw ? JSON.parse(raw) : [];
    all.push(comment);
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(all));
    window.dispatchEvent(new Event('hearten:comments-updated'));
  } catch {}
}

const EMOJIS = ['🐱', '🐶', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦄', '🐙', '🦋', '🌺'];

function randomEmoji(): string {
  return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
}

export function createComment(postId: string, body: string, anonymous: string, parentId?: string): Comment {
  return {
    id: `uc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    postId,
    parentId,
    emoji: randomEmoji(),
    anonymous: anonymous.trim(),
    body: body.trim(),
    time: '啱啱',
    hearts: 0,
    isOP: false,
    replies: [],
  };
}
