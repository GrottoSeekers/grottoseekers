export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const form = await request.formData();
    const token = (form.get('token') as string)?.trim() ?? '';
    const text = (form.get('text') as string)?.trim() ?? '';
    const name = (form.get('name') as string)?.trim() ?? '';

    if (!token || !text || !name) {
      return new Response(null, { status: 302, headers: { Location: `/review/${token}?error=missing` } });
    }

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, reviews_json, review_requests_json')
      .not('review_requests_json', 'is', null);

    if (!profiles) {
      return new Response(null, { status: 302, headers: { Location: `/review/${token}?error=invalid` } });
    }

    let matchedProfile: any = null;
    let requestIndex = -1;

    for (const p of profiles) {
      const reqs: any[] = Array.isArray(p.review_requests_json) ? p.review_requests_json : [];
      const idx = reqs.findIndex((r: any) => r.token === token && r.status === 'pending');
      if (idx !== -1) {
        matchedProfile = p;
        requestIndex = idx;
        break;
      }
    }

    if (!matchedProfile || requestIndex === -1) {
      return new Response(null, { status: 302, headers: { Location: `/review/${token}?error=invalid` } });
    }

    const initials = name
      .split(/\s+/)
      .map((w: string) => w[0]?.toUpperCase() ?? '')
      .join('')
      .slice(0, 2);

    const reviews: any[] = Array.isArray(matchedProfile.reviews_json) ? [...matchedProfile.reviews_json] : [];
    reviews.push({ text, name, initials, platform: 'Grotto Sitters' });

    const requests: any[] = [...matchedProfile.review_requests_json];
    requests[requestIndex] = { ...requests[requestIndex], status: 'completed', reviewer_name: name };

    const { error } = await supabase
      .from('profiles')
      .update({ reviews_json: reviews, review_requests_json: requests })
      .eq('id', matchedProfile.id);

    if (error) {
      return new Response(null, { status: 302, headers: { Location: `/review/${token}?error=server` } });
    }

    return new Response(null, { status: 302, headers: { Location: `/review/${token}?success=true` } });
  } catch {
    return new Response('<h1>Something went wrong</h1><p>Please go back and try again.</p>', {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    });
  }
};
