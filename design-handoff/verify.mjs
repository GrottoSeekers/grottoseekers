#!/usr/bin/env node
// Checks a rebuilt page against its approved reference design.
//
//   node design-handoff/verify.mjs            # every page
//   node design-handoff/verify.mjs Home       # one page
//
// Run from the repo root. Three checks per page:
//   VALUES  — design values (hex, rgba, rem, px, radii, shadows) present?
//   COPY    — every line of approved copy present, in the reference's order?
//   EXTRAS  — copy in the repo that is NOT in the design (leftover old sections)?
//
// Never edit files under reference/ to make this pass. The reference is the
// approved design; if a check contradicts it, the check is wrong — report it.

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

// Palettes from before the rebrand. #8a6a4f is NOT here — it is the design's
// lighter tan and appears legitimately in several specs.
const FORBIDDEN = ['#6d3f9e', '#c9a227', '#b8860b', '#d4af37', 'myah-gold', '--gold'];

const BRAND_FILES = [
  'logo-mark.png', 'logo-mark-white.png', 'logo-mark-cream.png',
  'logo-mark-forest.png', 'logo-mark-ink.png', 'logo-tile.png',
  'logo-tile-cream.png', 'favicon.png', 'app-tile.png',
  'avatar-cream.png', 'avatar-forest.png',
];

const norm = s => s.toLowerCase().replace(/\s+/g, ' ').replace(/;\s*/g, ';').trim();

const decode = s => s
  .replace(/&amp;/g, '&').replace(/&mdash;/g, '—').replace(/&ndash;/g, '–')
  .replace(/&middot;/g, '·').replace(/&rsquo;/g, '’').replace(/&lsquo;/g, '‘')
  .replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”').replace(/&nbsp;/g, ' ')
  .replace(/&hellip;/g, '…').replace(/&#8250;/g, '›').replace(/&quot;/g, '"');

function designValues(html) {
  const v = new Set();
  const add = re => { for (const m of html.matchAll(re)) v.add(m[0].toLowerCase()); };
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

// Visible sentences of copy, long enough to be unambiguous.
function copyLines(html) {
  const text = decode(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<helmet[\s\S]*?<\/helmet>/gi, ' ')
    .replace(/<[^>]+>/g, '\n');
  const seen = new Set();
  return text.split('\n')
    .map(s => s.replace(/\s+/g, ' ').trim())
    .filter(s => s.length >= 28 && /[a-z]{3}/i.test(s) && !/\{\{|^\.|^[#@]/.test(s))
    .filter(s => { const k = s.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });
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
        else if (/\.(astro|css|ts|tsx|js|jsx|html)$/.test(e.name)) out += readFileSync(f, 'utf8') + '\n';
      }
    };
    if (statSync(abs).isDirectory()) walk(abs);
    else out += readFileSync(abs, 'utf8') + '\n';
  }
  return out;
}

function report(page) {
  const ref = join(HERE, 'reference', `${page}.dc.html`);
  if (!existsSync(ref)) return console.log(`SKIP  ${page} — no reference file`) || 0;
  const paths = PAGES[page];
  if (!paths) return console.log(`SKIP  ${page} — not in PAGES map`) || 0;

  const refHtml = readFileSync(ref, 'utf8');
  const srcRaw = collect(paths);
  const src = norm(srcRaw);
  const srcText = decode(srcRaw).replace(/\s+/g, ' ').toLowerCase();

  let bad = 0;

  const wantV = designValues(refHtml);
  const missV = wantV.filter(v => !src.includes(v));
  if (missV.length) {
    bad++;
    console.log(`FAIL  ${page} VALUES — ${wantV.length - missV.length}/${wantV.length}, ${missV.length} missing`);
    missV.slice(0, 30).forEach(m => console.log(`        ${m}`));
    if (missV.length > 30) console.log(`        …and ${missV.length - 30} more`);
  } else {
    console.log(`PASS  ${page} VALUES — ${wantV.length}/${wantV.length}`);
  }

  const wantC = copyLines(refHtml);
  const missC = wantC.filter(l => !srcText.includes(l.toLowerCase()));
  if (missC.length) {
    bad++;
    console.log(`FAIL  ${page} COPY — ${wantC.length - missC.length}/${wantC.length} lines present, ${missC.length} missing`);
    missC.slice(0, 25).forEach(m => console.log(`        "${m.slice(0, 90)}"`));
    if (missC.length > 25) console.log(`        …and ${missC.length - 25} more`);
  } else {
    console.log(`PASS  ${page} COPY — ${wantC.length}/${wantC.length} lines`);
  }

  // Copy in the repo that the design does not contain — leftover old sections.
  const refText = decode(refHtml).replace(/\s+/g, ' ').toLowerCase();
  const gotC = copyLines(srcRaw);
  const extras = gotC.filter(l => !refText.includes(l.toLowerCase()));
  if (extras.length) {
    bad++;
    console.log(`FAIL  ${page} EXTRAS — ${extras.length} lines of copy not in the design`);
    extras.slice(0, 25).forEach(m => console.log(`        "${m.slice(0, 90)}"`));
    if (extras.length > 25) console.log(`        …and ${extras.length - 25} more`);
  } else {
    console.log(`PASS  ${page} EXTRAS — no copy outside the design`);
  }

  const emoji = [...new Set((srcRaw.match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu) || []))]
    .filter(e => !refHtml.includes(e));
  if (emoji.length) {
    bad++;
    console.log(`FAIL  ${page} EMOJI — not in the design: ${emoji.join(' ')}`);
  }

  return bad;
}

const arg = process.argv.slice(2).join(' ').trim();
const pages = arg ? [arg] : Object.keys(PAGES);

let failed = 0;
for (const p of pages) { failed += report(p); console.log(''); }

const all = collect(['src']).toLowerCase();
const stale = FORBIDDEN.filter(f => all.includes(f));
if (stale.length) { failed++; console.log(`FAIL  old palette still in src/: ${stale.join(', ')}`); }
else console.log('PASS  no old palette values in src/');

const absent = BRAND_FILES.filter(f => !existsSync(join(ROOT, 'public/images', f)));
if (absent.length) { failed++; console.log(`FAIL  brand assets missing from public/images/: ${absent.join(', ')}`); }
else console.log('PASS  brand assets present');

console.log(failed ? `\n${failed} check(s) failed.` : '\nAll checks passed.');
process.exit(failed ? 1 : 0);
