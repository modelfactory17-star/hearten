'use client';

import type { Post } from './data';

const STORAGE_KEY = 'hearten_user_posts';

export function getUserPosts(): Post[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addUserPost(post: Post): void {
  const posts = getUserPosts();
  posts.unshift(post); // newest first
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  // dispatch event so other components can react
  window.dispatchEvent(new Event('hearten:posts-updated'));
}
