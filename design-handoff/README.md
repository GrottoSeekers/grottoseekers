# MYAH rebrand — start here

**Nothing in this package has reached the repo yet.** The live site at myahsits.com
still shows the pre-rebrand layouts; only `global.css` colour variables changed, and
even those were re-derived (tan is `#8a6a4f`, should be `#6e5438`). Claude Code has
never read these specs — the folder has to be inside the repo first.

Read **`START-HERE-CLAUDE-CODE.md`** first. Then `IMPLEMENTATION.md`, then `BUILD-ORDER.md`.

## Contents

- **`START-HERE-CLAUDE-CODE.md`** — the rules and the build loop. One page per commit.
- **`verify.mjs`** — run `node design-handoff/verify.mjs Home` from the repo root. Extracts every design value from the reference file and lists the ones missing from the route. A page is not done until it says PASS.

## Contents

- **`BUILD-ORDER.md`** — the work order: 23 pages, one at a time, with per-page acceptance criteria. Follow it top to bottom.
- **`screens/*.md`** — one element-by-element spec per page: every node in order, its verbatim inline style, its hover/active states, its text, its images, and the page's behaviour script. 23 files.
- **`IMPLEMENTATION.md`** — the shared system: tokens, type scale, the single button style, cards, layout, breakpoint, and the four behaviours (loader, header scroll state, hero slideshow, mobile drawer).
- **`REBRAND.md`** — brand rules: logo usage, palette meaning, voice, social and print specs.
- **`reference/`** — the 25 approved designs as self-contained HTML with inline styles. **Source of truth.** Open in a browser to compare.
- **`brand/`** — final logo assets. Copy into `public/images/` unchanged.

## Prompt to run in Claude Code

> Read `IMPLEMENTATION.md`, then `BUILD-ORDER.md`. You are rebuilding this repo's pages to match the approved design in `reference/` exactly — not recolouring them.
>
> Work one page at a time in the order given in `BUILD-ORDER.md`. For each page: read its `screens/<Page>.md` spec, open `reference/<Page>.dc.html`, and rebuild that route's markup node for node with the exact values in the spec — hex codes, rgba alphas, rem font sizes, letter-spacing, padding, gaps, border-radius, box-shadows, transitions, and the hover/active states. Keep the repo's data fetching and props; replace the presentation entirely. Keep the `data-*` hooks where the spec shows them, and port the behaviour script at the bottom of each spec verbatim.
>
> Do not round values. Do not substitute a Tailwind scale, a component library, or your own spacing rhythm. Do not add sections, copy, icons or imagery that are not in the spec. Do not simplify a layout because it looks repetitive.
>
> After each page, render it at 1440px, compare against the reference file side by side, fix the differences, then report: sections matched, values you could not match and why. Do not start the next page until that page matches.
>
> Finally copy `brand/*` into `public/images/` without re-exporting or optimising them, wire the favicon, apple-touch-icon and OG image, and run the checklist in §11 of `IMPLEMENTATION.md`.

## Why the last pass failed — check each of these

1. **A global colour sweep instead of a rebuild.** Structure, spacing and type carry this design as much as the palette. Every page needs its markup rebuilt from its spec.
2. Values re-derived rather than copied — `padding:16px 36px` became `px-8 py-4`, `border-radius:50px` became `rounded-full`, `1.08rem` became `text-lg`.
3. Hover/active states dropped — the pill lifts `translateY(-2px)` and changes shadow; text CTAs change colour *and* border colour.
4. The header scroll state missed, including the logo file swap (`logo-mark-white.png` ↔ `logo-mark.png` at `scrollY > 60`).
5. The wordmark's `.28em` tracking or the `.5rem` tagline altered.
6. Old palette values left in unvisited files — grep for `6d3f9e`, `gold`, and any hex not listed in §1 of `IMPLEMENTATION.md`.
7. The logo re-traced, converted to SVG or re-exported. It must stay the supplied PNG artwork, unaltered in shape and outline.
