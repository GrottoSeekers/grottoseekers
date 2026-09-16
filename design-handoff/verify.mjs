#!/usr/bin/env node
// Checks a rebuilt page against its approved reference design.
//
//   node design-handoff/verify.mjs            # every page
//   node design-handoff/verify.mjs Home       # one page
//
// Run from the repo root, with this folder at design-handoff/.
// It extracts the design values (hex colours, rgba, rem sizes, px paddings,
// radii, shadows, letter-spacing) from reference/<Page>.dc.html and reports
// which ones are absent from the repo file(s) that render that route.

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');

const PAGES = {
  'Home':                  ['src/pages/index.astro', 'src/components', 'src/styles/global.css'],
  'Sign up':               ['src/pages/signup.astro'],
  'Log in':                ['src/pages/login.astro'],
  'Browse sits':           ['src/pages/listings.astro'],
  'Sit detail':            ['src/pages/listings/[id].astro'],
  'Sitter profile':        ['src/pages/[slug].astro'],
  'Dashboard':             ['src/pages/dashboard.astro'],
  'Owner dashboard':       ['src/pages/owner/dashboard.astro'],
  'Create profile':        ['src/pages/profile/create.astro'],
  'Edit profile':          ['src/pages/profile/edit.astro'],
  'Create owner profile':  ['src/pages/owner/create.astro'],
  'Edit owner profile':    ['src/pages/owner/edit.astro'],
  'Post a sit':            ['src/pages/owner/listings/new.astro'],
  'Edit listing':          ['src/pages/owner/listings/[id]/edit.astro'],
  'Messages':              ['src/pages/messages/index.astro', 'src/pages/messages/[id].astro'],
  'Leave a review':        ['src/pages/review/[token].astro'],
  'Applications':          ['src/pages'],
  'Availability':          ['src/pages'],
  'Confirmed sit':         ['src/pages'],
  'Notifications':         ['src/pages'],
  'Saved sits':            ['src/pages'],
  'Verification':          ['src/pages'],
  'Find a sitter':         ['src/pages'],
};

// Values that must not survive anywhere in the repo.
const FORBIDDEN = ['#8a6a4f', '#6d3f9e', '#c9a227', '#b8860b', '#d4af37', 'myah-gold'];

const BRAND_FILES = [
  'logo-mark.png', 'logo-mark-white.png', 'logo-mark-cream.png',
  'logo-mark-forest.png', 'logo-mark-ink.png', 'logo-tile.png',
  'logo-tile-cream.png', 'favicon.png', 'app-tile.png',
  'avatar-cream.png', 'avatar-forest.png',
];

const norm = s => s.toLowerCase().replace(/\s+/g, ' ').replace(/;\s*/g, ';').trim();

function designValues(html) {
  const v = new Set();
  const add = (re, min = 0) => {
    for (const m of html.matchAll(re)) {
      const t = m[0].toLowerCase();
      if (t.length >= min) v.add(t);
    }
  };
  add(/#[0-9a-f]{6}\b/gi);
  add(/rgba\([^)]+\)/gi);
  add(/font-size:\s*[\d.]+rem/gi);
  add(/letter-spacing:\s*[\d.]+em/gi);
  add(/border-radius:\s*[\d.]+(px|%)/gi);
  add(/padding:\s*[\d.]+px[^;"]*/gi);
  add(/gap:\s*[\d.]+px/gi);
  add(/box-shadow:\s*[^;"]+/gi);
  add(/translatey\(-?[\d.]+px\)/gi);
  return [...v].map(norm);
}

function collect(paths) {
  let out = '';
  for (const p of paths) {
    const abs = join(ROOT, p);
    if (!existsSync(abs)) continue;
    const walk = d => {
      for (const e of readdirSync(d, { withFileTypes: true })) {
        const f = join(d, e.name);
        if (e.isDirectory()) walk(f);
        else if (/\.(astro|css|ts|tsx|js|jsx|html)$/.test(e.name)) out += readFileSync(f, 'utf8');
      }
    };
    if (statSync(abs).isDirectory()) walk(abs);
    else out += readFileSync(abs, 'utf8');
  }
  return norm(out);
}

function checkPage(page) {
  const ref = join(HERE, 'reference', `${page}.dc.html`);
  if (!existsSync(ref)) return { page, skip: 'no reference file' };
  const paths = PAGES[page];
  if (!paths) return { page, skip: 'not in PAGES map — add its route' };

  const want = designValues(readFileSync(ref, 'utf8'));
  const got = collect(paths);
  const missing = want.filter(v => !got.includes(v));
  return { page, total: want.length, missing };
}

const arg = process.argv.slice(2).join(' ').trim();
const pages = arg ? [arg] : Object.keys(PAGES);

let failed = 0;
for (const p of pages) {
  const r = checkPage(p);
  if (r.skip) { console.log(`SKIP  ${p} — ${r.skip}`); continue; }
  const pct = Math.round(((r.total - r.missing.length) / r.total) * 100);
  if (r.missing.length === 0) {
    console.log(`PASS  ${p} — ${r.total}/${r.total} design values present`);
  } else {
    failed++;
    console.log(`FAIL  ${p} — ${r.total - r.missing.length}/${r.total} present (${pct}%), ${r.missing.length} missing`);
    for (const m of r.missing.slice(0, 40)) console.log(`        missing: ${m}`);
    if (r.missing.length > 40) console.log(`        …and ${r.missing.length - 40} more`);
  }
}

// Repo-wide checks
const all = collect(['src']);
const stale = FORBIDDEN.filter(f => all.includes(f.toLowerCase()));
if (stale.length) { failed++; console.log(`FAIL  old palette still in src/: ${stale.join(', ')}`); }
else console.log('PASS  no old palette values in src/');

const absent = BRAND_FILES.filter(f => !existsSync(join(ROOT, 'public/images', f)));
if (absent.length) { failed++; console.log(`FAIL  brand assets missing from public/images/: ${absent.join(', ')}`); }
else console.log('PASS  brand assets present');

process.exit(failed ? 1 : 0);
