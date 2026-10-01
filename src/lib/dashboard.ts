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
