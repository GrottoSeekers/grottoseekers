// Who is signed in, and which side of MYAH they belong to.
//
// One rule, used by every signed-in page and the profile-creation APIs:
//   - a sitter account lives on the sitter side (/dashboard, /profile/*,
//     /availability, /verification, /saved);
//   - an owner account lives on the owner side (/owner/*, /applications,
//     /find-a-sitter);
//   - messages, notifications and sit pages are shared.
//
// The side is what they picked at sign-up (users.role): it is always saved
// explicitly. A profile whose profile_type disagrees (older profiles relied on
// a database default) is corrected to match. The session cookie's role is
// only a last resort: it can be stale.
import { getSession } from './auth';
import { supabase } from './supabase';

export type Side = 'sitter' | 'owner';

export interface Account {
  userId: string;
  email: string;
  side: Side;
  profile: any | null;
  /** Their dashboard. */
  home: string;
  /** Where they create their profile. */
  createUrl: string;
  /** Where they edit their profile. */
  editUrl: string;
}

const asSide = (v: unknown): Side | null =>
  v === 'owner' ? 'owner' : v === 'sitter' ? 'sitter' : null;

export const homeFor = (side: Side) =>
  side === 'owner' ? '/owner/dashboard' : '/dashboard';
export const createFor = (side: Side) =>
  side === 'owner' ? '/owner/profile/create' : '/profile/create';
export const editFor = (side: Side) =>
  side === 'owner' ? '/owner/profile/edit' : '/profile/edit';

export async function getAccount(request: Request): Promise<Account | null> {
  const session = await getSession(request);
  if (!session) return null;
  return accountFor(session.userId, session.email, session.role);
}

/** Look an account up by id (used at login, before the cookie exists). */
export async function accountFor(
  userId: string,
  email: string,
  sessionRole?: string,
): Promise<Account> {
  const session = { userId, email, role: sessionRole };
  let role: Side | null = null;
  let profile: any = null;
  try {
    const [u, p] = await Promise.all([
      supabase.from('users').select('role').eq('id', session.userId).maybeSingle(),
      supabase.from('profiles').select('*').eq('user_id', session.userId).limit(1),
    ]);
    role = asSide((u.data as any)?.role);
    profile = Array.isArray(p.data) && p.data.length ? p.data[0] : null;
  } catch {}

  const side: Side = role ?? asSide(profile?.profile_type) ?? asSide(session.role) ?? 'sitter';

  // Keep the profile's type in line with the account, so other people see
  // them on the right side too (sitter search, messages, applications).
  if (profile && profile.profile_type !== side) {
    try {
      await supabase.from('profiles').update({ profile_type: side }).eq('id', profile.id);
      profile.profile_type = side;
    } catch {}
  }

  return {
    userId: session.userId,
    email: session.email,
    side,
    profile,
    home: homeFor(side),
    createUrl: createFor(side),
    editUrl: editFor(side),
  };
}

/**
 * For a page that belongs to one side. Returns where to send the visitor
 * instead, or null if they may stay.
 *   - not signed in            → /login
 *   - on the other side        → their own dashboard
 *   - no profile yet           → their own create-profile page
 *     (unless this IS the create page, with needsProfile = false)
 */
export function wrongPlace(
  acct: Account | null,
  side: Side | 'any',
  needsProfile = true,
): string | null {
  if (!acct) return '/login';
  if (side !== 'any' && acct.side !== side) {
    return acct.profile ? acct.home : acct.createUrl;
  }
  if (needsProfile && !acct.profile) return acct.createUrl;
  return null;
}

/** Where to go straight after logging in or signing up. */
export function landingFor(acct: Account): string {
  return acct.profile ? acct.home : acct.createUrl;
}

/**
 * Which side another member's profile belongs to (for messages, invites):
 * their account's sign-up role, falling back to the profile's own type.
 */
export async function sideOfProfile(profile: { user_id?: string; profile_type?: string } | null): Promise<Side | null> {
  if (!profile) return null;
  try {
    if (profile.user_id) {
      const { data } = await supabase.from('users').select('role').eq('id', profile.user_id).limit(1);
      const role = asSide((data as any)?.[0]?.role);
      if (role) return role;
    }
  } catch {}
  return asSide(profile.profile_type);
}

/**
 * Every sitter's profile: accounts that signed up as sitters. Falls back to
 * the profiles' own type field if the users lookup fails.
 */
export async function sitterProfiles(select = '*', limit = 500): Promise<any[]> {
  try {
    const { data: users, error } = await supabase.from('users').select('id').eq('role', 'sitter').limit(2000);
    if (!error && users) {
      const ids = users.map((u: any) => u.id);
      if (!ids.length) return [];
      const out: any[] = [];
      for (let i = 0; i < ids.length && out.length < limit; i += 150) {
        const { data } = await supabase.from('profiles').select(select).in('user_id', ids.slice(i, i + 150));
        out.push(...(data ?? []));
      }
      return out.slice(0, limit);
    }
  } catch {}
  try {
    const { data } = await supabase.from('profiles').select(select).eq('profile_type', 'sitter').limit(limit);
    return data ?? [];
  } catch {
    return [];
  }
}
