import { NextRequest, NextResponse } from 'next/server';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function supabaseAdmin(path: string, method: string, body?: unknown) {
  const authHeader = 'Bearer ' + KEY;
  const headers: Record<string, string> = {
    apikey: KEY,
    Authorization: authHeader,
    'Content-Type': 'application/json',
  };
  const res = await fetch(`${URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`${method} ${path} failed (${res.status}): ${err}`);
  }
  return res;
}

export async function DELETE(request: NextRequest) {
  try {
    const { type, id } = await request.json();

    if (!type || !id) {
      return NextResponse.json({ error: 'Missing type or id' }, { status: 400 });
    }

    if (type === 'user') {
      // 1. Delete profile first (FK constraint)
      await supabaseAdmin(`/rest/v1/profiles?id=eq.${encodeURIComponent(id)}`, 'DELETE');
      // 2. Delete auth user
      await supabaseAdmin(`/auth/v1/admin/users/${encodeURIComponent(id)}`, 'DELETE');
    } else if (type === 'post') {
      await supabaseAdmin(`/rest/v1/posts?id=eq.${encodeURIComponent(id)}`, 'DELETE');
    } else if (type === 'comment') {
      await supabaseAdmin(`/rest/v1/comments?id=eq.${encodeURIComponent(id)}`, 'DELETE');
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
