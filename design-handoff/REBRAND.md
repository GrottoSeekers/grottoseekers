# MYAH rebrand — implementation brief for Claude Code

Repo: `GrottoSeekers/grottoseekers` · branch `main` (Astro)

This package contains the **final** MYAH logo and the full brand kit. Ship the assets and tokens below; do not redraw, recolour outside this list, or "improve" the mark.

---

## 1. Logo — hard rules

The finalised mark is a paw print with a keyhole cut through the pad and a globe inside it, drawn two-tone (dark outline `#392711`, mid fill `#584938`).

**Do not alter the artwork.** No shape edits, no outline weight changes, no redraw as SVG paths, no tracing, no flattening to one colour, no added effects. `brand/logo-mark-original.png` is the untouched master; every other file is the same artwork recoloured or placed on a container.

| File | Use |
| --- | --- |
| `logo-mark.png` | Primary. Bare mark, transparent, as drawn. Cream/white/light backgrounds. |
| `logo-mark-original.png` | Untouched master. Keep in repo, never render. |
| `logo-mark-cream.png` | On forest and on dark photography. |
| `logo-mark-white.png` | Over imagery and video only. |
| `logo-mark-ink.png` | One-colour print, PDFs, invoices, stamps. |
| `logo-mark-forest.png` | Partner and co-branded lockups. |
| `logo-tile.png` | App icon — forest squircle, 22% radius. |
| `logo-tile-cream.png` | App icon alternate for dark OS themes. |
| `avatar-forest.png` / `avatar-cream.png` | Social avatars, 1:1. |
| `app-tile.png` | Store listing tile. |
| `favicon.png` | 256px, browser tab. |

Rules: single mark per surface · clearspace = 25% of mark height on all sides · minimum 32px on screen / 12mm print (below 32px use `logo-tile.png`) · never stretched, rotated, cropped, shadowed, or off-palette.

### Where it goes

Copy the contents of `brand/` into `public/images/` (overwriting the existing logo files of the same name), then:

1. `src/components/LoadingOverlay.astro` — spinner mark → `/images/logo-mark.png`.
2. `src/layouts/BaseLayout.astro` — header lockup mark; favicon link → `/images/favicon.png`; `apple-touch-icon` → `/images/app-tile.png`; OG image → `/images/logo-tile.png`.
3. Footer lockups (dark ground) → `/images/logo-mark-cream.png`.
4. Header over hero imagery (homepage, sitter profile) → `/images/logo-mark-white.png`, swapping to `/images/logo-mark.png` once the header goes solid on scroll (this behaviour already exists — only the file names change).
5. Delete any remaining `*.svg` logo files and purple-era assets (`app-tile-purple.png`, `avatar-purple.png` are now forest duplicates — remove the names once references are gone).

---

## 2. Colour tokens

Add to `src/styles/global.css`:

```css
:root {
  --myah-forest: #2f5d45; /* actions, links, active states, tiles */
  --myah-bark:   #4a3726; /* logo ink, heavy rules */
  --myah-ink:    #2c1a0e; /* headings and body text */
  --myah-cream:  #e9e0d2; /* marks on dark, cards on forest */
  --myah-paper:  #faf6ee; /* page background */
  --myah-tan:    #8a6a4f; /* labels, captions, meta */
  --myah-clay:   #a4442e; /* errors and destructive only */
}
```

Logo artwork tones (reference only — never re-apply by hand): outline `#392711`, fill `#584938`.

Usage split: ~60% paper, 25% ink/bark, 10% forest, 5% everything else. Forest only ever means "do something" — no decorative forest fills. Tan is for labels and captions at 13px+, never body copy.

Approved pairings (contrast): ink on paper 14.6:1 · bark on paper 8.9:1 · forest on paper 6.4:1 · cream on forest 5.9:1 · paper on ink 14.6:1 · cream on bark 8.3:1.

Remove every remaining gold and purple value (`#6d3f9e`, old gold buttons) — all primary buttons are solid forest pills with white label.

---

## 3. Typography

```
Marcellus      — display: h1/h2, section titles. Sentence case, tracking 0, never below 20px.
Montserrat     — UI + body + wordmark. Weights 400 / 500 / 600 only.
Lato           — labels, captions, meta. 700 for uppercase labels.
```

Google Fonts: `family=Marcellus&family=Montserrat:wght@400;500;600&family=Lato:wght@400;700`.

Scale: display 44/1.15 Marcellus · section 28/1.25 Marcellus · wordmark Montserrat 500 with `letter-spacing:.28em` uppercase (fixed — never re-spaced) · body Montserrat 400 16/1.8 · button Montserrat 600 15 · label Lato 700 11 uppercase `.2em` · meta Lato 400 13.

Wordmark lockup: mark, 1px vertical rule, then `MYAH` over the tagline `MAKE YOURSELF AT HOME` (Lato 700, `.22em`, tan on light / cream at 85% on dark).

---

## 4. Voice

Plain, not breezy · specific over warm · owner first. No exclamation marks, no puns on the mark.

| Say | Not |
| --- | --- |
| Ten nights in Stoke Newington, one cockapoo. | An amazing opportunity in vibrant North London! |
| Callum has completed 14 sits. ID and address verified. | Callum is a superstar sitter with 5-star paw-ratings. |
| We could not verify this address. Here is what to send. | Oops! Something went wrong. |
| No sits in Bristol this week. Try within 25 miles. | Sorry, no results found! |

---

## 5. Social & comms specs

- Photo post 1080×1080 — white mark top-left, copy bottom-left over a bottom-up dark gradient, forest pill CTA.
- Quote card 1080×1080 — forest ground, cream mark top-left, Marcellus quote, Lato attribution, wordmark bottom.
- Listing card 1080×1080 — paper ground, mark + wordmark top-left, "New sit" outline pill, photo, Marcellus title, Lato meta line.
- Story 1080×1920 — full-bleed photo, dark gradient both ends, centred mark and copy inside the middle 80%.
- Covers — 1640×624 (Facebook), 1584×396 (LinkedIn), 1500×500 (X), 2048×1152 (YouTube). Lockup inside the left third.
- Email — 600px single column, forest bar with cream mark, 64px PNG mark (no SVG in email), paper footer with tagline.
- Signature — cream avatar only, no logo, plain text.
- Print — business card 85×55mm (forest front, paper back), die-cut circular sticker, ink ring stamp, bark key tag.

---

## 6. Acceptance checklist

- [ ] No `.svg` logo, no purple/gold values anywhere in `src/` or `public/`.
- [ ] Favicon, apple-touch-icon, OG image, manifest icons all point at the new files.
- [ ] Mark never rendered below 32px bare; tile used instead.
- [ ] Clearspace respected in header, footer, loading overlay, email template.
- [ ] Logo files byte-identical to `brand/` — no re-export, no optimisation pass that resamples the artwork.
- [ ] Buttons: solid forest pill, white label, on every screen.

Reference build: the 26 screens in this project (`Home.dc.html`, `Browse sits.dc.html`, …) and `MYAH Brand Kit.dc.html` for the full kit.
