export const prerender = false;

import type { APIRoute } from 'astro';
import bcrypt from 'bcryptjs';
import { supabase } from '../../../lib/supabase';
import { signSession, sessionCookie } from '../../../lib/auth';

export const POST: APIRoute = async ({ request }) => {
  try {
    const form = await request.formData();
    const email = (form.get('email') as string ?? '').trim().toLowerCase();
    const password = (form.get('password') as string) ?? '';

    if (!email || !password) {
      return new Response(null, { status: 302, headers: { Location: '/login?error=missing' } });
    }

    const { data: user } = await supabase
      .from('users')
      .select('id, email, password, role')
      .eq('email', email)
      .single();

    const validPassword = user ? await bcrypt.compare(password, user.password) : false;

    if (!user || !validPassword) {
      return new Response(null, { status: 302, headers: { Location: '/login?error=invalid' } });
    }

    const token = await signSession(user.id, user.email, user.role ?? 'sitter');

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/dashboard',
        'Set-Cookie': sessionCookie(token),
      },
    });
  } catch {
    return new Response(null, { status: 302, headers: { Location: '/login?error=server' } });
  }
};
