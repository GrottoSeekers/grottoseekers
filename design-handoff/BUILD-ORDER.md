# Build order — one page at a time

Do not attempt a global find-and-replace pass. A colours-only sweep is what failed last time: the pages must be **rebuilt structurally** to match the reference, section by section.

For each page below, in this order:

1. Open `screens/<Page>.md` — the element-by-element spec (every node, every verbatim style string, hover/active states, text content, image list).
2. Open `reference/<Page>.dc.html` beside it — the actual rendered design.
3. Rebuild the route's markup to match the spec's node order and values. Keep the repo's data fetching and props; replace the presentation entirely.
4. Render the route at 1440px and compare against the reference file open in another tab. Fix differences until they are indistinguishable.
5. Commit with the page name, and report: nodes matched, values you could not match, and why.

Only move to the next page when step 4 passes.

| # | Page | Route | Spec | Notes |
| --- | --- | --- | --- | --- |
| 1 | Home | `/` | `screens/Home.md` | Sets every shared part: header, scroll state, hero slideshow, loader, footer, drawer. Get this exactly right first — the rest reuses it. |
| 2 | Log in | `/login` | `screens/Log in.md` | Establishes the form field style. |
| 3 | Sign up | `/signup` | `screens/Sign up.md` | Same field style, two-role choice. |
| 4 | Browse sits | `/listings` | `screens/Browse sits.md` | Sticky header variant, filter row, sit cards, sort control. |
| 5 | Sit detail | `/listings/[id]` | `screens/Sit detail.md` | Sticky summary sidebar, gallery, owner block. |
| 6 | Sitter profile | `/[slug]` | `screens/Sitter profile.md` | Hero slideshow, about carousel, reviews carousel, gallery, enquiry form. |
| 7 | Dashboard | `/dashboard` | `screens/Dashboard.md` | Tabs, share-link row, page preview, sit lists. |
| 8 | Owner dashboard | `/owner/dashboard` | `screens/Owner dashboard.md` | Mirrors #7 — keep them consistent. |
| 9 | Messages | `/messages`, `/messages/[id]` | `screens/Messages.md` | Two-pane inbox. |
| 10 | Post a sit | `/owner/listings/new` | `screens/Post a sit.md` | Live listing preview panel. |
| 11 | Edit listing | `/owner/listings/[id]/edit` | `screens/Edit listing.md` | Status control, delete confirm. |
| 12 | Create profile | `/profile/create` | `screens/Create profile.md` | Live preview panel. |
| 13 | Edit profile | `/profile/edit` | `screens/Edit profile.md` | |
| 14 | Leave a review | `/review/[token]` | `screens/Leave a review.md` | Form, success and invalid-link states. |
| 15 | Applications | `/applications` | `screens/Applications.md` | Applicant cards with avatar fallback initials. |
| 16 | Saved sits | `/saved` | `screens/Saved sits.md` | |
| 17 | Notifications | `/notifications` | `screens/Notifications.md` | |
| 18 | Verification | `/verification` | `screens/Verification.md` | |
| 19 | Availability | `/availability` | `screens/Availability.md` | Calendar grid. |
| 20 | Confirmed sit | `/sits/[id]` | `screens/Confirmed sit.md` | |
| 21 | Find a sitter | `/find-a-sitter` | `screens/Find a sitter.md` | |
| 22 | Create owner profile | `/owner/profile/create` | `screens/Create owner profile.md` | |
| 23 | Edit owner profile | `/owner/profile/edit` | `screens/Edit owner profile.md` | |

Routes 15–23 may not exist in the repo yet. If a route is missing, create it from the spec rather than skipping it, and say so in your report.

Not routes — reference only: `screens/MYAH Brand Kit.md` and `screens/MYAH Social Kit.md` (brand and social templates).

## How to read a spec file

```
- `<a>` → `Sign up.dc.html`
  - style: `display:inline-flex; ... border-radius:50px; padding:16px 36px; ...`
  - :hover `background:#3e7a5b; border-color:#3e7a5b; transform:translateY(-2px); ...`
  - text: "Sign up for free today"
```

That is one element: an anchor, with those exact declarations, that hover rule as a CSS `:hover`, and that link text. Indentation is DOM nesting. `[data-…]` markers are hooks the behaviour script uses — keep them on the same elements.

## Per-page acceptance

- [ ] Same sections, in the same order, with the same number of children.
- [ ] Every style declaration from the spec present and unmodified — no rounding, no Tailwind substitution, no unit changes.
- [ ] Hover and active states implemented for every element that has them.
- [ ] Copy matches the spec's `text:` lines (real content, not lorem, not paraphrase).
- [ ] Images point at the same files under `/images/`.
- [ ] Shared header, footer, loader and drawer identical to page 1.
- [ ] Nothing added that is not in the spec.
