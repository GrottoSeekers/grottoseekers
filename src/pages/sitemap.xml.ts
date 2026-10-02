export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../lib/supabase';

const SITE = 'https://www.myahsits.com';

// Public pages for search engines, always on myahsits.com: the main pages,
// every sitter's profile page and every open sit.
export const GET: APIRoute = async () => {
  const urls: { loc: string; lastmod?: string }[] = [
    { loc: SITE + '/' },
    { loc: SITE + '/listings' },
    { loc: SITE + '/signup' },
    { loc: SITE + '/login' },
  ];
  try {
    const { data: sitters } = await supabase
      .from('profiles')
      .select('slug, updated_at')
      .eq('profile_type', 'sitter');
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
