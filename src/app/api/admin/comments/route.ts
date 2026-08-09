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

export async function POST(request: NextRequest) {
  try {
    const { user_id, post_id, body, parent_id } = await request.json();
    if (!user_id || !post_id || !body) {
      return NextResponse.json({ error: 'Missing fields: user_id, post_id, body' }, { status: 400 });
    }

    const data = await supabaseAdmin('/rest/v1/comments', 'POST', {
      user_id, post_id, body,
      parent_id: parent_id || null,
      created_at: new Date().toISOString(),
    });

    // Update post reply count
    await supabaseAdmin('/rest/v1/rpc/increment_post_replies', 'POST', { post_id });

    return NextResponse.json({ ok: true, comment: data?.[0] || data });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
