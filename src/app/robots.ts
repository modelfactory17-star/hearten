import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/messages'],
    },
    sitemap: 'https://hearten.com.hk/sitemap.xml',
  };
}
