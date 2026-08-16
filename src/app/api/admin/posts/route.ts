import { NextRequest, NextResponse } from 'next/server';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function supabaseAdmin(path: string, method: string, body?: unknown) {
  const headers: Record<string, string> = {
    apikey: KEY,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + KEY,
    Prefer: 'return=representation',
  };
  const res = await fetch(URL + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(method + ' ' + path + ' failed (' + res.status + '): ' + err);
  }
  return res.json();
}

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

// List all posts (admin view, service key)
export async function GET() {
  try {
    const data = await supabaseAdmin('/rest/v1/posts?select=*,profiles!posts_user_id_fkey(username)&order=created_at.desc', 'GET');
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user_id, title, body, category, category_id, created_at } = await request.json();
    if (!user_id || !title || !body || !category || !category_id) {
      return NextResponse.json({ error: 'Missing fields: user_id, title, body, category, category_id' }, { status: 400 });
    }

    const preview = body.slice(0, 120) + (body.length > 120 ? '...' : '');
    const catIcon = ({ 'dating-life':'💞',crush:'💕',breakup:'💔',marriage:'💍',lgbtq:'🌈',treehole:'🌳',tarot:'🃏',ziwei:'⭐',work:'💼',school:'🎓',family:'👨‍👩‍👧',dating:'📋',bedroom:'🔞' } as Record<string,string>)[category_id] || '💬';
    const slug = generateSlug(title);

    const data = await supabaseAdmin('/rest/v1/posts', 'POST', {
      user_id, title, body, preview, slug,
      category: `${catIcon} ${category}`, category_id,
      created_at: created_at || new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, post: data?.[0] || data });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, title, body, category, category_id, emoji, created_at } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (title !== undefined && title !== '') {
      updates.title = title;
      updates.slug = generateSlug(title);
    }
    if (body !== undefined) {
      updates.body = body;
      updates.preview = body.slice(0, 120) + (body.length > 120 ? '...' : '');
    }
    if (category !== undefined && category !== '') updates.category = category;
    if (category_id !== undefined && category_id !== '') updates.category_id = category_id;
    if (emoji !== undefined && emoji !== '') updates.emoji = emoji;
    if (created_at !== undefined && created_at !== '') updates.created_at = created_at;

    const data = await supabaseAdmin(`/rest/v1/posts?id=eq.${encodeURIComponent(id)}`, 'PATCH', updates);
    return NextResponse.json({ ok: true, post: data?.[0] || data });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
