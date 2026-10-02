export const prerender = false;

import { sitterProfiles } from '../lib/account';
import type { APIRoute } from 'astro';
import { supabase } from '../lib/supabase';
import { LAUNCHED } from '../lib/launch';
import { FOUNDERS_SLUG } from '../data/founders';

const SITE = 'https://www.myahsits.com';

// Public pages for search engines, always on myahsits.com: the main pages,
// every sitter's profile page and every open sit.
export const GET: APIRoute = async () => {
  if (!LAUNCHED) {
    // Before launch only these pages are open to the public.
    const open = ['/', '/' + FOUNDERS_SLUG, '/privacy', '/terms'];
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        open.map((p) => '  <url><loc>' + SITE + p + '</loc></url>').join('\n') + '\n</urlset>\n',
      { headers: { 'Content-Type': 'application/xml' } },
    );
  }
  const urls: { loc: string; lastmod?: string }[] = [
    { loc: SITE + '/' },
    { loc: SITE + '/listings' },
    { loc: SITE + '/signup' },
    { loc: SITE + '/login' },
    { loc: SITE + '/privacy' },
    { loc: SITE + '/terms' },
  ];
  try {
    const sitters = await sitterProfiles('slug, updated_at');
    for (const s of sitters ?? []) {
      if (s.slug) urls.push({ loc: SITE + '/' + s.slug, lastmod: s.updated_at?.slice(0, 10) });
    }
    const { data: listings } = await supabase
      .from('listings')
      .select('id, updated_at')
      .eq('status', 'active');
    for (const l of listings ?? []) {
      urls.push({ loc: SITE + '/listings/' + l.id, lastmod: l.updated_at?.slice(0, 10) });
    }
  } catch {}

  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls
      .map((u) => '  <url><loc>' + u.loc + '</loc>' + (u.lastmod ? '<lastmod>' + u.lastmod + '</lastmod>' : '') + '</url>')
      .join('\n') +
    '\n</urlset>\n';

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
};
