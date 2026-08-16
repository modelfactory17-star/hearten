import type { MetadataRoute } from 'next';

const BASE = 'https://hearten.com.hk';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  const pages = [
    '', '/about', '/contact', '/features', '/faq', '/register',
    '/privacy', '/terms', '/removal', '/support', '/advertise',
    '/partners', '/hot-topics', '/editors-picks', '/members',
    '/polls', '/recent-comments', '/write',
  ];
  for (const p of pages) {
    entries.push({
      url: `${BASE}${p}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: p === '' ? 1 : 0.8,
    });
  }

  // Category pages
  const cats = [
    'dating-life', 'crush', 'breakup', 'marriage', 'lgbtq', 'treehole',
    'tarot', 'work-love', 'school-love', 'family', 'dating-kit', 'bedroom',
  ];
  for (const c of cats) {
    entries.push({
      url: `${BASE}/category/${c}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  }

  // Post pages (fetch real slugs via service key — RLS-safe)
  try {
    const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const res = await fetch(`${URL}/rest/v1/posts?select=slug,created_at`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
      cache: 'no-store',
    });
    const posts = await res.json();
    if (Array.isArray(posts)) {
      for (const p of posts) {
        if (p.slug) {
          entries.push({
            url: `${BASE}/post/${p.slug}`,
            lastModified: new Date(p.created_at),
            changeFrequency: 'monthly',
            priority: 0.7,
          });
        }
      }
    }
  } catch {
    // ignore — sitemap still returns static pages
  }

  return entries;
}
