import { NextResponse } from 'next/server';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
      return NextResponse.json({ error: 'Missing file or userId' }, { status: 400 });
    }

    // Upload to Supabase Storage
    const path = `${userId}/${Date.now()}.${file.name.split('.').pop()}`;
    const uploadRes = await fetch(`${URL}/storage/v1/object/avatars/${path}`, {
      method: 'POST',
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        'Content-Type': file.type,
      },
      body: await file.arrayBuffer(),
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      return NextResponse.json({ error: err }, { status: 400 });
    }

    // Get public URL
    const publicUrl = `${URL}/storage/v1/object/public/avatars/${path}`;

    // Update profile
    await fetch(`${URL}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}`, {
      method: 'PATCH',
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ avatar_url: publicUrl }),
    });

    return NextResponse.json({ ok: true, url: publicUrl });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
