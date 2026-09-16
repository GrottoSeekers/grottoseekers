# MYAH — exact implementation spec

Read this file **before touching code**, and keep `reference/` open while you work. The `reference/` folder is the design source of truth: 25 finished screens, each a self-contained HTML file with inline styles. Every value below was lifted from those files.

**Rule for this task: match, do not interpret.** If a value is in `reference/`, copy it verbatim. If something is not specified here, open the matching reference screen and read the inline `style` attribute off the element. Do not substitute Tailwind scales, rounded-to-nearest values, your own spacing rhythm, or a component library.

How to read a reference file: it is `<x-dc>` markup — plain HTML with inline styles. `style-hover="…"` / `style-active="…"` attributes are hover/active states; implement them as real CSS `:hover` / `:active` rules with the same declarations. The `<script data-dc-script>` block at the bottom is the page behaviour; port it as-is (see §8).

---

## 1. Tokens (exact)

```css
:root {
  --myah-forest:        #2f5d45;  /* primary action */
  --myah-forest-hover:  #3e7a5b;  /* button hover only */
  --myah-bark:          #6e5438;  /* rules, borders, header word on scroll */
  --myah-bark-deep:     #4a3726;  /* logo ink, dark panels */
  --myah-ink:           #2c1a0e;  /* text, footer ground */
  --myah-body:          #6b4e35;  /* body copy on paper */
  --myah-tan:           #8a6a4f;  /* labels, captions, meta */
  --myah-tan-light:     #c4ab8a;  /* accents on ink grounds only */
  --myah-cream:         #e9e0d2;
  --myah-paper:         #faf6ee;  /* page background */
  --myah-clay:          #a4442e;  /* destructive / error */
  --myah-link-hover:    #5c3d20;
}
```

Alpha values in use, verbatim — do not round:
`rgba(110,84,56,.2)` card border · `rgba(110,84,56,.22)` card border (kit) · `rgba(110,84,56,.14)` inner divider · `rgba(110,84,56,.4)` logo divider rule · `rgba(44,26,14,.04)` card shadow · `rgba(44,26,14,.08)` drawer divider · `rgba(250,246,238,.97)` scrolled header · `rgba(255,255,255,.7)` footer body · `rgba(255,255,255,.62)` footer links · `rgba(255,255,255,.45)` footer legal · `rgba(196,171,138,.28)` footer heading rule.

Body defaults (every page):

```css
body { margin:0; background:#faf6ee; color:#2c1a0e; font-family:"Montserrat",sans-serif; overflow-x:hidden; }
* { box-sizing:border-box; }
a { color:#2f5d45; }
a:hover { color:#2c1a0e; }
```

## 2. Fonts

```html
<link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Lato:wght@400;700&display=swap" rel="stylesheet">
```
Preconnect to `fonts.googleapis.com` and `fonts.gstatic.com` (crossorigin) first — as in every reference file.

Exact type values as used:

| Role | Declaration |
| --- | --- |
| Hero h1 | `font-family:'Marcellus',serif;font-size:3.5rem;line-height:1.1;color:#2c1a0e;margin:0 0 26px` — second line in `<em style="color:#2f5d45">`, not italic-looking by accident: keep the `<em>` |
| Section h2 | `font-family:'Marcellus',serif;font-size:1.7rem;color:#2c1a0e` (kit/brand pages `1.8rem`) |
| CTA h2 on ink | `font-family:'Marcellus',serif;font-size:3.5rem;color:#fff;line-height:1.12` with accent line in `#c4ab8a` |
| Eyebrow | `font-size:.75rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:#6e5438` + 26×1px `#6e5438` rule as a flex sibling, `gap:12px` |
| Body | `color:#6b4e35;font-size:1.08rem;line-height:1.8` (cards `.95rem`/`1.75`) |
| Meta / caption | `font-family:'Lato',sans-serif;font-size:.78–.84rem;color:#8a6a4f` |
| Uppercase label | `font-family:'Lato',sans-serif;font-weight:700;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase` |
| Nav link | `font-size:.82rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase` |
| Wordmark | `font-family:'Montserrat',sans-serif;font-weight:500;letter-spacing:.28em` — fixed, never re-spaced |

## 3. The logo lockup (header, footer, all screens)

```html
<a href="/" style="display:inline-flex;align-items:center;gap:14px;text-decoration:none;line-height:1;margin-left:-4px;font-family:'Montserrat',sans-serif;font-weight:500;font-size:1.4rem;letter-spacing:.28em">
  <img src="/images/logo-mark-white.png" alt="" style="height:46px;width:46px;flex-shrink:0;display:block;object-fit:contain">
  <span style="display:flex;flex-direction:column;gap:5px;padding-left:14px;border-left:1px solid rgba(110,84,56,.4)">
    <span style="color:#e9e0d2;line-height:1">MYAH</span>
    <span style="font-family:'Lato',sans-serif;font-weight:700;font-size:.5rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.82);line-height:1;text-shadow:0 1px 8px rgba(44,26,14,.55)">Make Yourself At Home</span>
  </span>
</a>
```

Sizes by context: header/footer mark `46px`; inner-page nav `44px`; loading overlay `74px`; footer wordmark `1.7rem`. Tagline font-size is `.5rem` — that is correct, do not bump it.

## 4. Buttons — one pill, everywhere

Primary (the only CTA style on the site):

```css
.btn {
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
  font-family:"Montserrat",sans-serif; font-size:.82rem; font-weight:600;
  letter-spacing:.1em; text-transform:uppercase; color:#fff; text-decoration:none;
  background:#2f5d45; border:1.5px solid #2f5d45; border-radius:50px;
  padding:16px 36px; cursor:pointer; white-space:nowrap;
  box-shadow:0 6px 20px rgba(110,84,56,.28);
  transition:background .2s, border-color .2s, transform .12s;
}
.btn:hover { background:#3e7a5b; border-color:#3e7a5b; transform:translateY(-2px); box-shadow:0 12px 28px rgba(110,84,56,.36); }
.btn:active { transform:translateY(0) scale(.98); }
```

Compact variant (header, footer, drawer): `font-size:.78rem; padding:13px 28px;` — header version uses `box-shadow:0 4px 14px rgba(44,26,14,.18)`.

Text link CTA: `font-size:.8rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#5c3d20;border-bottom:1px solid rgba(110,84,56,.5);padding-bottom:4px` → hover `color:#2f5d45;border-color:#2f5d45`.

No other button styles exist. No gold, no outline-primary, no square corners.

## 5. Cards, panels, pills

- Card: `background:#fff; border:1px solid rgba(110,84,56,.22); border-radius:18px; padding:34px; box-shadow:0 1px 2px rgba(44,26,14,.04)`. Smaller cards use `border-radius:16px; padding:26px`.
- Inner divider inside a card: `1px solid rgba(110,84,56,.14)`.
- Section-title underline: `width:40px;height:2px;background:#6e5438`.
- Status/tag pill: `font-family:'Lato';font-weight:700;font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;padding:6px 11px;border-radius:999px` — outline form `1px solid rgba(47,93,69,.4)` with `color:#2f5d45`; solid form `background:#2f5d45;color:#fff`.
- Photo frame inside a card: `border-radius:12px; overflow:hidden`, image `width:100%;height:100%;object-fit:cover;display:block`.
- Avatar: `border-radius:50%; object-fit:cover`, cream ring `3px solid #e9e0d2` where used.

## 6. Page structure

- Page background `#faf6ee`. Content column `max-width:1180px; margin:0 auto` (footer inner `1100px`).
- Desktop page padding `56px 48px 100px`; inner-page nav `16px 48px`; homepage header `20px 48px`, `14px 48px` once scrolled.
- Grid gaps: cards `18px`, sections `22px`, footer columns `56px`.
- Footer: `background:#2c1a0e; border-top:3px solid #2f5d45; padding:0 48px 32px`; columns `minmax(0,1.6fr) minmax(0,1fr) minmax(0,1fr)` with `padding:72px 0 48px`; legal row separated by `1px solid rgba(255,255,255,.1)` and `padding-top:28px`.
- Single breakpoint: `@media (max-width:1000px)` — desktop nav hidden, burger shown, page padding `34px 20px 80px`, two-column grids collapse to `minmax(0,1fr)`, cards `padding:26px 22px`. No other breakpoints.

## 7. Inner-page top nav (every screen except the homepage)

```html
<nav style="display:flex;justify-content:space-between;align-items:center;padding:16px 48px;background:#fff;border-bottom:1px solid rgba(110,84,56,.2)">
```
Sticky variants (Browse sits, Sit detail) add `position:sticky;top:0;z-index:210` and a translucent paper background. Nav mark is `logo-mark.png` at `44–46px`; footer/dark nav uses `logo-mark-cream.png`; over hero imagery `logo-mark-white.png`.

## 8. Behaviour to port exactly (see the script block in `reference/Home.dc.html`)

1. **Loading overlay** — fixed, `inset:0`, `z-index:9999`, `background:rgba(250,246,238,.92)`, `backdrop-filter:blur(8px)`, opacity transition `.25s`. Inside: `132px` box, static ring `3px solid rgba(110,84,56,.18)`, spinning ring `border-top-color:#2f5d45; border-right-color:rgba(110,84,56,.45)` with `@keyframes gs-ring { to { transform:rotate(360deg) } }` at `1s linear infinite`, and the mark at `74px` with `@keyframes gs-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }` at `1.8s ease-in-out infinite`. Shows on internal link click and form submit, auto-hides after `1600ms`.
2. **Header scroll state** (homepage) — threshold `scrollY > 60` (or viewport ≤1000px): background → `rgba(250,246,238,0.97)`, `backdrop-filter:blur(12px)`, `box-shadow:0 1px 0 rgba(110,84,56,0.15)`, padding → `14px 48px`; wordmark `#e9e0d2` → `#6e5438`; tagline `rgba(255,255,255,.82)` → `#8a6a4f` and text-shadow removed; nav links `#fff` → `#5c3d20`; **logo swaps `logo-mark-white.png` → `logo-mark.png`**.
3. **Hero slideshow** — 9 images, `opacity` cross-fade `1.2s ease-in-out`, interval `4500ms`, `object-fit:cover; object-position:center 30%`, over `linear-gradient(to right, rgba(44,26,14,.35) 0%, rgba(44,26,14,0) 60%), linear-gradient(to top, rgba(44,26,14,.5) 0%, transparent 40%)`.
4. **Mobile drawer** — `width:320px; max-width:85vw`, `transform:translateX(100%)` → `translateX(0)`, `transition:transform .35s cubic-bezier(.4,0,.2,1)`, `box-shadow:-8px 0 40px rgba(0,0,0,.12)`; overlay `rgba(0,0,0,.45)` fading `.3s`; rows `padding:16px 24px` with a `40px` `border-radius:10px` `#faf6ee` icon tile and a `›` chevron in `rgba(44,26,14,.2)`.

Hero layout: `min-height:100vh`, two equal columns, photo left, copy right with `padding:150px 64px 90px 60px` on paper.

## 9. Logo assets

Copy `brand/*` into `public/images/` (same file names as the repo already uses). Do not re-export, re-trace, convert to SVG, or run an optimiser that resamples them — they must stay byte-identical. `logo-mark-original.png` is the untouched master and is never rendered.

`logo-mark.png` light grounds · `logo-mark-cream.png` on forest/ink · `logo-mark-white.png` over photos · `logo-mark-ink.png` one-colour print · `logo-mark-forest.png` partner lockups · `logo-tile.png` app icon (22% radius) · `logo-tile-cream.png` dark themes · `avatar-forest.png` / `avatar-cream.png` social 1:1 · `app-tile.png` store tile · `favicon.png` 256px.

Head tags:
```html
<link rel="icon" href="/images/favicon.png">
<link rel="apple-touch-icon" href="/images/app-tile.png">
<meta property="og:image" content="/images/logo-tile.png">
```

## 10. Screen map — build each page against its reference file

| Route | Reference file |
| --- | --- |
| `/` | `reference/Home.dc.html` |
| `/listings` | `reference/Browse sits.dc.html` |
| `/listings/[id]` | `reference/Sit detail.dc.html` |
| `/[slug]` | `reference/Sitter profile.dc.html` |
| `/dashboard` | `reference/Dashboard.dc.html` |
| `/owner/dashboard` | `reference/Owner dashboard.dc.html` |
| `/login`, `/signup` | `reference/Log in.dc.html`, `reference/Sign up.dc.html` |
| `/messages`, `/messages/[id]` | `reference/Messages.dc.html` |
| `/owner/listings/new` | `reference/Post a sit.dc.html` |
| `/owner/listings/[id]/edit` | `reference/Edit listing.dc.html` |
| `/profile/create`, `/profile/edit` | `reference/Create profile.dc.html`, `reference/Edit profile.dc.html` |
| `/review/[token]` | `reference/Leave a review.dc.html` |
| Applications, Saved sits, Notifications, Verification, Availability, Confirmed sit, Find a sitter, Create/Edit owner profile | same-named files in `reference/` |
| Brand & social kits (not routes) | `MYAH Brand Kit.dc.html`, `MYAH Social Kit.dc.html` |

## 11. Definition of done

- [ ] Every colour in `src/` appears in §1. No `#6d3f9e`, no gold, no Tailwind default greys.
- [ ] Every CTA is the §4 pill, including hover/active transforms and shadows.
- [ ] Header scroll state, loader, hero slideshow and drawer behave exactly as §8, including the logo file swap.
- [ ] Fonts: Marcellus for headings only, Montserrat for UI/body, Lato for labels/meta. No Inter, no system-ui fallback rendering.
- [ ] Logo files byte-identical to `brand/`; favicon, apple-touch-icon and OG image wired.
- [ ] Type sizes match §2 exactly, including `.5rem` tagline and `3.5rem` hero.
- [ ] `@media (max-width:1000px)` is the only breakpoint.
- [ ] Side-by-side check: open each reference file in a browser next to the built route at 1440px wide. Differences in spacing, radius, weight or colour are bugs, not choices.
