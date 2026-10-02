export const prerender = false;

import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/auth';
import { supabase } from '../../../lib/supabase';
import { accountFor } from '../../../lib/account';

export const POST: APIRoute = async ({ request }) => {
  try {
    const session = await getSession(request);
    if (!session) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const { recipient_profile_id, listing_id } = await request.json();

    if (!recipient_profile_id) {
      return new Response(JSON.stringify({ error: 'Missing recipient' }), { status: 400 });
    }

    // Sitter or owner comes from the account (sign-up role).
    const acct = await accountFor(session.userId, session.email, session.role);
    // Messaging opens once the member's ID is approved.
    if (acct.profile && !acct.verified) return new Response(JSON.stringify({ error: 'id_required', detail: 'Verify your ID to send messages.' }), { status: 403 });
    const senderProfile: any = acct.profile ? { ...acct.profile, profile_type: acct.side } : null;

    if (!senderProfile) {
      return new Response(JSON.stringify({ error: 'No profile found' }), { status: 400 });
    }

    const isSitter = senderProfile.profile_type === 'sitter';
    const sitterProfileId = isSitter ? senderProfile.id : recipient_profile_id;
    const ownerProfileId = isSitter ? recipient_profile_id : senderProfile.id;

    const query = supabase
      .from('conversations')
      .select('id')
      .eq('sitter_profile_id', sitterProfileId)
      .eq('owner_profile_id', ownerProfileId);

    if (listing_id) {
      query.eq('listing_id', listing_id);
    } else {
      query.is('listing_id', null);
    }

    const { data: existing } = await query.maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ conversation_id: existing.id }), { status: 200 });
    }

    const insert: Record<string, any> = {
      sitter_profile_id: sitterProfileId,
      owner_profile_id: ownerProfileId,
    };
    if (listing_id) insert.listing_id = listing_id;

    const { data: newConv, error: convError } = await supabase
      .from('conversations')
      .insert(insert)
      .select('id')
      .single();

    if (convError || !newConv) {
      return new Response(JSON.stringify({ error: convError?.message ?? 'Failed to create conversation' }), { status: 500 });
    }

    return new Response(JSON.stringify({ conversation_id: newConv.id }), { status: 200 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
