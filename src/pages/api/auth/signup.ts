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
    const confirm = (form.get('confirm') as string) ?? '';

    if (!email || !password) {
      return new Response(null, { status: 302, headers: { Location: '/signup?error=missing' } });
    }
    if (password.length < 8) {
      return new Response(null, { status: 302, headers: { Location: '/signup?error=short' } });
    }
    if (password !== confirm) {
      return new Response(null, { status: 302, headers: { Location: '/signup?error=mismatch' } });
    }

    const { data: existing, error: lookupError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (lookupError) {
      return new Response(null, { status: 302, headers: { Location: `/signup?error=db&detail=${encodeURIComponent(lookupError.message)}` } });
    }

    if (existing) {
      return new Response(null, { status: 302, headers: { Location: '/signup?error=exists' } });
    }

    const hash = await bcrypt.hash(password, 12);
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({ email, password: hash })
      .select('id, email')
      .single();

    if (error || !newUser) {
      return new Response(null, { status: 302, headers: { Location: `/signup?error=db&detail=${encodeURIComponent(error?.message ?? 'Insert failed')}` } });
    }

    const token = await signSession(newUser.id, newUser.email);

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/dashboard',
        'Set-Cookie': sessionCookie(token),
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return new Response(null, { status: 302, headers: { Location: `/signup?error=db&detail=${encodeURIComponent(msg)}` } });
  }
};
