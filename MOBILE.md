# Mobile rules — applies to every page

The specs in `screens/` describe the **desktop** layout at 1440px. They are correct
and must not be changed. This file is the missing half: what happens below 1000px.

Apply these to every page as you build it. From now on a page is not done until it
has been checked at 390px wide as well as 1440px.

## Image paths — read this first

Some spec nodes write `src="public/images/…"`. That is an artifact of the design
file. **In the repo the correct path is `/images/…`** — leading slash, no `public`.
The asset list at the top of each spec shows the correct form. A `public/images/…`
src resolves to nothing in production, which silently removes the image.

## Where the breakpoints go

One `@media (max-width: 1000px)` block and one `@media (max-width: 640px)` block in
`src/styles/global.css`, keyed off `data-*` hooks and element selectors. Do not
scatter per-page media queries.

## 1000px and below — layout

- Any two-column `grid-template-columns: minmax(0,1fr) minmax(0,1fr)` collapses to
  `1fr`. On the Home hero the image panel goes **above** the copy, `min-height:60vh`,
  and the copy panel drops its `min-height:100vh` to `auto`.
- Sticky sidebars (Sit detail, Dashboard) become static and full width, below the
  main column.
- `[data-header-nav] { display:none }`, `[data-burger] { display:flex }` — already in
  the spec; keep it.
- Card grids go to two columns; below 640px, one.
- Any fixed `width` on a card or panel becomes `width:100%; max-width:<that value>`.

## 640px and below — spacing and type

The desktop values are roughly 1.6× what a phone should show. Scale, don't guess:

| Desktop value | Phone value |
|---|---|
| section `padding: 120px 64px` | `64px 20px` |
| section `padding: 96px 64px` | `56px 20px` |
| card `padding: 36px` | `24px` |
| `gap: 64px` | `32px` |
| `gap: 36px` | `20px` |
| `gap: 24px` | `16px` |

Type — replace the fixed `rem` with these exact `clamp()` values, so it scales
smoothly instead of stepping:

| Desktop `font-size` | Replace with |
|---|---|
| `4.2rem` (hero H1) | `clamp(2.4rem, 8vw, 4.2rem)` |
| `3.2rem` | `clamp(2rem, 6.5vw, 3.2rem)` |
| `2.4rem` | `clamp(1.7rem, 5vw, 2.4rem)` |
| `1.8rem` | `clamp(1.4rem, 4vw, 1.8rem)` |
| `1.35rem` | `clamp(1.15rem, 3.4vw, 1.35rem)` |
| `1.08rem` (body) | `1rem` |
| anything `≤ .95rem` | leave as is |

`clamp()` keeps the desktop value at the top end, so `verify.mjs` still finds the
original number in the file and VALUES keeps passing.

## Touch targets

Every button, nav item and link in the mobile drawer is **minimum 44px tall**.
Pills that are `padding:16px 36px` on desktop become `padding:14px 28px` on phone —
still above 44px total. Do not shrink below that.

## Horizontal overflow

Nothing may scroll sideways. After each page, check at 390px:
`document.documentElement.scrollWidth <= window.innerWidth`.
Usual culprits: a fixed-width card, a long unbroken string, a negative margin, or
a `100vw` element inside a padded parent.

## Images

Every `<img>` gets `max-width:100%`. Hero and gallery images keep `object-fit:cover`.
The Home hero slideshow runs on phone exactly as on desktop — all nine images, same
4.5s interval, same 1.2s crossfade. Do not disable it on mobile.
