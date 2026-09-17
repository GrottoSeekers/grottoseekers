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
node design-handoff/verify.mjs Home        # repeat until all checks PASS
git commit -m "rebuild Home to match design"
```

There are three checks per page. All three must pass:

- **VALUES** — every hex, rgba, rem, padding, radius and shadow in the design is present.
- **COPY** — every line of approved copy is present.
- **EXTRAS** — no copy in the repo that the design does not contain. This is the one
  that catches a half-rebuild: if the old "Everything you need in one place" or
  "Up and running in minutes" sections are still there, EXTRAS fails.

VALUES passing on its own means almost nothing — the old markup can contain the
right colours in the wrong layout. Do not report a page as done on VALUES alone.

Then the next page in `BUILD-ORDER.md`. **One page per commit.** Do not start a page
until the previous one passes all three.

## Never edit the reference

`reference/*.dc.html` is the approved design. If a check seems to contradict it,
**the check is wrong** — say so in your report and leave both files alone. Do not
edit a reference file, a spec, or `verify.mjs` to make a page pass.

## Rules

1. `reference/<Page>.dc.html` is the source of truth. Open it in a browser next to
   your build at 1440px wide.
2. `screens/<Page>.md` lists every node in order with its verbatim inline style.
   Copy those strings. Do not round, re-derive, or re-scale them.
3. **`MOBILE.md` is part of every page.** The specs describe desktop at 1440px; that
   file says what happens below 1000px. A page is not done until it has been checked
   at 390px wide as well. It also explains the `public/images/` vs `/images/` path
   trap — read it before your first page.
4. No Tailwind classes, no component library, no your-own spacing rhythm.
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

`#8a6a4f` is still a legitimate colour — it is the design's *lighter* tan and the
specs use it for small meta text. Only the `--myah-tan` variable was wrong. Use
whichever of the two the spec shows on each element.

Then grep the repo for `6d3f9e`, `gold`, `#c9a227`, `#b8860b`, `#d4af37` and remove
every hit.

## Report format after each page

```
Page: Home
VALUES: PASS   COPY: PASS   EXTRAS: PASS
Sections matched: 9/9
Could not match: <value> — <why>
```

If any check still fails, say which values or lines are missing and why rather than
declaring the page done.
