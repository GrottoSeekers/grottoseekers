export const prerender = false;

import type { APIRoute } from 'astro';
import { clearCookie } from '../../../lib/auth';

export const GET: APIRoute = async () => {
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/',
      'Set-Cookie': clearCookie(),
    },
  });
};

export const POST: APIRoute = GET;
