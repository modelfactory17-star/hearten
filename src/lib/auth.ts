'use client';

import { createClient } from '@/utils/supabase/client';

export interface AuthUser {
  id: string;
  username: string;
  emoji: string;
  joined: string;
}

export async function register(
  email: string,
  password: string,
  username: string,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = createClient();

  if (username.trim().length < 2) return { ok: false, error: '名稱最少2個字' };
  if (password.length < 4) return { ok: false, error: '密碼最少4個字' };
  if (!email.includes('@')) return { ok: false, error: '請輸入有效電郵' };

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: { username: username.trim() },
    },
  });

  if (error) {
    if (error.message.includes('already registered')) return { ok: false, error: '呢個電郵已經註冊咗' };
    return { ok: false, error: error.message };
  }

  if (data.user?.identities?.length === 0) {
    return { ok: false, error: '呢個電郵已經註冊咗' };
  }

  return { ok: true };
}

export async function login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) return { ok: false, error: '電郵或密碼錯誤' };

  return { ok: true };
}

export async function logout(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, emoji, joined')
    .eq('id', user.id)
    .single();

  return {
    id: user.id,
    username: profile?.username ?? user.user_metadata?.username ?? 'user',
    emoji: profile?.emoji ?? '🐱',
    joined: profile?.joined ?? '',
  };
}
