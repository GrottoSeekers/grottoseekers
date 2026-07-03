export const prerender = false;

import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/auth';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const session = await getSession(request);
    if (!session) return new Response(null, { status: 302, headers: { Location: '/login' } });

    const form = await request.formData();
    const name = (form.get('name') as string | null)?.trim() ?? '';
    const tagline = (form.get('tagline') as string | null)?.trim() || null;
    const badge_text = (form.get('badge_text') as string | null)?.trim() || null;
    const bio = (form.get('bio') as string | null)?.trim() || null;

    if (!name) {
      return new Response(null, { status: 302, headers: { Location: '/profile/edit?error=missing#details' } });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, slug')
      .eq('user_id', session.userId)
      .single();

    if (!profile) {
      return new Response(null, { status: 302, headers: { Location: '/profile/create' } });
    }

    let profilePicUrl: string | undefined = undefined;

    const file = form.get('profile_pic');
    if (file instanceof File && file.size > 0) {
      if (file.size > 5 * 1024 * 1024) {
        return new Response(null, { status: 302, headers: { Location: '/profile/edit?error=file_too_large#details' } });
      }
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
      const path = `${session.userId}/profile.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('profile-pics')
        .upload(path, file, { contentType: file.type, upsert: true });
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('profile-pics').getPublicUrl(path);
        profilePicUrl = urlData.publicUrl;
      }
    }

    const updates: Record<string, any> = { name, tagline, badge_text, bio };
    if (profilePicUrl !== undefined) updates.profile_pic = profilePicUrl;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profile.id);

    if (error) {
      return new Response(null, { status: 302, headers: { Location: '/profile/edit?error=server#details' } });
    }

    return new Response(null, { status: 302, headers: { Location: '/profile/edit?saved=details#details' } });
  } catch {
    return new Response(null, { status: 302, headers: { Location: '/profile/edit?error=server#details' } });
  }
};
