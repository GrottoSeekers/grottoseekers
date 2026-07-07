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
      .select('id, platforms_json')
      .eq('user_id', session.userId)
      .single();

    if (!profile) {
      return new Response(null, { status: 302, headers: { Location: '/profile/create' } });
    }

    const platforms: any[] = Array.isArray(profile.platforms_json) ? [...profile.platforms_json] : [];

    if (action === 'add') {
      const name = (form.get('name') as string)?.trim() ?? '';
      const url = (form.get('url') as string)?.trim() ?? '';
      const emoji = '';
      const description = (form.get('description') as string)?.trim() ?? '';

      if (!name || !url) {
        return new Response(null, { status: 302, headers: { Location: '/profile/edit?error=missing#platforms' } });
      }

      platforms.push({ name, url, emoji, description });

      const { error } = await supabase
        .from('profiles')
        .update({ platforms_json: platforms })
        .eq('id', profile.id);

      if (error) {
        return new Response(null, { status: 302, headers: { Location: '/profile/edit?error=server#platforms' } });
      }

      return new Response(null, { status: 302, headers: { Location: '/profile/edit?saved=platforms#platforms' } });
    }

    if (action === 'delete') {
      const index = parseInt(form.get('index') as string, 10);
      if (isNaN(index) || index < 0 || index >= platforms.length) {
        return new Response(null, { status: 302, headers: { Location: '/profile/edit?error=server#platforms' } });
      }

      platforms.splice(index, 1);

      const { error } = await supabase
        .from('profiles')
        .update({ platforms_json: platforms })
        .eq('id', profile.id);

      if (error) {
        return new Response(null, { status: 302, headers: { Location: '/profile/edit?error=server#platforms' } });
      }

      return new Response(null, { status: 302, headers: { Location: '/profile/edit?saved=platforms#platforms' } });
    }

    return new Response(null, { status: 302, headers: { Location: '/profile/edit?error=server' } });
  } catch {
    return new Response(null, { status: 302, headers: { Location: '/profile/edit?error=server' } });
  }
};
