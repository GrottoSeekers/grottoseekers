// Data for the shared signed-in header (src/pages/_nav.astro): the same as the
// dashboards, so people can always see where they are and jump straight back.
//   Top bar: logo + this side's pages (current one underlined) + Log out.
//   Tab bar: Dashboard · Sits · Messages · Profile (current one underlined).
// `active` is a top-bar key (browse, saved, availability, verification,
// notifications, post, find, applications) or a tab key (dashboard, sits,
// messages, profile).
export type NavSide = 'sitter' | 'owner';

const ICONS: Record<string, string> = {
  dashboard: '<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect>',
  sits: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
  messages: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>',
  profile: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
};

export function buildNav(side: NavSide, active = '', admin = false) {
  const owner = side === 'owner';
  const home = owner ? '/owner/dashboard' : '/dashboard';
  const links = (owner
    ? [
      { key: 'post', label: 'Post a sit', href: '/owner/listings/new' },
      { key: 'find', label: 'Find a sitter', href: '/find-a-sitter' },
      { key: 'applications', label: 'Applications', href: '/applications' },
      { key: 'verification', label: 'Verification', href: '/verification' },
      { key: 'notifications', label: 'Notifications', href: '/notifications' },
    ]
    : [
      { key: 'browse', label: 'Browse sits', href: '/listings' },
      { key: 'saved', label: 'Saved', href: '/saved' },
      { key: 'availability', label: 'Availability', href: '/availability' },
      { key: 'verification', label: 'Verification', href: '/verification' },
      { key: 'notifications', label: 'Notifications', href: '/notifications' },
    ]).concat(admin ? [{ key: 'idchecks', label: 'ID checks', href: '/admin' }] : []).map((l) => ({
    ...l,
    on: l.key === active,
  }));
  const tabs = [
    { key: 'dashboard', label: 'Dashboard', href: home },
    { key: 'sits', label: owner ? 'My sits' : 'Sits', href: home + '?tab=sits' },
    { key: 'messages', label: 'Messages', href: '/messages' },
    { key: 'profile', label: 'Profile', href: owner ? '/owner/profile/edit' : '/profile/edit' },
  ].map((t) => ({
    ...t,
    on: t.key === active,
    icon: ICONS[t.key],
  }));
  return { home, links, tabs };
}
