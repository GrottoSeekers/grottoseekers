export const prerender = false;

import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/auth';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const session = await getSession(request);
    if (!session) return new Response(null, { status: 302, headers: { Location: '/login' } });

    const form = await request.formData();
    const action = form.get('_action') as string;

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, reviews_json')
      .eq('user_id', session.userId)
      .single();

    if (!profile) {
      return new Response(null, { status: 302, headers: { Location: '/profile/create' } });
    }

    const reviews: any[] = Array.isArray(profile.reviews_json) ? [...profile.reviews_json] : [];

    if (action === 'add') {
      const text = (form.get('text') as string)?.trim() ?? '';
      const name = (form.get('name') as string)?.trim() ?? '';
      const platform = (form.get('platform') as string)?.trim() ?? '';

      if (!text || !name) {
        return new Response(null, { status: 302, headers: { Location: '/profile/edit?error=missing#reviews' } });
      }

      const initials = name
        .split(/\s+/)
        .map((w: string) => w[0]?.toUpperCase() ?? '')
        .join('')
        .slice(0, 2);

      reviews.push({ text, name, initials, platform });

      const { error } = await supabase
        .from('profiles')
        .update({ reviews_json: reviews })
        .eq('id', profile.id);

      if (error) {
        return new Response(null, { status: 302, headers: { Location: '/profile/edit?error=server#reviews' } });
      }

      return new Response(null, { status: 302, headers: { Location: '/profile/edit?saved=reviews#reviews' } });
    }

    if (action === 'delete') {
      const index = parseInt(form.get('index') as string, 10);
      if (isNaN(index) || index < 0 || index >= reviews.length) {
        return new Response(null, { status: 302, headers: { Location: '/profile/edit?error=server#reviews' } });
      }

      reviews.splice(index, 1);

      const { error } = await supabase
        .from('profiles')
        .update({ reviews_json: reviews })
        .eq('id', profile.id);

      if (error) {
        return new Response(null, { status: 302, headers: { Location: '/profile/edit?error=server#reviews' } });
      }

      return new Response(null, { status: 302, headers: { Location: '/profile/edit?saved=reviews#reviews' } });
    }

    return new Response(null, { status: 302, headers: { Location: '/profile/edit?error=server' } });
  } catch {
    return new Response(null, { status: 302, headers: { Location: '/profile/edit?error=server' } });
  }
};
