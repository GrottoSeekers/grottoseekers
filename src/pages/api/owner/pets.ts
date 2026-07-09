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
      .select('id, pets_json')
      .eq('user_id', session.userId)
      .single();

    if (!profile) {
      return new Response(null, { status: 302, headers: { Location: '/owner/create' } });
    }

    const pets: any[] = Array.isArray(profile.pets_json) ? [...profile.pets_json] : [];

    if (action === 'add') {
      const name        = (form.get('pet_name') as string)?.trim() ?? '';
      const type        = (form.get('pet_type') as string)?.trim() ?? '';
      const breed       = (form.get('pet_breed') as string)?.trim() || null;
      const age         = (form.get('pet_age') as string)?.trim() || null;
      const temperament = (form.get('pet_temperament') as string)?.trim() || null;
      const special_needs = (form.get('pet_special_needs') as string)?.trim() || null;

      if (!name || !type) {
        return new Response(null, { status: 302, headers: { Location: '/owner/edit?error=missing#pets' } });
      }

      let photo_url: string | null = null;
      const file = form.get('pet_photo');
      if (file instanceof File && file.size > 0) {
        if (file.size > 5 * 1024 * 1024) {
          return new Response(null, { status: 302, headers: { Location: '/owner/edit?error=file_too_large#pets' } });
        }
        const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
        const path = `${session.userId}/pet-${Date.now()}.${ext}`;
        const buffer = new Uint8Array(await file.arrayBuffer());
        const { error: uploadError } = await supabase.storage
          .from('profile-pics')
          .upload(path, buffer, { contentType: file.type, upsert: true });
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('profile-pics').getPublicUrl(path);
          photo_url = urlData.publicUrl;
        }
      }

      pets.push({ name, type, breed, age, temperament, special_needs, photo_url });
    }

    if (action === 'delete') {
      const index = parseInt(form.get('index') as string, 10);
      if (isNaN(index) || index < 0 || index >= pets.length) {
        return new Response(null, { status: 302, headers: { Location: '/owner/edit?error=server#pets' } });
      }
      const removed = pets[index];
      if (removed?.photo_url) {
        const storagePath = removed.photo_url.split('/profile-pics/')[1];
        if (storagePath) {
          await supabase.storage.from('profile-pics').remove([decodeURIComponent(storagePath)]);
        }
      }
      pets.splice(index, 1);
    }

    const { error } = await supabase
      .from('profiles')
      .update({ pets_json: pets })
      .eq('id', profile.id);

    if (error) {
      return new Response(null, { status: 302, headers: { Location: '/owner/edit?error=server#pets' } });
    }

    return new Response(null, { status: 302, headers: { Location: `/owner/edit?saved=pets#pets` } });
  } catch {
    return new Response(null, { status: 302, headers: { Location: '/owner/edit?error=server#pets' } });
  }
};
