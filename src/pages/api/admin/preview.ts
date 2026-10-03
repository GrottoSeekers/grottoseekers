export const prerender = false;

import type { APIRoute } from 'astro';
import { getAccount } from '../../../lib/account';
import { PREVIEW_COOKIE } from '../../../lib/launch';

// Founders only: GET ?on=1 shows the whole site to you (for testing before
// launch); ?on=0 goes back to seeing what visitors see.
export const GET: APIRoute = async ({ request, url }) => {
  const acct = await getAccount(request);
  if (!acct?.isAdmin) return new Response(null, { status: 302, headers: { Location: '/admin' } });
  const on = url.searchParams.get('on') === '1';
  const cookie = on
    ? `${PREVIEW_COOKIE}=1; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 8}`
    : `${PREVIEW_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
  return new Response(null, { status: 302, headers: { Location: on ? '/dashboard' : '/admin', 'Set-Cookie': cookie } });
};
