import { createClient } from '@supabase/supabase-js';

function makeClient() {
  const url = import.meta.env.SUPABASE_URL;
  const key = import.meta.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY — add them to your .env file.');
  }
  return createClient(url, key);
}

let _client: ReturnType<typeof createClient> | null = null;

// Lazy proxy — client is only created on first use (not at import/build time)
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_t, prop) {
    if (!_client) _client = makeClient();
    return (_client as any)[prop];
  },
});
