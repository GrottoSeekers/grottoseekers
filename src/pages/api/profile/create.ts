export const prerender = false;

import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/auth';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, redirect }) => {
  const session = await getSession(request);
  if (!session) return redirect('/login');

  const form = await request.formData();
  const name       = (form.get('name') as string | null)?.trim() ?? '';
  const slug       = (form.get('slug') as string | null)?.trim().toLowerCase() ?? '';
  const tagline    = (form.get('tagline') as string | null)?.trim() || null;
  const profilePic = (form.get('profile_pic') as string | null)?.trim() || null;
  const bio        = (form.get('bio') as string | null)?.trim() || null;

  if (!name || !slug) return redirect('/profile/create?error=missing');

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    return redirect('/profile/create?error=slug_invalid');

  const { data: taken } = await supabase
    .from('profiles')
    .select('slug')
    .eq('slug', slug)
    .maybeSingle();

  if (taken) return redirect('/profile/create?error=slug_taken');

  const { error } = await supabase.from('profiles').insert({
    user_id:           session.userId,
    slug,
    name,
    tagline,
    profile_pic:       profilePic,
    bio,
    hero_images_json:  [],
    about_images_json: [],
    gallery_json:      [],
    reviews_json:      [],
    platforms_json:    [],
  });

  if (error) return redirect('/profile/create?error=server');

  return redirect('/dashboard');
};
