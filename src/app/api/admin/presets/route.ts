import { NextRequest, NextResponse } from 'next/server';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function supabaseAdmin(path: string, method: string, body?: unknown) {
  const headers: Record<string, string> = {
    apikey: KEY,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + KEY,
  };
  const res = await fetch(URL + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(method + ' ' + path + ' failed (' + res.status + '): ' + err);
  }
  return res;
}

// List preset accounts
export async function GET() {
  try {
    const res = await supabaseAdmin('/rest/v1/profiles?select=id,username,email&account_type=eq.preset', 'GET');
    return NextResponse.json(res);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Create new preset account
export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();
    if (!username || username.trim().length < 2) {
      return NextResponse.json({ error: '名稱最少2個字' }, { status: 400 });
    }

    const cleanName = username.trim();
    const safeId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const email = 'preset_' + safeId + '@hearten.com.hk';
    const pwdChars = Math.random().toString(36).slice(2, 10);
    const password = 'Hearten' + pwdChars + '!';

    // 1. Create auth user (email_confirm: true skips verification)
    const authRes = await supabaseAdmin('/auth/v1/admin/users', 'POST', {
      email,
      password,
      email_confirm: true,
      user_metadata: { username: cleanName },
    });

    const authUser = await authRes.json();

    // 2. Update profile with account_type
    await supabaseAdmin('/rest/v1/profiles?id=eq.' + encodeURIComponent(authUser.id), 'PATCH', {
      account_type: 'preset',
    });

    return NextResponse.json({
      ok: true,
      user: { id: authUser.id, username: cleanName, email, password },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Toggle account_type between 'member' and 'preset'
export async function PATCH(request: NextRequest) {
  try {
    const { id, account_type } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const newType = account_type === 'preset' ? 'member' : 'preset';

    await supabaseAdmin('/rest/v1/profiles?id=eq.' + encodeURIComponent(id), 'PATCH', {
      account_type: newType,
    });

    return NextResponse.json({ ok: true, account_type: newType });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
