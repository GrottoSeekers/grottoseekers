export const prerender = false;

import type { APIRoute } from 'astro';
import { clearCookie } from '../../../lib/auth';

export const GET: APIRoute = async ({ url }) => {
  // Signing out of the admin page returns to its sign-in box.
  const next = url.searchParams.get('next') === '/admin' ? '/admin' : '/';
  return new Response(null, {
    status: 302,
    headers: {
      Location: next,
      'Set-Cookie': clearCookie(),
    },
  });
};

export const POST: APIRoute = GET;
