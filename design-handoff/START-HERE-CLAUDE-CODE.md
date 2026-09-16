# START HERE — read this before touching any file

## What happened

The last pass changed `src/styles/global.css` colour variables and nothing else. The
pages themselves are still the pre-rebrand layouts. Some values were also re-derived
instead of copied — e.g. the tan is `#8a6a4f` in `global.css` but the approved design
uses `#6e5438` everywhere.

This is not a recolouring job. Every page's markup must be rebuilt to match its
reference file.

## The loop — do this and nothing else

```
node design-handoff/verify.mjs Home        # see what's missing
# rebuild src/pages/index.astro from design-handoff/screens/Home.md
node design-handoff/verify.mjs Home        # repeat until PASS
git commit -m "rebuild Home to match design"
```

Then the next page in `BUILD-ORDER.md`. **One page per commit.** Do not start a page
until the previous one reports PASS.

## Rules

1. `reference/<Page>.dc.html` is the source of truth. Open it in a browser next to
   your build at 1440px wide.
2. `screens/<Page>.md` lists every node in order with its verbatim inline style.
   Copy those strings. Do not round, re-derive, or re-scale them.
3. No Tailwind classes, no component library, no your-own spacing rhythm.
   `padding:16px 36px` stays `padding:16px 36px` — not `px-8 py-4`.
   `border-radius:50px` stays `50px` — not `rounded-full`.
   `font-size:1.08rem` stays `1.08rem` — not `text-lg`.
4. Port hover/active states. The pill lifts `translateY(-2px)` and swaps shadow;
   text CTAs change colour *and* border colour.
5. Port the behaviour script at the bottom of each spec verbatim (loader, header
   scroll state, hero slideshow, mobile drawer). Keep the `data-*` hooks.
6. Keep the repo's data fetching, props and Supabase calls. Replace presentation only.
7. Add nothing that is not in the spec — no extra sections, no emoji icons, no
   "myah.com/yourname" copy, no stat rows.
8. The logo is supplied PNG artwork. Copy `brand/*` into `public/images/` byte for
   byte. Do not re-trace, convert to SVG, re-export, or optimise it.

## First correction to make, before any page

`src/styles/global.css` → `--myah-tan: #6e5438;` (currently `#8a6a4f`).
Then grep the whole repo for `#8a6a4f`, `6d3f9e`, `gold`, `#c9a227`, `#b8860b` and
remove every hit.

## Report format after each page

```
Page: Home
verify.mjs: PASS (0 missing)
Sections matched: 9/9
Could not match: <value> — <why>
```

If `verify.mjs` still fails, say which values are missing and why rather than
declaring the page done.
