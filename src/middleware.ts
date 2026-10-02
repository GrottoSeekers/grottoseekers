import { defineMiddleware } from 'astro:middleware';
import { LAUNCHED, openBeforeLaunch } from './lib/launch';
import { getAccount } from './lib/account';
import { getSessionToken } from './lib/auth';

// Before launch: visitors see the founders' page and "launching soon" only.
export const onRequest = defineMiddleware(async (ctx, next) => {
  if (LAUNCHED || ctx.isPrerendered) return next();
  const path = ctx.url.pathname;

  let admin = false;
  if (getSessionToken(ctx.request)) {
    try { admin = !!(await getAccount(ctx.request))?.isAdmin; } catch {}
  }
  if (admin) return next();

  if (path === '/') return ctx.rewrite('/coming-soon' + ctx.url.search);
  if (openBeforeLaunch(path)) {
    // Only the "launching soon" home page should show up on Google; the
    // founders' page still works for anyone with the link (e.g. Facebook).
    const res = await next();
    if (path !== '/coming-soon' && !path.startsWith('/api/') && !/\.[a-z0-9]{2,5}$/i.test(path)) res.headers.set('X-Robots-Tag', 'noindex');
    return res;
  }

  if (path.startsWith('/api/')) {
    return new Response(JSON.stringify({ error: 'launching_soon' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
  }
  return new Response(null, { status: 302, headers: { Location: '/' } });
});
