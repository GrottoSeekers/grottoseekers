export const prerender = false;

import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/auth';
import { supabase } from '../../../lib/supabase';

const KEYS = [
  'about_label', 'about_title',
  'reviews_label', 'reviews_title',
  'gallery_label', 'gallery_title',
  'platforms_label', 'platforms_title',
  'enquiry_label', 'enquiry_title',
];

export const POST: APIRoute = async ({ request }) => {
  try {
    const session = await getSession(request);
    if (!session) return new Response(null, { status: 302, headers: { Location: '/login' } });

    const form = await request.formData();

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, headings_json')
      .eq('user_id', session.userId)
      .single();

    if (!profile) {
      return new Response(null, { status: 302, headers: { Location: '/profile/create' } });
    }

    const headings: Record<string, string> = {};
    for (const key of KEYS) {
      const val = (form.get(key) as string | null)?.trim() ?? '';
      if (val) headings[key] = val;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ headings_json: headings })
      .eq('id', profile.id);

    if (error) {
      return new Response(null, { status: 302, headers: { Location: '/profile/edit?error=server#headings' } });
    }

    return new Response(null, { status: 302, headers: { Location: '/profile/edit?saved=headings#headings' } });
  } catch {
    return new Response(null, { status: 302, headers: { Location: '/profile/edit?error=server#headings' } });
  }
};
