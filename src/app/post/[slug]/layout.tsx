import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const fallback = {
    title: 'Hearten — 香港最暖嘅愛情討論區',
    description: '分享心事，愛情討論區，社群一齊陪住你',
  };
  try {
    const slug = decodeURIComponent(params.slug);
    const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const res = await fetch(
      `${URL}/rest/v1/posts?select=title,preview,slug&slug=eq.${encodeURIComponent(slug)}`,
      { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` }, cache: 'no-store' }
    );
    const data = await res.json();
    const post = Array.isArray(data) ? data[0] : data;
    if (post?.title) {
      return {
        title: post.title,
        description: (post.preview as string)?.slice(0, 150) || post.title,
        alternates: { canonical: `https://hearten.com.hk/post/${post.slug}` },
        openGraph: {
          title: post.title,
          description: (post.preview as string)?.slice(0, 150) || post.title,
          type: 'article',
          url: `https://hearten.com.hk/post/${post.slug}`,
          siteName: 'Hearten',
          locale: 'zh_HK',
        },
      };
    }
  } catch {
    // ignore
  }
  return fallback;
}

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
