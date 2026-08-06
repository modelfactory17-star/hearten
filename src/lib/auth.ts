'use client';

export interface AuthUser {
  username: string;
  emoji: string;
  joined: string;
}

interface StoredUser {
  username: string;
  passwordHash: string;
  emoji: string;
  joined: string;
}

const USERS_KEY = 'hearten_users';
const SESSION_KEY = 'hearten_session';
const EMOJIS = ['🐱', '🐶', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦄', '🐙', '🦋', '🌺'];

function simpleHash(s: string): string {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i);
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(36);
}

function randomEmoji(): string {
  return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
}

function getUsers(): StoredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveUsers(users: StoredUser[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function register(username: string, password: string): { ok: boolean; error?: string } {
  const users = getUsers();
  if (users.find((u) => u.username === username)) {
    return { ok: false, error: '呢個名已經有人用咗' };
  }
  if (username.trim().length < 2) return { ok: false, error: '名稱最少2個字' };
  if (password.length < 4) return { ok: false, error: '密碼最少4個字' };

  users.push({
    username: username.trim(),
    passwordHash: simpleHash(password),
    emoji: randomEmoji(),
    joined: new Date().toLocaleDateString('zh-HK', { year: 'numeric', month: 'long' }),
  });
  saveUsers(users);
  setSession({ username: username.trim(), emoji: users[users.length - 1].emoji, joined: users[users.length - 1].joined });
  return { ok: true };
}

export function login(username: string, password: string): { ok: boolean; error?: string } {
  const users = getUsers();
  const user = users.find((u) => u.username === username);
  if (!user) return { ok: false, error: '用戶名或密碼錯誤' };
  if (user.passwordHash !== simpleHash(password)) return { ok: false, error: '用戶名或密碼錯誤' };

  setSession({ username: user.username, emoji: user.emoji, joined: user.joined });
  return { ok: true };
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event('hearten:auth-changed'));
}

function setSession(user: AuthUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event('hearten:auth-changed'));
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
