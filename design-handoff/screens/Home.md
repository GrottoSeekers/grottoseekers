# Home — element-by-element spec

Generated from the approved design file `reference/Home.dc.html`. Every style string below is the verbatim inline style on that element. Build the page node for node, in this order, with these values. `:hover` / `:active` lines are real states — implement them as CSS rules.

## Images used

- `/images/logo-mark.png`
- `/images/logo-mark-white.png`
- `/images/slideshow-cockapoo-window.jpeg`
- `/images/slideshow-dogs-couch.jpeg`
- `/images/slideshow-labrador-puppy.jpeg`
- `/images/slideshow-spaniel-walk.jpeg`
- `/images/slideshow-springer-beach.jpeg`
- `/images/slideshow-cat-bag.jpeg`
- `/images/slideshow-living-room.jpeg`
- `/images/slideshow-ocean-sunset.jpeg`
- `/images/slideshow-spaniel-bed.jpeg`
- `/images/couple-boat-1.jpg`
- `/images/alfie-1.jpg`
- `/images/callum-niamh-event.jpg`
- `/images/solomon-2.jpg`
- `/images/bailey-1.jpg`
- `/images/couple-dinner-1.jpg`
- `/images/travis-1.jpg`
- `/images/chester-1.jpg`
- `/images/solomon-1.jpg`
- `/images/zeus-1.jpg`
- `/images/solomon-4.jpg`
- `/images/orca-3.jpg`
- `/images/bailey-3.jpg`
- `/images/callum-niamh-airport.jpg`
- `/images/logo-mark-cream.png`

## Structure

- `<div>`
  - `<div>`
    - style: `background:#faf6ee`
    - `<div>` `[data-loader]`
      - style: `position:fixed; inset:0; z-index:9999; background:rgba(250,246,238,.92); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .25s ease`
      - `<div>`
        - style: `position:relative; width:132px; height:132px; display:flex; align-items:center; justify-content:center`
        - `<div>`
          - style: `position:absolute; inset:0; border-radius:50%; border:3px solid rgba(110,84,56,.18)`
        - `<div>`
          - style: `position:absolute; inset:0; border-radius:50%; border:3px solid transparent; animation:gs-ring 1s linear infinite`
        - `<img>` src=`public/images/logo-mark.png`
          - style: `width:74px; height:74px; object-fit:contain; animation:gs-pulse 1.8s ease-in-out infinite`
    - `<header>` **Header** `[data-site-header]`
      - style: `position:fixed; top:0; left:0; right:0; z-index:210; padding:20px 48px; display:flex; justify-content:space-between; align-items:center; gap:40px; transition:background .3s, box-shadow .3s, padding .3s`
      - `<a>` `[data-nav-logo]` → `Home.dc.html`
        - style: `font-family:'Montserrat',sans-serif; font-weight:500; font-size:1.4rem; color:#fff; white-space:nowrap; display:inline-flex; align-items:center; gap:14px; line-height:1; letter-spacing:.28em`
        - `<img>` `[data-logo-img]` src=`public/images/logo-mark-white.png`
          - style: `height:46px; width:46px; display:block; object-fit:contain`
        - `<span>`
          - style: `display:flex; flex-direction:column; gap:5px; border-left:1px solid rgba(110,84,56,.4)`
          - `<span>` `[data-logo-word]`
            - style: `color:#e9e0d2; line-height:1`
            - text: "MYAH"
          - `<span>` `[data-logo-tag]`
            - style: `font-family:'Lato',sans-serif; font-weight:700; font-size:.5rem; letter-spacing:.2em; text-transform:uppercase; color:rgba(255,255,255,.82); line-height:1; text-shadow:0 1px 8px rgba(44,26,14,.55)`
            - text: "Make Yourself At Home"
      - `<nav>` `[data-header-nav]`
        - style: `display:flex; align-items:center; gap:32px`
        - `<a>` `[data-nav-link]` → `#how-it-works`
          - style: `font-size:.82rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#fff; transition:color .2s; text-shadow:0 1px 8px rgba(44,26,14,.55); white-space:nowrap`
          - text: "How it works"
        - `<a>` `[data-nav-link]` → `#example`
          - style: `font-size:.82rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#fff; transition:color .2s; text-shadow:0 1px 8px rgba(44,26,14,.55); white-space:nowrap`
          - text: "See an example"
        - `<a>` `[data-nav-link]` → `Browse sits.dc.html`
          - style: `font-size:.82rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#fff; transition:color .2s; text-shadow:0 1px 8px rgba(44,26,14,.55); white-space:nowrap`
          - text: "Browse sits"
        - `<a>` `[data-nav-link]` → `Log in.dc.html`
          - style: `font-size:.82rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#fff; transition:color .2s; text-shadow:0 1px 8px rgba(44,26,14,.55); white-space:nowrap`
          - text: "Log in"
        - `<a>` → `Sign up.dc.html`
          - style: `display:inline-flex; align-items:center; justify-content:center; gap:8px; font-size:.78rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#fff; background:#2f5d45; border:1.5px solid #2f5d45; border-radius:50px; padding:13px 28px; box-shadow:0 4px 14px rgba(44,26,14,.18); white-space:nowrap; transition:background .2s, border-color .2s, transform .12s`
          - :hover `background:#3e7a5b;border-color:#3e7a5b;transform:translateY(-2px);box-shadow:0 12px 28px rgba(110,84,56,.36)`
          - :active `transform:translateY(0) scale(.98)`
          - text: "Get started"
      - `<button>` `[data-burger]`
        - style: `display:none; background:none; border:none; flex-direction:column; gap:5px; padding:4px; z-index:215`
        - `<span>` `[data-burger-bar]`
          - style: `display:block; width:24px; height:2px; background:#fff; border-radius:2px; transition:background .3s`
        - `<span>` `[data-burger-bar]`
          - style: `display:block; width:24px; height:2px; background:#fff; border-radius:2px; transition:background .3s`
        - `<span>` `[data-burger-bar]`
          - style: `display:block; width:24px; height:2px; background:#fff; border-radius:2px; transition:background .3s`
    - `<div>` `[data-mm-overlay]`
      - style: `position:fixed; inset:0; z-index:190; background:rgba(0,0,0,.45); opacity:0; transition:opacity .3s ease, visibility .3s ease`
    - `<div>` `[data-mobile-menu]`
      - style: `position:fixed; top:0; right:0; bottom:0; width:320px; max-width:85vw; z-index:200; background:#fff; display:flex; flex-direction:column; transform:translateX(100%); transition:transform .35s cubic-bezier(.4,0,.2,1); box-shadow:-8px 0 40px rgba(0,0,0,.12)`
      - `<div>`
        - style: `display:flex; justify-content:space-between; align-items:center; padding:20px 24px; border-bottom:1px solid rgba(44,26,14,.08)`
        - `<a>` → `Home.dc.html`
          - style: `font-family:'Montserrat',sans-serif; font-weight:500; font-size:1.25rem; color:#2c1a0e; letter-spacing:.28em`
          - text: "MYAH"
        - `<button>` `[data-mm-close]`
          - style: `width:36px; height:36px; border-radius:50%; border:1px solid rgba(44,26,14,.12); background:#fff; display:flex; align-items:center; justify-content:center; color:#2c1a0e`
          - `<svg>`
            - `<path>`
      - `<div>`
        - style: `flex:1; padding:12px 0`
        - `<a>` `[data-mm-item]` → `#how-it-works`
          - style: `display:flex; align-items:center; gap:16px; padding:16px 24px; color:#2c1a0e`
          - `<span>`
            - style: `width:40px; height:40px; border-radius:10px; background:#faf6ee; display:flex; align-items:center; justify-content:center; color:#2f5d45`
            - `<svg>`
              - `<circle>`
              - `<path>`
          - `<span>`
            - style: `flex:1; display:flex; flex-direction:column; gap:2px`
            - `<span>`
              - style: `font-size:.95rem; font-weight:600; color:#2c1a0e`
              - text: "How it works"
            - `<span>`
              - style: `font-size:.78rem; color:#6b4e35`
              - text: "Get started in minutes"
          - `<span>`
            - style: `font-size:1.4rem; color:rgba(44,26,14,.2); font-weight:300`
            - text: "›"
        - `<a>` `[data-mm-item]` → `#example`
          - style: `display:flex; align-items:center; gap:16px; padding:16px 24px; color:#2c1a0e`
          - `<span>`
            - style: `width:40px; height:40px; border-radius:10px; background:#faf6ee; display:flex; align-items:center; justify-content:center; color:#2f5d45`
            - `<svg>`
              - `<rect>`
              - `<circle>`
              - `<path>`
          - `<span>`
            - style: `flex:1; display:flex; flex-direction:column; gap:2px`
            - `<span>`
              - style: `font-size:.95rem; font-weight:600; color:#2c1a0e`
              - text: "See an example"
            - `<span>`
              - style: `font-size:.78rem; color:#6b4e35`
              - text: "View a live profile"
          - `<span>`
            - style: `font-size:1.4rem; color:rgba(44,26,14,.2); font-weight:300`
            - text: "›"
        - `<a>` `[data-mm-item]` → `Browse sits.dc.html`
          - style: `display:flex; align-items:center; gap:16px; padding:16px 24px; color:#2c1a0e`
          - `<span>`
            - style: `width:40px; height:40px; border-radius:10px; background:#faf6ee; display:flex; align-items:center; justify-content:center; color:#2f5d45`
            - `<svg>`
              - `<path>`
              - `<polyline>`
          - `<span>`
            - style: `flex:1; display:flex; flex-direction:column; gap:2px`
            - `<span>`
              - style: `font-size:.95rem; font-weight:600; color:#2c1a0e`
              - text: "Browse sits"
            - `<span>`
              - style: `font-size:.78rem; color:#6b4e35`
              - text: "Find homes that need a sitter"
          - `<span>`
            - style: `font-size:1.4rem; color:rgba(44,26,14,.2); font-weight:300`
            - text: "›"
        - `<div>`
          - style: `height:1px; background:rgba(44,26,14,.08); margin:8px 24px`
        - `<a>` `[data-mm-item]` → `Log in.dc.html`
          - style: `display:flex; align-items:center; gap:16px; padding:16px 24px; color:#2c1a0e`
          - `<span>`
            - style: `width:40px; height:40px; border-radius:10px; background:#faf6ee; display:flex; align-items:center; justify-content:center; color:#2f5d45`
            - `<svg>`
              - `<path>`
              - `<polyline>`
              - `<line>`
          - `<span>`
            - style: `flex:1; display:flex; flex-direction:column; gap:2px`
            - `<span>`
              - style: `font-size:.95rem; font-weight:600; color:#2c1a0e`
              - text: "Log in"
            - `<span>`
              - style: `font-size:.78rem; color:#6b4e35`
              - text: "Access your dashboard"
          - `<span>`
            - style: `font-size:1.4rem; color:rgba(44,26,14,.2); font-weight:300`
            - text: "›"
      - `<div>`
        - style: `padding:20px 24px; border-top:1px solid rgba(44,26,14,.08)`
        - `<a>` `[data-mm-item]` → `Sign up.dc.html`
          - style: `display:inline-flex; align-items:center; justify-content:center; gap:8px; font-size:.76rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#fff; background:#2f5d45; border:1.5px solid #2f5d45; border-radius:50px; padding:13px 24px; white-space:nowrap; box-shadow:0 6px 20px rgba(110,84,56,.28); transition:background .2s, border-color .2s, transform .12s; width:100%`
          - :hover `background:#3e7a5b;border-color:#3e7a5b;transform:translateY(-2px);box-shadow:0 12px 28px rgba(110,84,56,.36)`
          - :active `transform:translateY(0) scale(.98)`
          - text: "Sign up for free"
    - `<section>` **Hero**
      - style: `min-height:100vh; display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); position:relative; overflow:hidden`
      - `<div>`
        - style: `grid-column:1; position:relative; min-height:100vh; overflow:hidden; background:#2c1a0e`
        - `<img>` `[data-hero-slide]` src=`public/images/slideshow-cockapoo-window.jpeg`
          - style: `position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center 30%; opacity:1; transition:opacity 1.2s ease-in-out`
        - `<img>` `[data-hero-slide]` src=`public/images/slideshow-dogs-couch.jpeg`
          - style: `position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center 30%; opacity:0; transition:opacity 1.2s ease-in-out`
        - `<img>` `[data-hero-slide]` src=`public/images/slideshow-labrador-puppy.jpeg`
          - style: `position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center 30%; opacity:0; transition:opacity 1.2s ease-in-out`
        - `<img>` `[data-hero-slide]` src=`public/images/slideshow-spaniel-walk.jpeg`
          - style: `position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center 30%; opacity:0; transition:opacity 1.2s ease-in-out`
        - `<img>` `[data-hero-slide]` src=`public/images/slideshow-springer-beach.jpeg`
          - style: `position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center 30%; opacity:0; transition:opacity 1.2s ease-in-out`
        - `<img>` `[data-hero-slide]` src=`public/images/slideshow-cat-bag.jpeg`
          - style: `position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center 30%; opacity:0; transition:opacity 1.2s ease-in-out`
        - `<img>` `[data-hero-slide]` src=`public/images/slideshow-living-room.jpeg`
          - style: `position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center 30%; opacity:0; transition:opacity 1.2s ease-in-out`
        - `<img>` `[data-hero-slide]` src=`public/images/slideshow-ocean-sunset.jpeg`
          - style: `position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center 30%; opacity:0; transition:opacity 1.2s ease-in-out`
        - `<img>` `[data-hero-slide]` src=`public/images/slideshow-spaniel-bed.jpeg`
          - style: `position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center 30%; opacity:0; transition:opacity 1.2s ease-in-out`
        - `<div>`
          - style: `position:absolute; inset:0; background:linear-gradient(to right, rgba(44,26,14,.35) 0%, rgba(44,26,14,0) 60%), linear-gradient(to top, rgba(44,26,14,.5) 0%, transparent 40%)`
      - `<div>`
        - style: `grid-column:2; display:flex; flex-direction:column; justify-content:center; padding:150px 64px 90px 60px; background:#faf6ee`
        - `<p>`
          - style: `font-size:.75rem; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#6e5438; margin:0 0 24px; display:flex; align-items:center; gap:12px`
          - text: "For sitters & home owners"
          - `<span>`
            - style: `width:26px; height:1px; background:#6e5438; display:block`
        - `<h1>`
          - style: `font-family:'Marcellus',serif; font-size:3.5rem; color:#2c1a0e; line-height:1.1; margin:0 0 26px; text-wrap:pretty`
          - text: "House & pet sitting"
          - `<br>`
          - `<em>`
            - style: `color:#2f5d45`
            - text: "made simple."
        - `<p>`
          - style: `color:#6b4e35; font-size:1.08rem; line-height:1.8; margin:0 0 32px; max-width:440px`
          - text: "One platform for house & pet sitters and home owners. Create your profile, share your link, and connect — all in one place."
        - `<ul>`
          - style: `list-style:none; padding:0; margin:0 0 36px; display:flex; flex-direction:column; gap:12px`
          - `<li>`
            - style: `font-size:.93rem; color:#2c1a0e; line-height:1.6; position:relative`
            - text: "Your own page at"
            - `<span>`
              - style: `position:absolute; left:0; top:2px; width:18px; height:18px; border-radius:50%; background:#2f5d45; color:#fff; font-size:.62rem; font-weight:600; display:flex; align-items:center; justify-content:center; line-height:1`
              - text: "✓"
            - `<strong>`
              - style: `color:#2f5d45; font-weight:600`
              - text: "myahsits.com/yourname"
          - `<li>`
            - style: `font-size:.93rem; color:#2c1a0e; line-height:1.6; position:relative`
            - text: "Free to join, live in five minutes"
            - `<span>`
              - style: `position:absolute; left:0; top:2px; width:18px; height:18px; border-radius:50%; background:#2f5d45; color:#fff; font-size:.62rem; font-weight:600; display:flex; align-items:center; justify-content:center; line-height:1`
              - text: "✓"
        - `<div>`
          - style: `display:flex; align-items:center; gap:20px`
          - `<a>` → `Sign up.dc.html`
            - style: `display:inline-flex; align-items:center; justify-content:center; gap:8px; font-size:.82rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#fff; background:#2f5d45; border:1.5px solid #2f5d45; border-radius:50px; padding:16px 36px; white-space:nowrap; box-shadow:0 6px 20px rgba(110,84,56,.28); transition:background .2s, border-color .2s, transform .12s`
            - :hover `background:#3e7a5b;border-color:#3e7a5b;transform:translateY(-2px);box-shadow:0 12px 28px rgba(110,84,56,.36)`
            - :active `transform:translateY(0) scale(.98)`
            - text: "Sign up for free today"
          - `<a>` → `#example`
            - style: `display:inline-flex; align-items:center; gap:9px; font-size:.8rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#5c3d20; border-bottom:1px solid rgba(110,84,56,.5); transition:color .2s, border-color .2s`
            - :hover `color:#2f5d45;border-color:#2f5d45`
            - text: "See an example →"
    - `<section>` **Sitters & owners**
      - style: `padding:100px 0; background:#fff`
      - `<div>`
        - style: `max-width:1100px; margin:0 auto; padding:0 48px`
        - `<div>`
          - style: `display:flex; flex-direction:column; align-items:center; text-align:center`
          - `<p>`
            - style: `font-size:.75rem; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#6e5438; margin:0 0 14px; display:block`
            - text: "Two sides, one platform"
          - `<h2>`
            - style: `font-family:'Marcellus',serif; font-size:2.8rem; color:#2c1a0e; line-height:1.2; margin:0`
            - text: "Built for sitters owners"
            - `<em>`
              - style: `color:#2f5d45`
              - text: "&"
          - `<div>`
            - style: `width:48px; height:2px; background:#6e5438; margin:22px 0 0`
          - `<p>`
            - style: `color:#6b4e35; font-size:1rem; line-height:1.75; max-width:520px; margin:22px 0 0`
            - text: "Whichever side you're on, everything lives on one page — and takes minutes to set up."
        - `<div>`
          - style: `display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); gap:32px`
          - `<div>`
            - style: `background:#faf6ee; border-radius:20px; padding:44px 40px; display:flex; flex-direction:column; gap:18px; border:1px solid rgba(110,84,56,.22); box-shadow:0 1px 2px rgba(44,26,14,.04); transition:transform .3s ease, box-shadow .3s ease`
            - :hover `transform:translateY(-6px);box-shadow:0 20px 50px rgba(44,26,14,.1)`
            - `<div>`
              - style: `width:60px; height:60px; border-radius:16px; background:linear-gradient(135deg,#2f5d45 0%,#3e7a5b 100%); color:#fff; display:flex; align-items:center; justify-content:center; box-shadow:0 10px 24px rgba(110,84,56,.3)`
              - `<svg>`
            - `<h3>`
              - style: `font-family:'Marcellus',serif; font-size:1.7rem; color:#2c1a0e; margin:0; line-height:1.2`
              - text: "For sitters"
            - `<p>`
              - style: `color:#6b4e35; font-size:.95rem; line-height:1.7; margin:0`
              - text: "Showcase everything that makes you a great sitter — in one beautiful, shareable page."
            - `<ul>`
              - style: `list-style:none; display:flex; flex-direction:column; gap:12px; padding:16px 0; margin:0; border-top:1px solid rgba(44,26,14,.08)`
              - `<li>`
                - style: `font-size:.9rem; color:#2c1a0e; line-height:1.6; position:relative`
                - text: "Create a stunning profile with your bio, photos & experience"
              - `<li>`
                - style: `font-size:.9rem; color:#2c1a0e; line-height:1.6; position:relative`
                - text: "Collect and display five-star reviews from owners"
              - `<li>`
                - style: `font-size:.9rem; color:#2c1a0e; line-height:1.6; position:relative`
                - text: "Share one link —"
              - `<li>`
                - style: `font-size:.9rem; color:#2c1a0e; line-height:1.6; position:relative`
                - text: "Get enquiries straight to your inbox or WhatsApp"
              - `<li>`
                - style: `font-size:.9rem; color:#2c1a0e; line-height:1.6; position:relative`
                - text: "Browse available sits and apply directly"
            - `<a>` → `Sign up.dc.html`
              - style: `display:inline-flex; align-items:center; gap:8px; font-size:.8rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#2f5d45; border:1.5px solid rgba(110,84,56,.45); border-radius:50px; padding:13px 28px; transition:background .2s, color .2s, border-color .2s`
              - :hover `background:#3e7a5b;border-color:#3e7a5b;transform:translateY(-2px);box-shadow:0 12px 28px rgba(110,84,56,.36)`
              - :active `transform:translateY(0) scale(.98)`
              - text: "Get started as a sitter →"
          - `<div>`
            - style: `background:#faf6ee; border-radius:20px; padding:44px 40px; display:flex; flex-direction:column; gap:18px; border:1px solid rgba(110,84,56,.22); box-shadow:0 1px 2px rgba(44,26,14,.04); transition:transform .3s ease, box-shadow .3s ease`
            - :hover `transform:translateY(-6px);box-shadow:0 20px 50px rgba(44,26,14,.1)`
            - `<div>`
              - style: `width:60px; height:60px; border-radius:16px; background:linear-gradient(135deg,#2f5d45 0%,#3e7a5b 100%); color:#fff; display:flex; align-items:center; justify-content:center; box-shadow:0 10px 24px rgba(110,84,56,.3)`
              - `<svg>`
            - `<h3>`
              - style: `font-family:'Marcellus',serif; font-size:1.7rem; color:#2c1a0e; margin:0; line-height:1.2`
              - text: "For owners"
            - `<p>`
              - style: `color:#6b4e35; font-size:.95rem; line-height:1.7; margin:0`
              - text: "List your home and pets so trusted sitters can find you — and you can find them."
            - `<ul>`
              - style: `list-style:none; display:flex; flex-direction:column; gap:12px; padding:16px 0; margin:0; border-top:1px solid rgba(44,26,14,.08)`
              - `<li>`
                - style: `font-size:.9rem; color:#2c1a0e; line-height:1.6; position:relative`
                - text: "Create a profile for your home with photos & details"
              - `<li>`
                - style: `font-size:.9rem; color:#2c1a0e; line-height:1.6; position:relative`
                - text: "Add your pets — breed, temperament & special needs"
              - `<li>`
                - style: `font-size:.9rem; color:#2c1a0e; line-height:1.6; position:relative`
                - text: "Post sit listings with dates you need covered"
              - `<li>`
                - style: `font-size:.9rem; color:#2c1a0e; line-height:1.6; position:relative`
                - text: "Sitters browse & apply — you pick the perfect match"
              - `<li>`
                - style: `font-size:.9rem; color:#2c1a0e; line-height:1.6; position:relative`
                - text: "Receive enquiries via email or WhatsApp"
            - `<a>` → `Sign up.dc.html`
              - style: `display:inline-flex; align-items:center; gap:8px; font-size:.8rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#2f5d45; border:1.5px solid rgba(110,84,56,.45); border-radius:50px; padding:13px 28px; transition:background .2s, color .2s, border-color .2s`
              - :hover `background:#3e7a5b;border-color:#3e7a5b;transform:translateY(-2px);box-shadow:0 12px 28px rgba(110,84,56,.36)`
              - :active `transform:translateY(0) scale(.98)`
              - text: "Get started as an owner →"
    - `<section>` **How it works**
      - style: `padding:100px 0; background:#fff`
      - `<div>`
        - style: `max-width:1100px; margin:0 auto; padding:0 48px`
        - `<div>`
          - style: `display:flex; flex-direction:column; align-items:center; text-align:center`
          - `<p>`
            - style: `font-size:.75rem; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#6e5438; margin:0 0 14px; display:block`
            - text: "Simple & fast"
          - `<h2>`
            - style: `font-family:'Marcellus',serif; font-size:2.8rem; color:#2c1a0e; line-height:1.2; margin:0`
            - text: "Up and running in minutes"
          - `<div>`
            - style: `width:48px; height:2px; background:#6e5438; margin:22px 0 0`
          - `<p>`
            - style: `color:#6b4e35; font-size:1rem; line-height:1.75; max-width:520px; margin:22px 0 0`
            - text: "Three steps between signing up and sharing a page you're proud of."
        - `<div>`
          - style: `position:relative`
          - `<div>`
            - style: `position:absolute; top:0; left:12%; right:12%; height:1px; background:repeating-linear-gradient(to right,rgba(110,84,56,.45) 0 6px,transparent 6px 12px)`
          - `<div>`
            - style: `position:relative; display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:28px`
            - `<div>`
              - style: `position:relative; background:#faf6ee; border:1px solid rgba(110,84,56,.22); border-radius:20px; padding:44px 32px 36px; text-align:center; transition:transform .3s ease, box-shadow .3s ease`
              - :hover `transform:translateY(-6px);box-shadow:0 20px 50px rgba(44,26,14,.1)`
              - `<div>`
                - style: `position:absolute; top:-26px; left:50%; transform:translateX(-50%); width:52px; height:52px; border-radius:50%; background:#fff; border:1.5px solid rgba(110,84,56,.45); display:flex; align-items:center; justify-content:center; font-family:'Marcellus',serif; font-size:1.25rem; color:#6e5438; box-shadow:0 6px 18px rgba(44,26,14,.06)`
                - text: "01"
              - `<h3>`
                - style: `font-family:'Marcellus',serif; font-size:1.35rem; color:#2c1a0e; margin:8px 0 12px`
                - text: "Create an account"
              - `<p>`
                - style: `color:#6b4e35; font-size:.93rem; line-height:1.75; margin:0`
                - text: "Sign up as a house & pet sitter or home owner. Free to join."
            - `<div>`
              - style: `position:relative; background:#faf6ee; border:1px solid rgba(110,84,56,.22); border-radius:20px; padding:44px 32px 36px; text-align:center; transition:transform .3s ease, box-shadow .3s ease`
              - :hover `transform:translateY(-6px);box-shadow:0 20px 50px rgba(44,26,14,.1)`
              - `<div>`
                - style: `position:absolute; top:-26px; left:50%; transform:translateX(-50%); width:52px; height:52px; border-radius:50%; background:#fff; border:1.5px solid rgba(110,84,56,.45); display:flex; align-items:center; justify-content:center; font-family:'Marcellus',serif; font-size:1.25rem; color:#6e5438; box-shadow:0 6px 18px rgba(44,26,14,.06)`
                - text: "02"
              - `<h3>`
                - style: `font-family:'Marcellus',serif; font-size:1.35rem; color:#2c1a0e; margin:8px 0 12px`
                - text: "Build your page"
              - `<p>`
                - style: `color:#6b4e35; font-size:.93rem; line-height:1.75; margin:0`
                - text: "Add your bio, photos, reviews, and everything that makes you stand out."
            - `<div>`
              - style: `position:relative; background:#faf6ee; border:1px solid rgba(110,84,56,.22); border-radius:20px; padding:44px 32px 36px; text-align:center; transition:transform .3s ease, box-shadow .3s ease`
              - :hover `transform:translateY(-6px);box-shadow:0 20px 50px rgba(44,26,14,.1)`
              - `<div>`
                - style: `position:absolute; top:-26px; left:50%; transform:translateX(-50%); width:52px; height:52px; border-radius:50%; background:#fff; border:1.5px solid rgba(110,84,56,.45); display:flex; align-items:center; justify-content:center; font-family:'Marcellus',serif; font-size:1.25rem; color:#6e5438; box-shadow:0 6px 18px rgba(44,26,14,.06)`
                - text: "03"
              - `<h3>`
                - style: `font-family:'Marcellus',serif; font-size:1.35rem; color:#2c1a0e; margin:8px 0 12px`
                - text: "Share your link"
              - `<p>`
                - style: `color:#6b4e35; font-size:.93rem; line-height:1.75; margin:0`
                - text: "Send to connect instantly. That’s it."
    - `<section>` **Live example**
      - style: `padding:100px 0 0; background:#faf6ee`
      - `<div>`
        - style: `max-width:1100px; margin:0 auto; padding:0 48px 60px`
        - `<div>`
          - style: `display:grid; grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr); gap:56px; align-items:end; border-top:1px solid rgba(110,84,56,.3)`
          - `<div>`
            - `<p>`
              - style: `font-size:.75rem; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#6e5438; margin:0 0 18px; display:flex; align-items:center; gap:12px`
              - text: "Our founders"
              - `<span>`
                - style: `width:26px; height:1px; background:#6e5438; display:block`
            - `<h2>`
              - style: `font-family:'Marcellus',serif; font-size:3rem; color:#2c1a0e; line-height:1.1; margin:0`
              - text: "Meet Callum"
              - `<br>`
              - `<em>`
                - style: `color:#2f5d45`
                - text: "& Niamh"
          - `<p>`
            - style: `color:#6b4e35; font-size:1.05rem; line-height:1.8; margin:0 0 6px; border-left:2px solid rgba(110,84,56,.35)`
            - text: "The founders of MYAH — and its very first sitters. Callum & Niamh have cared for homes and animals across the world, and their page shows exactly what yours can…"
      - `<div>`
        - style: `display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); gap:0; max-width:1300px; margin:0 auto; padding:0 48px`
        - `<div>`
          - style: `position:relative; padding:0 48px 0 0`
          - `<div>`
            - style: `display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px`
            - `<img>` src=`public/images/couple-boat-1.jpg`
              - style: `width:100%; height:100%; display:block; border-radius:12px; object-fit:cover; grid-column:span 2; aspect-ratio:1; object-position:center 30%`
            - `<img>` src=`public/images/alfie-1.jpg`
              - style: `width:100%; height:100%; display:block; border-radius:12px; object-fit:cover; aspect-ratio:1; object-position:center 20%`
            - `<img>` src=`public/images/callum-niamh-event.jpg`
              - style: `width:100%; height:100%; display:block; border-radius:12px; object-fit:cover; aspect-ratio:1; object-position:center 15%`
            - `<img>` src=`public/images/solomon-2.jpg`
              - style: `width:100%; height:100%; display:block; border-radius:12px; object-fit:cover; aspect-ratio:1; object-position:center 25%`
            - `<img>` src=`public/images/bailey-1.jpg`
              - style: `width:100%; height:100%; display:block; border-radius:12px; object-fit:cover; aspect-ratio:1; object-position:center 20%`
            - `<img>` src=`public/images/couple-dinner-1.jpg`
              - style: `width:100%; height:100%; display:block; border-radius:12px; object-fit:cover; aspect-ratio:1; object-position:center 25%`
        - `<div>`
          - style: `padding:20px 0 60px 48px; display:flex; flex-direction:column; gap:24px; justify-content:center`
          - `<div>`
            - style: `display:inline-block; background:#e9e0d2; color:#5c3d20; padding:8px 18px; border-radius:50px; font-size:.78rem; font-weight:600; letter-spacing:.08em; text-transform:uppercase; width:fit-content`
            - text: "Experienced sitters worldwide"
          - `<h3>`
            - style: `font-family:'Marcellus',serif; font-size:2rem; color:#2c1a0e; line-height:1.15; margin:0`
            - text: "Callum & Niamh"
          - `<p>`
            - style: `color:#6b4e35; font-size:.95rem; line-height:1.7; margin:0`
            - text: "Experienced house & pet sitters available worldwide — passionate about caring for homes and animals wherever they go."
          - `<blockquote>`
            - style: `border-left:3px solid #2f5d45; margin:0; padding:16px 24px; background:#faf6ee; border-radius:0 8px 8px 0; font-style:italic; color:#6b4e35; font-size:.95rem; line-height:1.75`
            - text: ""We treat every sit like it's our own home — daily walks, feeding routines, garden care, and plenty of love for your animals.""
          - `<div>`
            - style: `display:flex; gap:32px; padding:20px 0; border-top:1px solid rgba(110,84,56,.15); border-bottom:1px solid rgba(110,84,56,.15)`
            - `<div>`
              - style: `display:flex; flex-direction:column; gap:4px`
              - `<span>`
                - style: `font-family:'Marcellus',serif; font-size:1.8rem; color:#6e5438; line-height:1`
                - text: "40+"
              - `<span>`
                - style: `font-size:.75rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#6b4e35`
                - text: "Five-star reviews"
            - `<div>`
              - style: `display:flex; flex-direction:column; gap:4px`
              - `<span>`
                - style: `font-family:'Marcellus',serif; font-size:1.8rem; color:#6e5438; line-height:1`
                - text: "★ 5.0"
              - `<span>`
                - style: `font-size:.75rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#6b4e35`
                - text: "Average rating"
          - `<a>` → `Sitter profile.dc.html`
            - style: `display:inline-flex; align-items:center; justify-content:center; gap:8px; font-size:.82rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#fff; background:#2f5d45; border:1.5px solid #2f5d45; border-radius:50px; padding:16px 36px; white-space:nowrap; box-shadow:0 6px 20px rgba(110,84,56,.28); transition:background .2s, border-color .2s, transform .12s; width:fit-content`
            - :hover `background:#3e7a5b;border-color:#3e7a5b;transform:translateY(-2px);box-shadow:0 12px 28px rgba(110,84,56,.36)`
            - :active `transform:translateY(0) scale(.98)`
            - text: "View full profile →"
      - `<div>`
        - style: `background:#2c1a0e; padding:72px 48px`
        - `<div>`
          - style: `max-width:1100px; margin:0 auto`
          - `<div>`
            - style: `display:flex; align-items:center; gap:16px`
            - `<p>`
              - style: `font-size:.75rem; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#c4ab8a; margin:0`
              - text: "In their own words"
            - `<span>`
              - style: `flex:1; height:1px; background:rgba(196,171,138,.25); display:block`
            - `<p>`
              - style: `font-size:.75rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:rgba(255,255,255,.45); margin:0`
              - text: "40+ five-star reviews"
          - `<div>`
            - style: `display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:24px; align-items:stretch`
            - `<figure>`
              - style: `position:relative; margin:0; padding:34px 32px 30px; background:rgba(255,255,255,.04); border:1px solid rgba(196,171,138,.18); border-radius:16px; display:flex; flex-direction:column; gap:16px; transition:transform .3s ease, background .3s ease, border-color .3s ease`
              - :hover `transform:translateY(-6px);background:rgba(255,255,255,.07);border-color:rgba(196,171,138,.4)`
              - `<span>`
                - style: `position:absolute; top:16px; right:26px; font-family:'Marcellus',serif; font-size:4rem; line-height:1; color:rgba(196,171,138,.18)`
                - text: "”"
              - `<div>`
                - style: `color:#c4ab8a; font-size:.82rem; letter-spacing:.32em`
                - text: "★★★★★"
              - `<blockquote>`
                - style: `margin:0; color:rgba(255,255,255,.88); font-size:.93rem; line-height:1.8; font-style:italic`
                - text: ""Super lovely couple who took great care of our cat Rocco! Regular updates, spotless apartment on return. Rocco was extremely happy when we got home.""
              - `<figcaption>`
                - style: `border-top:1px solid rgba(255,255,255,.1); display:flex; align-items:center; gap:10px; font-size:.76rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#c4ab8a`
                - text: "Jess & Sam"
            - `<figure>`
              - style: `position:relative; margin:0; padding:34px 32px 30px; background:rgba(255,255,255,.04); border:1px solid rgba(196,171,138,.18); border-radius:16px; display:flex; flex-direction:column; gap:16px; transition:transform .3s ease, background .3s ease, border-color .3s ease`
              - :hover `transform:translateY(-6px);background:rgba(255,255,255,.07);border-color:rgba(196,171,138,.4)`
              - `<span>`
                - style: `position:absolute; top:16px; right:26px; font-family:'Marcellus',serif; font-size:4rem; line-height:1; color:rgba(196,171,138,.18)`
                - text: "”"
              - `<div>`
                - style: `color:#c4ab8a; font-size:.82rem; letter-spacing:.32em`
                - text: "★★★★★"
              - `<blockquote>`
                - style: `margin:0; color:rgba(255,255,255,.88); font-size:.93rem; line-height:1.8; font-style:italic`
                - text: ""We couldn't have asked for better pet sitters — reliable, trustworthy, and incredibly caring. They left our home spotless and exceeded every expectation.""
              - `<figcaption>`
                - style: `border-top:1px solid rgba(255,255,255,.1); display:flex; align-items:center; gap:10px; font-size:.76rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#c4ab8a`
                - text: "Libby"
            - `<figure>`
              - style: `position:relative; margin:0; padding:34px 32px 30px; background:rgba(255,255,255,.04); border:1px solid rgba(196,171,138,.18); border-radius:16px; display:flex; flex-direction:column; gap:16px; transition:transform .3s ease, background .3s ease, border-color .3s ease`
              - :hover `transform:translateY(-6px);background:rgba(255,255,255,.07);border-color:rgba(196,171,138,.4)`
              - `<span>`
                - style: `position:absolute; top:16px; right:26px; font-family:'Marcellus',serif; font-size:4rem; line-height:1; color:rgba(196,171,138,.18)`
                - text: "”"
              - `<div>`
                - style: `color:#c4ab8a; font-size:.82rem; letter-spacing:.32em`
                - text: "★★★★★"
              - `<blockquote>`
                - style: `margin:0; color:rgba(255,255,255,.88); font-size:.93rem; line-height:1.8; font-style:italic`
                - text: ""Callum and Niamh have looked after Solomon for four years. They are reliable, trustworthy, and clearly care about his wellbeing. I couldn't recommend them high…"
              - `<figcaption>`
                - style: `border-top:1px solid rgba(255,255,255,.1); display:flex; align-items:center; gap:10px; font-size:.76rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#c4ab8a`
                - text: "Thomas James"
    - `<section>` **Mosaic**
      - style: `position:relative; background:#faf6ee`
      - `<div>`
        - style: `display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:4px`
        - `<div>`
          - style: `overflow:hidden; background:#e9e0d2; aspect-ratio:1`
          - `<img>` src=`public/images/travis-1.jpg`
            - style: `width:100%; height:100%; object-fit:cover; display:block; object-position:center 15%; transition:transform .6s ease`
            - :hover `transform:scale(1.06)`
        - `<div>`
          - style: `overflow:hidden; background:#e9e0d2; aspect-ratio:1`
          - `<img>` src=`public/images/chester-1.jpg`
            - style: `width:100%; height:100%; object-fit:cover; display:block; object-position:center; transition:transform .6s ease`
            - :hover `transform:scale(1.06)`
        - `<div>`
          - style: `overflow:hidden; background:#e9e0d2; aspect-ratio:1`
          - `<img>` src=`public/images/solomon-1.jpg`
            - style: `width:100%; height:100%; object-fit:cover; display:block; object-position:center; transition:transform .6s ease`
            - :hover `transform:scale(1.06)`
        - `<div>`
          - style: `overflow:hidden; background:#e9e0d2; aspect-ratio:1`
          - `<img>` src=`public/images/zeus-1.jpg`
            - style: `width:100%; height:100%; object-fit:cover; display:block; object-position:center; transition:transform .6s ease`
            - :hover `transform:scale(1.06)`
        - `<div>`
          - style: `overflow:hidden; background:#e9e0d2; aspect-ratio:1`
          - `<img>` src=`public/images/alfie-1.jpg`
            - style: `width:100%; height:100%; object-fit:cover; display:block; object-position:center 20%; transition:transform .6s ease`
            - :hover `transform:scale(1.06)`
        - `<div>`
          - style: `overflow:hidden; background:#e9e0d2; aspect-ratio:1`
          - `<img>` src=`public/images/solomon-4.jpg`
            - style: `width:100%; height:100%; object-fit:cover; display:block; object-position:center; transition:transform .6s ease`
            - :hover `transform:scale(1.06)`
        - `<div>`
          - style: `overflow:hidden; background:#e9e0d2; aspect-ratio:1`
          - `<img>` src=`public/images/orca-3.jpg`
            - style: `width:100%; height:100%; object-fit:cover; display:block; object-position:center 25%; transition:transform .6s ease`
            - :hover `transform:scale(1.06)`
        - `<div>`
          - style: `overflow:hidden; background:#e9e0d2; aspect-ratio:1`
          - `<img>` src=`public/images/bailey-3.jpg`
            - style: `width:100%; height:100%; object-fit:cover; display:block; object-position:center; transition:transform .6s ease`
            - :hover `transform:scale(1.06)`
      - `<div>`
        - style: `text-align:center; padding:32px`
        - `<p>`
          - style: `font-family:'Marcellus',serif; font-size:1.1rem; color:#6b4e35; font-style:italic; margin:0`
          - text: "Every sit tells a story"
    - `<section>` **Features**
      - style: `padding:110px 0; background:#faf6ee`
      - `<div>`
        - style: `max-width:1100px; margin:0 auto; padding:0 48px`
        - `<div>`
          - style: `display:grid; grid-template-columns:minmax(0,1fr) minmax(0,.85fr); gap:56px; align-items:end`
          - `<div>`
            - `<p>`
              - style: `font-size:.75rem; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#6e5438; margin:0 0 18px; display:flex; align-items:center; gap:12px`
              - text: "What you get"
              - `<span>`
                - style: `width:26px; height:1px; background:#6e5438; display:block`
            - `<h2>`
              - style: `font-family:'Marcellus',serif; font-size:2.9rem; color:#2c1a0e; line-height:1.15; margin:0`
              - text: "Everything you need"
              - `<br>`
              - `<em>`
                - style: `color:#2f5d45`
                - text: "in one place"
          - `<p>`
            - style: `color:#6b4e35; font-size:1.02rem; line-height:1.8; margin:0 0 6px`
            - text: "Six things every MYAH page comes with as standard — no add-ons, no upgrades."
        - `<div>`
          - style: `display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:24px`
          - `<div>`
            - style: `background:#fff; border:1px solid rgba(110,84,56,.2); border-radius:18px; padding:38px 32px 34px; display:flex; flex-direction:column; gap:14px; box-shadow:0 1px 2px rgba(44,26,14,.04); transition:transform .3s ease, box-shadow .3s ease, border-color .3s ease`
            - :hover `transform:translateY(-6px);box-shadow:0 20px 50px rgba(44,26,14,.1);border-color:rgba(110,84,56,.45)`
            - `<span>`
              - style: `width:50px; height:50px; border-radius:14px; background:#faf6ee; border:1px solid rgba(110,84,56,.28); color:#6e5438; display:flex; align-items:center; justify-content:center`
              - `<svg>`
            - `<h3>`
              - style: `font-family:'Marcellus',serif; font-size:1.3rem; color:#2c1a0e; margin:6px 0 0; line-height:1.25`
              - text: "Your own URL"
            - `<p>`
              - style: `color:#6b4e35; font-size:.93rem; line-height:1.75; margin:0`
              - text: "A clean, shareable link at — professional and memorable."
              - `<strong>`
                - style: `color:#2f5d45; font-weight:700`
                - text: "myahsits.com/yourname"
          - `<div>`
            - style: `background:#fff; border:1px solid rgba(110,84,56,.2); border-radius:18px; padding:38px 32px 34px; display:flex; flex-direction:column; gap:14px; box-shadow:0 1px 2px rgba(44,26,14,.04); transition:transform .3s ease, box-shadow .3s ease, border-color .3s ease`
            - :hover `transform:translateY(-6px);box-shadow:0 20px 50px rgba(44,26,14,.1);border-color:rgba(110,84,56,.45)`
            - `<span>`
              - style: `width:50px; height:50px; border-radius:14px; background:#faf6ee; border:1px solid rgba(110,84,56,.28); color:#6e5438; display:flex; align-items:center; justify-content:center`
              - `<svg>`
            - `<h3>`
              - style: `font-family:'Marcellus',serif; font-size:1.3rem; color:#2c1a0e; margin:6px 0 0; line-height:1.25`
              - text: "Reviews & trust"
            - `<p>`
              - style: `color:#6b4e35; font-size:.93rem; line-height:1.75; margin:0`
              - text: "Showcase your best reviews from any platform — build trust before you even speak."
          - `<div>`
            - style: `background:#fff; border:1px solid rgba(110,84,56,.2); border-radius:18px; padding:38px 32px 34px; display:flex; flex-direction:column; gap:14px; box-shadow:0 1px 2px rgba(44,26,14,.04); transition:transform .3s ease, box-shadow .3s ease, border-color .3s ease`
            - :hover `transform:translateY(-6px);box-shadow:0 20px 50px rgba(44,26,14,.1);border-color:rgba(110,84,56,.45)`
            - `<span>`
              - style: `width:50px; height:50px; border-radius:14px; background:#faf6ee; border:1px solid rgba(110,84,56,.28); color:#6e5438; display:flex; align-items:center; justify-content:center`
              - `<svg>`
            - `<h3>`
              - style: `font-family:'Marcellus',serif; font-size:1.3rem; color:#2c1a0e; margin:6px 0 0; line-height:1.25`
              - text: "Photo gallery"
            - `<p>`
              - style: `color:#6b4e35; font-size:.93rem; line-height:1.75; margin:0`
              - text: "Show off the homes you’ve cared for, the pets you’ve loved, or your own home — a gallery that tells your story."
          - `<div>`
            - style: `background:#fff; border:1px solid rgba(110,84,56,.2); border-radius:18px; padding:38px 32px 34px; display:flex; flex-direction:column; gap:14px; box-shadow:0 1px 2px rgba(44,26,14,.04); transition:transform .3s ease, box-shadow .3s ease, border-color .3s ease`
            - :hover `transform:translateY(-6px);box-shadow:0 20px 50px rgba(44,26,14,.1);border-color:rgba(110,84,56,.45)`
            - `<span>`
              - style: `width:50px; height:50px; border-radius:14px; background:#faf6ee; border:1px solid rgba(110,84,56,.28); color:#6e5438; display:flex; align-items:center; justify-content:center`
              - `<svg>`
            - `<h3>`
              - style: `font-family:'Marcellus',serif; font-size:1.3rem; color:#2c1a0e; margin:6px 0 0; line-height:1.25`
              - text: "Built-in enquiries"
            - `<p>`
              - style: `color:#6b4e35; font-size:.93rem; line-height:1.75; margin:0`
              - text: "Visitors can reach you directly from your page via email or WhatsApp — no back-and-forth."
          - `<div>`
            - style: `background:#fff; border:1px solid rgba(110,84,56,.2); border-radius:18px; padding:38px 32px 34px; display:flex; flex-direction:column; gap:14px; box-shadow:0 1px 2px rgba(44,26,14,.04); transition:transform .3s ease, box-shadow .3s ease, border-color .3s ease`
            - :hover `transform:translateY(-6px);box-shadow:0 20px 50px rgba(44,26,14,.1);border-color:rgba(110,84,56,.45)`
            - `<span>`
              - style: `width:50px; height:50px; border-radius:14px; background:#faf6ee; border:1px solid rgba(110,84,56,.28); color:#6e5438; display:flex; align-items:center; justify-content:center`
              - `<svg>`
            - `<h3>`
              - style: `font-family:'Marcellus',serif; font-size:1.3rem; color:#2c1a0e; margin:6px 0 0; line-height:1.25`
              - text: "Mobile perfect"
            - `<p>`
              - style: `color:#6b4e35; font-size:.93rem; line-height:1.75; margin:0`
              - text: "Looks stunning on every device — because most people are on their phones."
          - `<div>`
            - style: `background:#fff; border:1px solid rgba(110,84,56,.2); border-radius:18px; padding:38px 32px 34px; display:flex; flex-direction:column; gap:14px; box-shadow:0 1px 2px rgba(44,26,14,.04); transition:transform .3s ease, box-shadow .3s ease, border-color .3s ease`
            - :hover `transform:translateY(-6px);box-shadow:0 20px 50px rgba(44,26,14,.1);border-color:rgba(110,84,56,.45)`
            - `<span>`
              - style: `width:50px; height:50px; border-radius:14px; background:#faf6ee; border:1px solid rgba(110,84,56,.28); color:#6e5438; display:flex; align-items:center; justify-content:center`
              - `<svg>`
            - `<h3>`
              - style: `font-family:'Marcellus',serif; font-size:1.3rem; color:#2c1a0e; margin:6px 0 0; line-height:1.25`
              - text: "Fully yours"
            - `<p>`
              - style: `color:#6b4e35; font-size:.93rem; line-height:1.75; margin:0`
              - text: "Your page, your colours, your content. Update it any time from your dashboard."
    - `<section>` **Final CTA**
      - style: `position:relative; min-height:560px; display:flex; align-items:center; justify-content:center; text-align:center; padding:100px 48px; overflow:hidden`
      - `<div>`
        - style: `position:absolute; inset:0`
        - `<img>` src=`public/images/callum-niamh-airport.jpg`
          - style: `width:100%; height:100%; object-fit:cover; object-position:center 30%`
        - `<div>`
          - style: `position:absolute; inset:0; background:linear-gradient(180deg, rgba(44,26,14,.62) 0%, rgba(44,26,14,.8) 100%)`
        - `<div>`
          - style: `position:absolute; inset:0; background:radial-gradient(ellipse at center, rgba(44,26,14,0) 30%, rgba(44,26,14,.55) 100%)`
      - `<div>`
        - style: `position:relative; z-index:2; max-width:660px`
        - `<p>`
          - style: `font-size:.78rem; font-weight:600; letter-spacing:.22em; text-transform:uppercase; color:#c4ab8a; margin:0 0 26px; display:flex; align-items:center; justify-content:center; gap:16px`
          - text: "Join MYAH"
          - `<span>`
            - style: `width:34px; height:1px; background:rgba(196,171,138,.55); display:block`
          - `<span>`
            - style: `width:34px; height:1px; background:rgba(196,171,138,.55); display:block`
        - `<h2>`
          - style: `font-family:'Marcellus',serif; font-size:3.5rem; color:#fff; line-height:1.12; margin:0 0 22px; text-wrap:pretty`
          - text: "Ready to create your"
          - `<br>`
          - `<em>`
            - style: `color:#c4ab8a`
            - text: "perfect page?"
        - `<p>`
          - style: `color:rgba(255,255,255,.8); font-size:1.05rem; line-height:1.7; margin:0 0 36px`
          - text: "Whether you're a house & pet sitter or a home owner looking for one — sign up for free today. It takes less than five minutes."
        - `<a>` → `Sign up.dc.html`
          - style: `display:inline-flex; align-items:center; justify-content:center; gap:8px; font-size:.82rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#fff; background:#2f5d45; border:1.5px solid #2f5d45; border-radius:50px; padding:16px 36px; white-space:nowrap; box-shadow:0 6px 20px rgba(110,84,56,.28); transition:background .2s, border-color .2s, transform .12s`
          - :hover `background:#3e7a5b;border-color:#3e7a5b;transform:translateY(-2px);box-shadow:0 12px 28px rgba(110,84,56,.36)`
          - :active `transform:translateY(0) scale(.98)`
          - text: "Sign up for free today"
        - `<div>`
          - style: `display:flex; align-items:center; justify-content:center; gap:22px; margin:30px 0 0; font-size:.8rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:rgba(255,255,255,.68)`
          - `<span>`
            - style: `display:flex; align-items:center; gap:8px`
            - text: "Build a page like Callum & Niamh"
            - `<span>`
              - style: `color:#c4ab8a; letter-spacing:.2em`
              - text: "★"
          - `<span>`
            - style: `width:5px; height:5px; border-radius:50%; background:rgba(196,171,138,.6)`
          - `<span>`
            - text: "Free to join"
          - `<span>`
            - style: `width:5px; height:5px; border-radius:50%; background:rgba(196,171,138,.6)`
          - `<span>`
            - text: "Live in 5 minutes"
        - `<p>`
          - style: `margin:26px 0 0; font-size:.9rem; color:rgba(255,255,255,.62)`
          - text: "Already have an account?"
          - `<a>` → `Log in.dc.html`
            - style: `color:#c4ab8a; font-weight:600; border-bottom:1px solid rgba(196,171,138,.4)`
            - text: "Log in"
    - `<footer>` **Footer**
      - style: `background:#2c1a0e; color:rgba(255,255,255,.7); padding:0 48px 32px; border-top:3px solid #2f5d45`
      - `<div>`
        - style: `max-width:1100px; margin:0 auto`
        - `<div>`
          - style: `display:grid; grid-template-columns:minmax(0,1.6fr) minmax(0,1fr) minmax(0,1fr); gap:56px; padding:72px 0 48px`
          - `<div>`
            - style: `display:flex; flex-direction:column; gap:18px; align-items:flex-start`
            - `<a>` → `Home.dc.html`
              - style: `display:inline-flex; align-items:center; gap:14px; line-height:1; font-family:'Montserrat',sans-serif; font-weight:500; font-size:1.7rem; letter-spacing:.28em`
              - `<img>` src=`public/images/logo-mark-cream.png`
                - style: `height:46px; width:46px; display:block; object-fit:contain`
              - `<span>`
                - style: `display:flex; flex-direction:column; gap:5px; border-left:1px solid rgba(255,255,255,.28)`
            - `<div>`
              - style: `display:flex; flex-direction:column; gap:12px; max-width:340px`
              - `<p>`
                - style: `font-family:'Lato',sans-serif; font-size:.72rem; font-weight:700; letter-spacing:.24em; text-transform:uppercase; color:#c4ab8a; margin:0`
                - text: "Pet & House Sitting"
              - `<p>`
                - style: `line-height:1.8; font-size:.95rem; margin:0; color:rgba(255,255,255,.7)`
                - text: "Premium pet & home care for peace of mind while you travel."
            - `<a>` → `Sign up.dc.html`
              - style: `display:inline-flex; align-items:center; justify-content:center; gap:8px; font-size:.78rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#fff; background:#2f5d45; border:1.5px solid #2f5d45; border-radius:50px; padding:13px 28px; white-space:nowrap; box-shadow:0 6px 20px rgba(110,84,56,.28); transition:background .2s, border-color .2s, transform .12s`
              - :hover `background:#3e7a5b;border-color:#3e7a5b;transform:translateY(-2px);box-shadow:0 12px 28px rgba(110,84,56,.36)`
              - :active `transform:translateY(0) scale(.98)`
              - text: "Sign up for free"
          - `<div>`
            - `<h4>`
              - style: `color:#fff; font-size:.76rem; font-weight:600; letter-spacing:.18em; text-transform:uppercase; margin:0 0 20px; border-bottom:1px solid rgba(196,171,138,.28)`
              - text: "Platform"
            - `<ul>`
              - style: `list-style:none; padding:0; margin:0`
              - `<li>`
              - `<li>`
              - `<li>`
              - `<li>`
          - `<div>`
            - `<h4>`
              - style: `color:#fff; font-size:.76rem; font-weight:600; letter-spacing:.18em; text-transform:uppercase; margin:0 0 20px; border-bottom:1px solid rgba(196,171,138,.28)`
              - text: "Example profile"
            - `<ul>`
              - style: `list-style:none; padding:0; margin:0`
              - `<li>`
        - `<div>`
          - style: `border-top:1px solid rgba(255,255,255,.1); display:flex; justify-content:space-between; align-items:center; gap:24px`
          - `<div>`
            - style: `display:flex; align-items:center; gap:16px; font-size:.78rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:rgba(255,255,255,.45)`
            - `<span>`
              - text: "© 2026 MYAH"
            - `<span>`
              - style: `width:4px; height:4px; border-radius:50%; background:rgba(196,171,138,.5); display:block`
            - `<a>` → `#privacy`
              - style: `color:rgba(255,255,255,.45); transition:color .2s`
              - :hover `color:#c4ab8a`
              - text: "Privacy"
            - `<span>`
              - style: `width:4px; height:4px; border-radius:50%; background:rgba(196,171,138,.5); display:block`
            - `<a>` → `#terms`
              - style: `color:rgba(255,255,255,.45); transition:color .2s`
              - :hover `color:#c4ab8a`
              - text: "Terms"
          - `<span>`
            - style: `display:flex; align-items:center; gap:9px; font-size:.82rem; color:rgba(255,255,255,.55); font-style:italic`
            - text: "Made with for house & pet sitters everywhere"
            - `<span>`
              - style: `font-style:normal`
              - text: "♡"

## Behaviour — port this logic verbatim

```js
class Component extends DCLogic {
  componentDidMount() {
    const root = document;
    const slides = root.querySelectorAll('[data-hero-slide]');
    let i = 0;
    if (slides.length > 1) {
      this.timer = setInterval(() => {
        slides[i].style.opacity = '0';
        i = (i + 1) % slides.length;
        slides[i].style.opacity = '1';
      }, 4500);
    }
    const header = root.querySelector('[data-site-header]');
    const logo = root.querySelector('[data-nav-logo]');
    const links = root.querySelectorAll('[data-nav-link]');
    const scroller = root.scrollingElement || document.documentElement;
    this.onScroll = () => {
      const y = window.scrollY || scroller.scrollTop || 0;
      const on = y > 60 || window.innerWidth <= 1000;
      if (!header) return;
      header.style.background = on ? 'rgba(250,246,238,0.97)' : 'transparent';
      header.style.backdropFilter = on ? 'blur(12px)' : 'none';
      header.style.boxShadow = on ? '0 1px 0 rgba(110,84,56,0.15)' : 'none';
      header.style.padding = on ? '14px 48px' : '20px 48px';
      const w1 = root.querySelector('[data-logo-word]');
      const w2 = root.querySelector('[data-logo-word2]');
      if (w1) w1.style.color = on ? '#6e5438' : '#e9e0d2';
      if (w2) w2.style.color = on ? '#2c1a0e' : '#2f5d45';
      const lg = root.querySelector('[data-logo-img]');
      if (lg) lg.src = on ? 'public/images/logo-mark.png' : 'public/images/logo-mark-white.png';
      const tg = root.querySelector('[data-logo-tag]');
      if (tg) { tg.style.color = on ? '#8a6a4f' : 'rgba(255,255,255,.82)'; tg.style.textShadow = on ? 'none' : '0 1px 8px rgba(44,26,14,.55)'; }
      links.forEach(a => { a.style.color = on ? '#5c3d20' : '#fff'; a.style.textShadow = on ? 'none' : '0 1px 8px rgba(44,26,14,.55)'; });
    };
    const burger = root.querySelector('[data-burger]');
    const drawer = root.querySelector('[data-mobile-menu]');
    const overlay = root.querySelector('[data-mm-overlay]');
    const close = root.querySelector('[data-mm-close]');
    const setOpen = (on) => {
      if (!drawer || !overlay) return;
      drawer.style.transform = on ? 'translateX(0)' : 'translateX(100%)';
      overlay.style.opacity = on ? '1' : '0';
      overlay.style.visibility = on ? 'visible' : 'hidden';
    };
    burger && burger.addEventListener('click', () => setOpen(true));
    close && close.addEventListener('click', () => setOpen(false));
    overlay && overlay.addEventListener('click', () => setOpen(false));
    root.querySelectorAll('[data-mm-item]').forEach(a => a.addEventListener('click', () => setOpen(false)));

    const loader = document.querySelector('[data-loader]');
    const showLoader = () => {
      if (!loader) return;
      loader.style.opacity = '1';
      loader.style.pointerEvents = 'all';
      clearTimeout(this.hideT);
      this.hideT = setTimeout(() => { loader.style.opacity = '0'; loader.style.pointerEvents = 'none'; }, 1600);
    };
    document.querySelectorAll('form').forEach(f => f.addEventListener('submit', e => { e.preventDefault(); showLoader(); }));
    document.querySelectorAll('a[href], button[type="submit"]').forEach(el => {
      const href = el.getAttribute('href') || '';
      if (href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || el.target === '_blank') return;
      el.addEventListener('click', e => { if (e.metaKey || e.ctrlKey || e.shiftKey) return; showLoader(); });
    });

    window.addEventListener('resize', this.onScroll);
    window.addEventListener('scroll', this.onScroll, { passive: true });
    document.addEventListener('scroll', this.onScroll, { passive: true, capture: true });
    this.onScroll();
  }
  componentWillUnmount() {
    clearTimeout(this.hideT);
    clearInterval(this.timer);
    window.removeEventListener('resize', this.onScroll);
    window.removeEventListener('scroll', this.onScroll);
    document.removeEventListener('scroll', this.onScroll, true);
  }
}
```
