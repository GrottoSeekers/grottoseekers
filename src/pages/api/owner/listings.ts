export const prerender = false;

import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/auth';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const session = await getSession(request);
    if (!session) return new Response(null, { status: 302, headers: { Location: '/login' } });

    const form = await request.formData();
    const action = (form.get('_action') as string) ?? '';

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', session.userId)
      .single();

    if (!profile) {
      return new Response(null, { status: 302, headers: { Location: '/owner/create' } });
    }

    if (action === 'create') {
      const title       = (form.get('title') as string | null)?.trim() ?? '';
      const description = (form.get('description') as string | null)?.trim() || null;
      const date_from   = (form.get('date_from') as string | null)?.trim() ?? '';
      const date_to     = (form.get('date_to') as string | null)?.trim() ?? '';

      if (!title || !date_from || !date_to) {
        return new Response(null, { status: 302, headers: { Location: '/owner/listings/new?error=missing' } });
      }

      if (date_to < date_from) {
        return new Response(null, { status: 302, headers: { Location: '/owner/listings/new?error=dates' } });
      }

      const { error } = await supabase.from('listings').insert({
        profile_id: profile.id,
        title,
        description,
        date_from,
        date_to,
        status: 'active',
      });

      if (error) {
        return new Response(null, { status: 302, headers: { Location: `/owner/listings/new?error=server&detail=${encodeURIComponent(error.message)}` } });
      }

      return new Response(null, { status: 302, headers: { Location: '/owner/dashboard?saved=listing' } });
    }

    if (action === 'update') {
      const listingId   = (form.get('listing_id') as string | null)?.trim() ?? '';
      const title       = (form.get('title') as string | null)?.trim() ?? '';
      const description = (form.get('description') as string | null)?.trim() || null;
      const date_from   = (form.get('date_from') as string | null)?.trim() ?? '';
      const date_to     = (form.get('date_to') as string | null)?.trim() ?? '';
      const status      = (form.get('status') as string | null)?.trim() ?? 'active';

      if (!listingId || !title || !date_from || !date_to) {
        return new Response(null, { status: 302, headers: { Location: `/owner/listings/${listingId}/edit?error=missing` } });
      }

      if (date_to < date_from) {
        return new Response(null, { status: 302, headers: { Location: `/owner/listings/${listingId}/edit?error=dates` } });
      }

      const { error } = await supabase
        .from('listings')
        .update({ title, description, date_from, date_to, status })
        .eq('id', listingId)
        .eq('profile_id', profile.id);

      if (error) {
        return new Response(null, { status: 302, headers: { Location: `/owner/listings/${listingId}/edit?error=server` } });
      }

      return new Response(null, { status: 302, headers: { Location: '/owner/dashboard?saved=listing' } });
    }

    if (action === 'delete') {
      const listingId = (form.get('listing_id') as string | null)?.trim() ?? '';

      await supabase
        .from('listings')
        .delete()
        .eq('id', listingId)
        .eq('profile_id', profile.id);

      return new Response(null, { status: 302, headers: { Location: '/owner/dashboard?saved=deleted' } });
    }

    return new Response(null, { status: 302, headers: { Location: '/owner/dashboard' } });
  } catch {
    return new Response(null, { status: 302, headers: { Location: '/owner/dashboard?error=server' } });
  }
};
