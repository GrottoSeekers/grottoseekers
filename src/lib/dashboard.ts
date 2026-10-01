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
