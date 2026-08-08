import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          if (typeof document === 'undefined') return [];
          return document.cookie.split('; ').map(c => {
            const [name, ...rest] = c.split('=');
            return { name, value: decodeURIComponent(rest.join('=')) };
          });
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            let cookie = `${name}=${encodeURIComponent(value)}`;
            if (options?.maxAge && options.maxAge > 0) cookie += `; Max-Age=${options.maxAge}`;
            if (options?.path) cookie += `; Path=${options.path}`;
            else cookie += '; Path=/';
            if (options?.sameSite) cookie += `; SameSite=${options.sameSite}`;
            else cookie += '; SameSite=Lax';
            if (options?.secure) cookie += '; Secure';
            document.cookie = cookie;
          });
        },
      },
    }
  );
}
