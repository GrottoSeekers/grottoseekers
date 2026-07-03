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
    const category = form.get('category') as string;

    const validCategories = ['hero', 'about', 'gallery'];
    if (!validCategories.includes(category)) {
      return new Response(null, { status: 302, headers: { Location: '/profile/edit?error=server' } });
    }

    const columnMap: Record<string, string> = {
      hero: 'hero_images_json',
      about: 'about_images_json',
      gallery: 'gallery_json',
    };
    const column = columnMap[category];

    const { data: profile } = await supabase
      .from('profiles')
      .select(`id, ${column}`)
      .eq('user_id', session.userId)
      .single();

    if (!profile) {
      return new Response(null, { status: 302, headers: { Location: '/profile/create' } });
    }

    const images: any[] = Array.isArray(profile[column]) ? [...profile[column]] : [];
    const anchor = category === 'hero' ? 'hero' : category === 'about' ? 'about' : 'gallery';

    if (action === 'upload') {
      const file = form.get('file');
      if (!(file instanceof File) || file.size === 0) {
        return new Response(null, { status: 302, headers: { Location: `/profile/edit?error=missing#${anchor}` } });
      }
      if (file.size > 5 * 1024 * 1024) {
        return new Response(null, { status: 302, headers: { Location: `/profile/edit?error=file_too_large#${anchor}` } });
      }

      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
      const path = `${session.userId}/${category}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pics')
        .upload(path, file, { contentType: file.type, upsert: true });

      if (uploadError) {
        return new Response(null, { status: 302, headers: { Location: `/profile/edit?error=server#${anchor}` } });
      }

      const { data: urlData } = supabase.storage.from('profile-pics').getPublicUrl(path);
      const url = urlData.publicUrl;

      if (category === 'hero') {
        const pos = (form.get('pos') as string)?.trim() || 'center';
        images.push({ src: url, pos });
      } else {
        const alt = (form.get('alt') as string)?.trim() || '';
        images.push({ src: url, alt });
      }

      const { error } = await supabase
        .from('profiles')
        .update({ [column]: images })
        .eq('id', profile.id);

      if (error) {
        return new Response(null, { status: 302, headers: { Location: `/profile/edit?error=server#${anchor}` } });
      }

      return new Response(null, { status: 302, headers: { Location: `/profile/edit?saved=${category}#${anchor}` } });
    }

    if (action === 'delete') {
      const index = parseInt(form.get('index') as string, 10);
      if (isNaN(index) || index < 0 || index >= images.length) {
        return new Response(null, { status: 302, headers: { Location: `/profile/edit?error=server#${anchor}` } });
      }

      const removed = images[index];
      if (removed?.src) {
        const storagePath = removed.src.split('/profile-pics/')[1];
        if (storagePath) {
          await supabase.storage.from('profile-pics').remove([decodeURIComponent(storagePath)]);
        }
      }

      images.splice(index, 1);

      const { error } = await supabase
        .from('profiles')
        .update({ [column]: images })
        .eq('id', profile.id);

      if (error) {
        return new Response(null, { status: 302, headers: { Location: `/profile/edit?error=server#${anchor}` } });
      }

      return new Response(null, { status: 302, headers: { Location: `/profile/edit?saved=${category}#${anchor}` } });
    }

    return new Response(null, { status: 302, headers: { Location: '/profile/edit?error=server' } });
  } catch {
    return new Response(null, { status: 302, headers: { Location: '/profile/edit?error=server' } });
  }
};
