// Pre-launch mode. Until SITE_LAUNCHED=true is set in Vercel, the public can
// only see the founders' page, the "launching soon" page and the legal pages.
// The founders (admins) still see and use everything.
import { FOUNDERS_SLUG } from '../data/founders';

const flag = String(import.meta.env.SITE_LAUNCHED ?? (globalThis as any).process?.env?.SITE_LAUNCHED ?? '');
export const LAUNCHED = flag.trim().toLowerCase() === 'true';

const OPEN = new Set([
  '/', '/coming-soon', '/' + FOUNDERS_SLUG, '/privacy', '/terms', '/login', '/admin',
  '/sitemap.xml', '/robots.txt',
  '/api/enquiry', '/api/interest', '/api/auth/login', '/api/auth/logout',
]);

/** Can a signed-out visitor open this path before launch? */
export function openBeforeLaunch(path: string): boolean {
  const p = path.length > 1 ? path.replace(/\/+$/, '') : path;
  if (OPEN.has(p)) return true;
  if (p.startsWith('/_astro/') || p.startsWith('/images/') || p.startsWith('/_image')) return true;
  return /\.[a-z0-9]{2,5}$/i.test(p); // static files
}
