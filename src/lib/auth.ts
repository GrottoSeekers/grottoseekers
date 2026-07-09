const SECRET = import.meta.env.SESSION_SECRET ?? 'dev-secret-change-in-production';
const COOKIE_NAME = 'gs_session';
const MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
}

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function signSession(userId: string, email: string, role: string = 'sitter'): Promise<string> {
  const payload = JSON.stringify({ userId, email, role, iat: Date.now() });
  const key = await getKey();
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return btoa(payload) + '.' + sigB64;
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  const dotIdx = token.lastIndexOf('.');
  if (dotIdx === -1) return null;
  const payloadB64 = token.slice(0, dotIdx);
  const sigB64 = token.slice(dotIdx + 1);
  try {
    const payload = atob(payloadB64);
    const key = await getKey();
    const sig = Uint8Array.from(atob(sigB64), (c) => c.charCodeAt(0));
    const valid = await crypto.subtle.verify('HMAC', key, sig, new TextEncoder().encode(payload));
    if (!valid) return null;
    const data = JSON.parse(payload) as SessionPayload;
    if (Date.now() - data.iat > MAX_AGE * 1000) return null;
    return data;
  } catch {
    return null;
  }
}

export function sessionCookie(token: string): string {
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${MAX_AGE}; Secure`;
}

export function clearCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0`;
}

export function getSessionToken(request: Request): string | null {
  const header = request.headers.get('cookie') ?? '';
  const match = header.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function getSession(request: Request): Promise<SessionPayload | null> {
  const token = getSessionToken(request);
  if (!token) return null;
  return verifySession(token);
}
