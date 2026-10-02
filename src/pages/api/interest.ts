export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { emailInterestThanks, emailInterestToAdmin } from '../../lib/email';

// "Register your interest" before launch. Saves the email to launch_interest
// and sends a thank-you. Works from a normal form post or fetch().
export const POST: APIRoute = async ({ request }) => {
  const wantsJson = (request.headers.get('accept') || '').includes('application/json');
  const done = (ok: boolean, error = '') => wantsJson
    ? new Response(JSON.stringify(ok ? { ok } : { error }), { status: ok ? 200 : 400, headers: { 'Content-Type': 'application/json' } })
    : new Response(null, { status: 303, headers: { Location: (ok ? '/?registered=1' : '/?error=' + error) + '#register' } });

  try {
    const form = await request.formData();
    if (String(form.get('website') || '')) return done(true); // spam trap
    const email = String(form.get('email') || '').trim().toLowerCase();
    const role = String(form.get('role') || '').slice(0, 20);
    const source = String(form.get('source') || '').slice(0, 60);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) return done(false, 'email');

    const { error } = await supabase.from('launch_interest')
      .upsert({ email, role: role || null, source: source || null }, { onConflict: 'email', ignoreDuplicates: true });
    if (error) await emailInterestToAdmin(email, role);

    await emailInterestThanks(email);
    return done(true);
  } catch {
    return done(false, 'server');
  }
};
