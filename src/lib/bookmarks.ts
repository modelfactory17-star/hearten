'use client';

export function getBookmarks(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('hearten_bookmarks');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function toggleBookmark(postId: string): boolean {
  const bookmarks = getBookmarks();
  const idx = bookmarks.indexOf(postId);
  if (idx >= 0) {
    bookmarks.splice(idx, 1);
    save(bookmarks);
    return false; // unbookmarked
  } else {
    bookmarks.push(postId);
    save(bookmarks);
    return true; // bookmarked
  }
}

export function isBookmarked(postId: string): boolean {
  return getBookmarks().includes(postId);
}

function save(bookmarks: string[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('hearten_bookmarks', JSON.stringify(bookmarks));
  window.dispatchEvent(new Event('hearten:bookmarks-changed'));
}
