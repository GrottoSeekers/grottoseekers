import { createClient } from '@supabase/supabase-js';

// ── Coping with the older live database ─────────────────────────────────────
// The live database predates some columns (`CREATE TABLE IF NOT EXISTS` never
// adds them later) and stores some JSON columns as text. Every request goes
// through `tolerantFetch`, so no single page or API has to handle that:
//   - a write naming a column the database lacks is retried without it;
//   - a select naming a column the database lacks is retried without it;
//   - `*_json` values that come back as text are parsed into objects/arrays.

const MISSING_WRITE = /Could not find the '(\w+)' column/;
const MISSING_READ = /column "?(?:\w+\.)?(\w+)"? does not exist/;

function dropFromSelect(select: string, col: string): string {
  // Remove `col` (optionally aliased) wherever it appears in the select list.
  const re = new RegExp('(^|[,(])\\s*(?:\\w+:)?' + col + '\\s*(?=[,)]|$)', 'g');
  return select
    .replace(re, '$1')
    .replace(/,\s*,/g, ',')
    .replace(/\(\s*,/g, '(')
    .replace(/,\s*\)/g, ')')
    .replace(/^\s*,|,\s*$/g, '');
}

function parseJsonText(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(parseJsonText);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      if (k.endsWith('_json') && typeof v === 'string' && /^\s*[[{]/.test(v)) {
        try { out[k] = JSON.parse(v); continue; } catch {}
      }
      out[k] = v && typeof v === 'object' ? parseJsonText(v) : v;
    }
    return out;
  }
  return value;
}

async function tolerantFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  let url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  let body = init.body;
  const isRest = url.includes('/rest/v1/');

  for (let tries = 0; ; tries++) {
    const res = await fetch(url, { ...init, body });
    if (!isRest) return res;

    if (res.status >= 400 && tries < 25) {
      const text = await res.clone().text();
      let message = '';
      try { message = JSON.parse(text).message ?? ''; } catch {}

      // Write with an unknown column: drop it from the JSON body and retry.
      const w = message.match(MISSING_WRITE);
      if (w && typeof body === 'string') {
        try {
          const parsed = JSON.parse(body);
          const strip = (o: any) => { if (o && typeof o === 'object') delete o[w[1]]; return o; };
          const next = Array.isArray(parsed) ? parsed.map(strip) : strip(parsed);
          const u = new URL(url);
          const cols = u.searchParams.get('columns');
          if (cols) u.searchParams.set('columns', cols.split(',').filter((c) => c.replace(/"/g, '') !== w[1]).join(','));
          url = u.href;
          body = JSON.stringify(next);
          continue;
        } catch {}
      }

      // Select with an unknown column: drop it from ?select= and retry.
      const r = message.match(MISSING_READ);
      if (r) {
        const u = new URL(url);
        const sel = u.searchParams.get('select');
        if (sel) {
          const next = dropFromSelect(sel, r[1]);
          if (next !== sel) {
            u.searchParams.set('select', next || '*');
            url = u.href;
            continue;
          }
        }
      }
      return res;
    }

    // Parse JSON-as-text columns on successful reads.
    const headers = new Headers(res.headers);
    headers.delete('content-length');
    headers.delete('content-encoding');
    const type = res.headers.get('content-type') || '';
    if (res.ok && type.includes('json') && res.status !== 204) {
      const text = await res.text();
      if (!text || !text.includes('_json')) {
        return new Response(text, { status: res.status, statusText: res.statusText, headers });
      }
      try {
        const fixed = JSON.stringify(parseJsonText(JSON.parse(text)));
        return new Response(fixed, { status: res.status, statusText: res.statusText, headers });
      } catch {
        return new Response(text, { status: res.status, statusText: res.statusText, headers });
      }
    }
    return res;
  }
}

function makeClient() {
  const url = import.meta.env.SUPABASE_URL;
  const key = import.meta.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY — add them to your .env file.');
  }
  return createClient(url, key, { global: { fetch: tolerantFetch as typeof fetch } });
}

let _client: ReturnType<typeof createClient> | null = null;

// Lazy proxy — client is only created on first use (not at import/build time)
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_t, prop) {
    if (!_client) _client = makeClient();
    return (_client as any)[prop];
  },
});
