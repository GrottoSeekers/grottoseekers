import { supabase } from './supabase';

export type NotifyKind = 'urgent' | 'message' | 'sit' | 'review' | 'match' | 'account';

// Adds a row to a profile's /notifications feed. Never throws: a failed
// notification must not break the action that triggered it.
export async function notify(
  profileId: string,
  n: { kind: NotifyKind; title: string; body?: string; link?: string; cta?: string },
) {
  try {
    await supabase.from('notifications').insert({
      profile_id: profileId,
      kind: n.kind,
      title: n.title,
      body: n.body ?? null,
      link: n.link ?? null,
      cta: n.cta ?? null,
    });
  } catch {}
}
