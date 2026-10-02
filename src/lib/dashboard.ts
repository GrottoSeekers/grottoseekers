// Shared data helpers for the sitter and owner dashboards.

export const arr = (v: unknown): any[] => (Array.isArray(v) ? v : []);

export const tx = (s: string) => s.trim();

export function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function daysBetween(from: string, to: string) {
  const ms = new Date(to + 'T00:00:00').getTime() - new Date(from + 'T00:00:00').getTime();
  return Math.ceil(ms / 86400000);
}

export const dateRange = (from: string, to: string) => fmtDate(from) + ' — ' + fmtDate(to);

export function durationLabel(from: string, to: string) {
  const n = daysBetween(from, to);
  return n + (n === 1 ? ' day' : ' days');
}

export const clip = (s: string | null | undefined, max: number) =>
  s && s.length > max ? s.slice(0, max) + '…' : s || '';

// Profile-strength / listing-strength progress, shared by both dashboards.
export function strength(items: { label: string; done: boolean }[]) {
  const done = items.filter((i) => i.done).length;
  return {
    done,
    total: items.length,
    pct: Math.round((done / items.length) * 100),
    label: done + ' of ' + items.length + ' complete',
  };
}

// Free date ranges from profiles.availability_json, which the Availability page
// stores as a day map { "YYYY-MM-DD": "free" | "maybe" }. An older [{from, to}]
// list is passed through. Consecutive "free" days become one range.
export function freeRanges(v: unknown): { from: string; to: string }[] {
  if (Array.isArray(v)) return v.filter((r) => r && r.from && r.to);
  if (!v || typeof v !== 'object') return [];
  const keys = Object.keys(v as Record<string, string>)
    .filter((k) => (v as Record<string, string>)[k] === 'free')
    .sort();
  const dayNum = (k: string) => Math.round(new Date(k + 'T00:00:00Z').getTime() / 86400000);
  const out: { from: string; to: string }[] = [];
  keys.forEach((k) => {
    const last = out[out.length - 1];
    if (last && dayNum(k) - dayNum(last.to) === 1) last.to = k;
    else out.push({ from: k, to: k });
  });
  return out;
}

// ── Confirmed sits for the dashboards ───────────────────────────────────────
// One card per `sits` row: the sit pack link, dates, who's on the other side
// and a short "when" line. Upcoming/current first (soonest first), then past.
export type SitCard = {
  id: string;
  href: string;
  title: string;
  dates: string;
  duration: string;
  who: string;
  pic: string;
  img: string;
  when: string;
  past: boolean;
  from: string;
};

const todayKey = () => new Date().toISOString().slice(0, 10);

function whenLabel(from: string, to: string) {
  const today = todayKey();
  if (to < today) return 'Finished';
  if (from <= today) return 'Happening now';
  const n = daysBetween(today, from);
  return n === 1 ? 'Starts tomorrow' : 'Starts in ' + n + ' days';
}

function toSitCard(id: string, l: any, who: any, fallbackImg: string): SitCard {
  const hero = arr(l?.profiles?.hero_images_json)[0]?.src || fallbackImg || '';
  return {
    id,
    href: '/sits/' + id,
    title: l?.title || 'Your sit',
    dates: l?.date_from && l?.date_to ? dateRange(l.date_from, l.date_to) : '',
    duration: l?.date_from && l?.date_to ? durationLabel(l.date_from, l.date_to) : '',
    who: who?.name || '',
    pic: who?.profile_pic || '',
    img: hero,
    when: l?.date_from && l?.date_to ? whenLabel(l.date_from, l.date_to) : '',
    past: !!(l?.date_to && l.date_to < todayKey()),
    from: l?.date_from || '',
  };
}

function order(cards: SitCard[]) {
  const live = cards.filter((c) => !c.past).sort((a, b) => (a.from < b.from ? -1 : 1));
  const past = cards.filter((c) => c.past).sort((a, b) => (a.from > b.from ? -1 : 1)).slice(0, 6);
  return [...live, ...past];
}

// Sits the signed-in sitter is confirmed for; "who" is the owner.
export async function sitterSits(supabase: any, userId: string): Promise<SitCard[]> {
  try {
    const { data } = await supabase
      .from('sits')
      .select('id, listings!inner(id, title, date_from, date_to, profiles!inner(name, profile_pic, hero_images_json))')
      .eq('sitter_user_id', userId);
    return order((data ?? []).map((s: any) => toSitCard(s.id, s.listings, s.listings?.profiles, '')));
  } catch {
    return [];
  }
}

// Sits confirmed on the owner's listings; "who" is the sitter.
export async function ownerSits(supabase: any, ownerProfile: any): Promise<SitCard[]> {
  try {
    const { data } = await supabase
      .from('sits')
      .select('id, sitter_profile_id, listings!inner(id, title, date_from, date_to, profile_id)')
      .eq('listings.profile_id', ownerProfile.id);
    const rows: any[] = data ?? [];
    const ids = [...new Set(rows.map((r) => r.sitter_profile_id).filter(Boolean))];
    let people: Record<string, any> = {};
    if (ids.length) {
      const { data: ps } = await supabase.from('profiles').select('id, name, profile_pic').in('id', ids);
      people = Object.fromEntries((ps ?? []).map((p: any) => [p.id, p]));
    }
    const img = arr(ownerProfile.hero_images_json)[0]?.src || '';
    return order(rows.map((r) => toSitCard(r.id, r.listings, people[r.sitter_profile_id], img)));
  } catch {
    return [];
  }
}
