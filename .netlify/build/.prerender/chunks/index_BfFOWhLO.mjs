import { A as AstroError, I as InvalidComponentArgs, c as createRenderInstruction, r as renderHead, a as addAttribute, b as renderSlot, d as renderTemplate, m as maybeRenderHead, u as unescapeHTML, e as renderComponent } from './prerender_CtAkqTP3.mjs';
import 'piccolore';
import 'clsx';

function validateArgs(args) {
  if (args.length !== 3) return false;
  if (!args[0] || typeof args[0] !== "object") return false;
  return true;
}
function baseCreateComponent(cb, moduleId, propagation) {
  const name = moduleId?.split("/").pop()?.replace(".astro", "") ?? "";
  const fn = (...args) => {
    if (!validateArgs(args)) {
      throw new AstroError({
        ...InvalidComponentArgs,
        message: InvalidComponentArgs.message(name)
      });
    }
    return cb(...args);
  };
  Object.defineProperty(fn, "name", { value: name, writable: false });
  fn.isAstroComponentFactory = true;
  fn.moduleId = moduleId;
  fn.propagation = propagation;
  return fn;
}
function createComponentWithOptions(opts) {
  const cb = baseCreateComponent(opts.factory, opts.moduleId, opts.propagation);
  return cb;
}
function createComponent(arg1, moduleId, propagation) {
  if (typeof arg1 === "function") {
    return baseCreateComponent(arg1, moduleId, propagation);
  } else {
    return createComponentWithOptions(arg1);
  }
}

async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}</script>`;
    }
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"></script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}

const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title } = Astro2.props;
  const base = "/";
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description" content="Grotto Sitters — Callum Disley & Niamh Roche. Trusted house & pet sitters across the UK and Australia."><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet"><title>${title}</title>${renderHead()}</head> <body> <nav> <a${addAttribute(`${base}`, "href")} class="nav-logo">Grotto <span>Sitters</span></a> <button class="nav-toggle" aria-label="Toggle navigation"> <span></span> <span></span> <span></span> </button> <ul> <li class="nav-panel-brand"> <a${addAttribute(`${base}`, "href")}>Grotto <span>Sitters</span></a> </li> <li><a href="#about">About</a></li> <li><a href="#services">Services</a></li> <li><a href="#reviews">Reviews</a></li> <li><a href="#gallery">Gallery</a></li> <li><a href="#profiles">Our Profiles</a></li> <li><a href="#enquiry">Book Us</a></li> </ul> </nav> <div class="nav-overlay" id="navOverlay"></div> ${renderSlot($$result, $$slots["default"])} <footer> <div class="footer-inner"> <div class="footer-top"> <div class="footer-brand"> <h2>Grotto <span>Sitters</span></h2> <p>
Callum Disley & Niamh Roche — experienced house and pet sitters.
              Currently in Australia, returning to the UK October 2026.
</p> </div> <div class="footer-links"> <h4>Quick Links</h4> <ul> <li><a href="#about">About Us</a></li> <li><a href="#services">Services</a></li> <li><a href="#reviews">Reviews</a></li> <li><a href="#gallery">Gallery</a></li> <li><a href="#profiles">Our Profiles</a></li> <li><a href="#enquiry">Book Us</a></li> </ul> </div> <div class="footer-links"> <h4>Platforms</h4> <ul> <li> <a href="https://www.rover.com/sit/callud53623" target="_blank" rel="noopener noreferrer">Rover (UK)</a> </li> <li> <a href="https://www.trustedhousesitters.com/house-and-pet-sitters/australia/new-south-wales/sydney/l/6979617/" target="_blank" rel="noopener noreferrer">TrustedHouseSitters (AU)</a> </li> </ul> </div> </div> <div class="footer-bottom"> <span>&copy; 2026 Grotto Sitters &middot; Callum Disley & Niamh Roche</span> <span>Made with &#128062; for pet lovers everywhere</span> </div> </div> </footer> ${renderScript($$result, "/home/user/grottoseekers/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "/home/user/grottoseekers/src/layouts/BaseLayout.astro", void 0);

const $$Hero = createComponent(($$result, $$props, $$slots) => {
  const base = "/".replace(/\/?$/, "/");
  const heroImages = [
    { src: `${base}images/couple-dinner-1.jpg`, pos: "center 25%" },
    { src: `${base}images/couple-airport-1.jpg`, pos: "center 25%" },
    { src: `${base}images/couple-field-1.jpg`, pos: "center 15%" },
    { src: `${base}images/couple-bw-1.jpg`, pos: "center 15%" }
  ];
  return renderTemplate`${maybeRenderHead()}<section class="hero" data-astro-cid-bbe6dxrz> <div class="hero-slideshow" id="heroSlideshow" data-astro-cid-bbe6dxrz> ${heroImages.map((img, i) => renderTemplate`<div${addAttribute(`hero-slide ${i === 0 ? "active" : ""}`, "class")} data-astro-cid-bbe6dxrz> <img${addAttribute(img.src, "src")} alt=""${addAttribute(i === 0 ? "eager" : "lazy", "loading")}${addAttribute(`object-position: ${img.pos}`, "style")} data-astro-cid-bbe6dxrz> </div>`)} </div> <div class="hero-overlay" data-astro-cid-bbe6dxrz></div> <div class="hero-content" data-astro-cid-bbe6dxrz> <p class="hero-badge" data-astro-cid-bbe6dxrz>Currently in Australia — Returning to the UK October 2026</p> <h1 data-astro-cid-bbe6dxrz>Grotto<br data-astro-cid-bbe6dxrz><em data-astro-cid-bbe6dxrz>Sitters</em></h1> <p class="hero-names" data-astro-cid-bbe6dxrz>Callum Disley & Niamh Roche</p> <p class="hero-tagline" data-astro-cid-bbe6dxrz>
Experienced house & pet sitters available across Australia now and the UK from October.
</p> <a href="#enquiry" class="btn-primary" data-astro-cid-bbe6dxrz>Book Us Today</a> </div> </section>  ${renderScript($$result, "/home/user/grottoseekers/src/components/Hero.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/user/grottoseekers/src/components/Hero.astro", void 0);

const $$About = createComponent(($$result, $$props, $$slots) => {
  const base = "/".replace(/\/?$/, "/");
  const photos = [
    { src: `${base}images/couple-boat-1.jpg`, alt: "Callum and Niamh on a boat at sunset" },
    { src: `${base}images/couple-dinner-1.jpg`, alt: "Callum and Niamh at a seaside dinner" },
    { src: `${base}images/couple-field-1.jpg`, alt: "Callum and Niamh in a field at sunset" },
    { src: `${base}images/couple-villa-1.jpg`, alt: "Callum and Niamh at a villa" },
    { src: `${base}images/couple-night-1.jpg`, alt: "Callum and Niamh out at night" },
    { src: `${base}images/couple-bw-1.jpg`, alt: "Callum and Niamh black and white" },
    { src: `${base}images/couple-airport-1.jpg`, alt: "Callum and Niamh at the airport" }
  ];
  return renderTemplate`${maybeRenderHead()}<section id="about" data-astro-cid-v2cbyr3p> <div class="section-inner about-grid" data-astro-cid-v2cbyr3p> <div class="about-carousel" data-astro-cid-v2cbyr3p> <div class="carousel-track" id="aboutCarouselTrack" data-astro-cid-v2cbyr3p> ${photos.map((photo, i) => renderTemplate`<div${addAttribute(`carousel-slide ${i === 0 ? "active" : ""}`, "class")} data-astro-cid-v2cbyr3p> <img${addAttribute(photo.src, "src")}${addAttribute(photo.alt, "alt")} loading="lazy" data-astro-cid-v2cbyr3p> </div>`)} </div> <button class="carousel-btn carousel-prev" id="aboutPrev" aria-label="Previous photo" data-astro-cid-v2cbyr3p>&#8249;</button> <button class="carousel-btn carousel-next" id="aboutNext" aria-label="Next photo" data-astro-cid-v2cbyr3p>&#8250;</button> <div class="carousel-dots" id="aboutDots" data-astro-cid-v2cbyr3p> ${photos.map((_, i) => renderTemplate`<button${addAttribute(`dot ${i === 0 ? "active" : ""}`, "class")}${addAttribute(i, "data-index")}${addAttribute(`Go to photo ${i + 1}`, "aria-label")} data-astro-cid-v2cbyr3p></button>`)} </div> </div> <div class="about-text" data-astro-cid-v2cbyr3p> <p class="section-label" data-astro-cid-v2cbyr3p>Who We Are</p> <h2 class="section-title" data-astro-cid-v2cbyr3p>
A home away from home — for you and your pets.
</h2> <div class="divider" data-astro-cid-v2cbyr3p></div> <p data-astro-cid-v2cbyr3p>
We're <strong data-astro-cid-v2cbyr3p>Callum & Niamh</strong>, a couple from the UK who have
        been house and pet sitting full-time across Australia since December
        2025. With years of experience caring for pets and homes back in
        Britain, we brought that same dedication with us Down Under.
</p> <p data-astro-cid-v2cbyr3p>
Whether it's a weekend away or a month-long trip, we move in and keep
        everything running smoothly — daily walks, feeding routines, garden care,
        and plenty of love for your animals. We treat every sit like it's our own home.
</p> <p data-astro-cid-v2cbyr3p>
We're <strong data-astro-cid-v2cbyr3p>returning to the UK in October 2026</strong> and would
        love to hear from pet owners looking for reliable sitters — whether
        you're in Australia now or planning ahead in the UK. We're verified on
<strong data-astro-cid-v2cbyr3p>Rover</strong> and <strong data-astro-cid-v2cbyr3p>TrustedHouseSitters</strong>, with
        over 40 five-star reviews.
</p> </div> </div> </section>  ${renderScript($$result, "/home/user/grottoseekers/src/components/About.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/user/grottoseekers/src/components/About.astro", void 0);

const $$Services = createComponent(($$result, $$props, $$slots) => {
  const services = [
    {
      icon: "&#128054;",
      title: "Pet Sitting",
      description: "Your pets stay at home in their own environment while we move in to care for them. Walks, feeding, play, cuddles — everything they need to feel safe and loved while you're away."
    },
    {
      icon: "&#127969;",
      title: "House Sitting",
      description: "We stay in your home overnight, keeping it safe, secure, and exactly as you left it. Perfect for when you're travelling or away for work — come back to a spotless home."
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section id="services" data-astro-cid-g5jplrhu> <div class="section-inner" data-astro-cid-g5jplrhu> <p class="section-label" data-astro-cid-g5jplrhu>What We Offer</p> <h2 class="section-title" data-astro-cid-g5jplrhu>Our Services</h2> <div class="divider" data-astro-cid-g5jplrhu></div> <div class="services-grid" data-astro-cid-g5jplrhu> ${services.map((service) => renderTemplate`<div class="service-card" data-astro-cid-g5jplrhu> <span class="service-icon" data-astro-cid-g5jplrhu>${unescapeHTML(service.icon)}</span> <h3 data-astro-cid-g5jplrhu>${service.title}</h3> <p data-astro-cid-g5jplrhu>${service.description}</p> </div>`)} </div> <div class="pricing-note" data-astro-cid-g5jplrhu>
We built our experience through <strong data-astro-cid-g5jplrhu>TrustedHouseSitters</strong>, where
      sits are exchanged for free accommodation. Now that we've established
      ourselves with over 40 five-star reviews, we charge a small fee to reflect
      the time, care, and commitment we put into every sit. Every home and every
      pet is different, so our pricing is tailored to your needs — we'll discuss
      your dates, location, and requirements to find an arrangement that works
      for everyone. <a href="#enquiry" data-astro-cid-g5jplrhu>Get in touch</a> for a personalised quote.
</div> </div> </section>`;
}, "/home/user/grottoseekers/src/components/Services.astro", void 0);

const $$Gallery = createComponent(($$result, $$props, $$slots) => {
  const base = "/".replace(/\/?$/, "/");
  const pets = [
    {
      name: "Chester",
      owner: "",
      images: [`${base}images/chester-1.jpg`],
      alt: ["Chester the cocker spaniel cuddling on the couch"],
      pos: "center center"
    },
    {
      name: "Travis",
      owner: "",
      images: [
        `${base}images/travis-1.jpg`,
        `${base}images/travis-2.jpg`,
        `${base}images/travis-3.jpg`
      ],
      alt: [
        "Travis on a countryside walk",
        "Travis the Vizsla close-up portrait",
        "Travis sleeping in blankets"
      ],
      pos: "center 30%"
    },
    {
      name: "Solomon",
      owner: "",
      images: [
        `${base}images/solomon-1.jpg`,
        `${base}images/solomon-4.jpg`,
        `${base}images/solomon-2.jpg`,
        `${base}images/mali-1.jpg`
      ],
      alt: [
        "Solomon the labradoodle on the grass",
        "Solomon in the snow",
        "Solomon on a muddy walk",
        "Solomon in a Santa outfit"
      ],
      pos: "center 50%"
    },
    {
      name: "Zeus",
      owner: "",
      images: [`${base}images/zeus-1.jpg`],
      alt: ["Zeus the Weimaraner with Callum"],
      pos: "center 30%"
    },
    {
      name: "Alfie",
      owner: "",
      images: [
        `${base}images/alfie-1.jpg`,
        `${base}images/alfie-2.jpg`
      ],
      alt: [
        "Alfie the cockapoo with Callum",
        "Alfie relaxing at home"
      ],
      pos: "center 30%"
    },
    {
      name: "Orca",
      owner: "",
      images: [
        `${base}images/orca-1.jpg`,
        `${base}images/orca-4.jpg`
      ],
      alt: [
        "Orca the springer spaniel on the couch",
        "Orca on a countryside walk"
      ],
      pos: "center 35%"
    },
    {
      name: "Bailey",
      owner: "",
      images: [`${base}images/black-dog-toy-1.jpg`],
      alt: ["Bailey with her champagne bottle toy"],
      pos: "center 40%"
    },
    {
      name: "Matilda",
      owner: "",
      images: [`${base}images/matilda-1.jpg`],
      alt: ["Matilda the cocker spaniel giving Niamh a kiss"],
      pos: "center 30%"
    },
    {
      name: "Molly & Sparky",
      owner: "",
      images: [
        `${base}images/molly-2.jpg`,
        `${base}images/sparky-1.jpg`,
        `${base}images/molly-3.jpg`
      ],
      alt: [
        "Molly the labradoodle at home",
        "Sparky the bearded dragon in his terrarium",
        "Molly in the doorway"
      ],
      pos: "center 40%"
    },
    {
      name: "Scuff",
      owner: "",
      images: [`${base}images/scuff-1.jpg`],
      alt: ["Scuff in Christmas reindeer antlers"],
      pos: "center 55%"
    },
    {
      name: "Toby",
      owner: "",
      images: [
        `${base}images/orca-2.jpg`,
        `${base}images/orca-3.jpg`
      ],
      alt: [
        "Toby in the park with a stick",
        "Toby in the kitchen"
      ],
      pos: "center 35%"
    },
    {
      name: "Lena",
      owner: "",
      images: [
        `${base}images/toby-1.jpg`,
        `${base}images/toby-2.jpg`,
        `${base}images/lena-1.jpg`,
        `${base}images/lena-4.jpg`,
        `${base}images/lena-5.jpg`
      ],
      alt: [
        "Lena at the back door",
        "Lena out with Niamh at a cafe",
        "Lena with a ball in the park",
        "Lena looking up on a walk",
        "Lena out in the city at night"
      ],
      pos: "center 35%"
    },
    {
      name: "Hero & Ted",
      owner: "",
      images: [`${base}images/hero-ted-1.jpg`],
      alt: ["Hero the Doberman and Ted cuddling on the couch"],
      pos: "center 40%"
    },
    {
      name: "Finley",
      owner: "",
      images: [`${base}images/finley-1.jpg`],
      alt: ["Finley in the kitchen"],
      pos: "center 50%"
    },
    {
      name: "Mali",
      owner: "",
      images: [
        `${base}images/yubyub-1.jpg`,
        `${base}images/mali-2.jpg`
      ],
      alt: [
        "Mali being held",
        "Mali with Callum in the kitchen"
      ],
      pos: "center 35%"
    },
    {
      name: "Luffy",
      owner: "",
      images: [`${base}images/luffy-1.jpg`],
      alt: ["Luffy the chocolate spaniel puppy with Callum"],
      pos: "center 40%"
    },
    {
      name: "YubYub",
      owner: "",
      images: [
        `${base}images/bailey-1.jpg`,
        `${base}images/bailey-3.jpg`
      ],
      alt: [
        "YubYub on a sunset walk",
        "YubYub in the garden with a tennis ball"
      ],
      pos: "center 35%"
    },
    {
      name: "Daisy & Rocky",
      owner: "",
      images: [`${base}images/daisy-rocky-1.jpg`],
      alt: ["Daisy and Rocky cuddling on the chair"],
      pos: "center 55%"
    },
    {
      name: "Arlo",
      owner: "",
      images: [
        `${base}images/arlo-1.jpg`,
        `${base}images/arlo-2.jpg`
      ],
      alt: [
        "Arlo with Niamh",
        "Arlo asleep in the car"
      ],
      pos: "center 30%"
    },
    {
      name: "Angela's Pets",
      owner: "",
      images: [
        `${base}images/angela-pets-3.jpg`,
        `${base}images/poppy-1.jpg`,
        `${base}images/angela-pets-1.jpg`,
        `${base}images/angela-pets-5.jpg`
      ],
      alt: [
        "Angela's cat in a paper bag",
        "Poppy the black Labrador",
        "Angela's dogs by the fireplace",
        "Angela's animals on the farm"
      ],
      pos: "center 55%"
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section id="gallery" data-astro-cid-ihllb3az> <div class="section-inner" data-astro-cid-ihllb3az> <p class="section-label" data-astro-cid-ihllb3az>In Good Hands</p> <h2 class="section-title" data-astro-cid-ihllb3az>The ones we've loved</h2> <div class="divider" data-astro-cid-ihllb3az></div> <p class="gallery-intro" data-astro-cid-ihllb3az>
From the English countryside to the suburbs of Sydney — every sit brings
      new friends. Here are some of the wonderful animals we've had the
      pleasure of caring for since we started sitting in the UK and Australia.
</p> <div class="pet-grid" data-astro-cid-ihllb3az> ${pets.map((pet, petIdx) => renderTemplate`<div class="pet-card"${addAttribute(petIdx, "data-pet-index")} data-astro-cid-ihllb3az> <div class="pet-carousel" data-astro-cid-ihllb3az> <div class="pet-images" data-astro-cid-ihllb3az> ${pet.images.map((src, imgIdx) => renderTemplate`<img${addAttribute(src, "src")}${addAttribute(pet.alt[imgIdx], "alt")} loading="lazy"${addAttribute(imgIdx === 0 ? "active" : "", "class")}${addAttribute(`object-position: ${pet.pos}`, "style")}${addAttribute(src, "data-full-src")}${addAttribute(pet.alt[imgIdx], "data-full-alt")} data-astro-cid-ihllb3az>`)} </div> ${pet.images.length > 1 && renderTemplate`<button class="carousel-btn carousel-prev" data-astro-cid-ihllb3az>&lsaquo;</button>
                <button class="carousel-btn carousel-next" data-astro-cid-ihllb3az>&rsaquo;</button>
                <div class="carousel-dots" data-astro-cid-ihllb3az> ${pet.images.map((_, i) => renderTemplate`<span${addAttribute(`carousel-dot ${i === 0 ? "active" : ""}`, "class")}${addAttribute(i, "data-index")} data-astro-cid-ihllb3az></span>`)} </div>`} </div> <div class="pet-info" data-astro-cid-ihllb3az> <span class="pet-name" data-astro-cid-ihllb3az>${pet.name}</span> </div> </div>`)} </div> </div> </section> <div class="lightbox" id="lightbox" data-astro-cid-ihllb3az> <button class="lightbox-close" id="lightboxClose" data-astro-cid-ihllb3az>&times;</button> <button class="lightbox-nav lightbox-prev" id="lightboxPrev" data-astro-cid-ihllb3az>&lsaquo;</button> <img class="lightbox-img" id="lightboxImg" src="" alt="" data-astro-cid-ihllb3az> <button class="lightbox-nav lightbox-next" id="lightboxNext" data-astro-cid-ihllb3az>&rsaquo;</button> <div class="lightbox-counter" id="lightboxCounter" data-astro-cid-ihllb3az></div> </div>   ${renderScript($$result, "/home/user/grottoseekers/src/components/Gallery.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/user/grottoseekers/src/components/Gallery.astro", void 0);

const $$Reviews = createComponent(($$result, $$props, $$slots) => {
  const reviews = [
    {
      text: "Super lovely couple who took great care of our cat Rocco! They sent regular updates and pictures and kept us in the loop throughout the trip. Rocco was extremely happy when we got home and seemed very at ease. Our apartment was also in wonderful condition!",
      name: "Jess & Sam",
      initials: "JS",
      platform: "TrustedHouseSitters · Sydney, NSW"
    },
    {
      text: "Callum and Niamh were and are a delightful couple. The house was impeccable on our return and the animals were well looked after. They both went out of their way to come and meet me a few weeks before our departure which put me at absolute ease. Both would be welcomed back anytime.",
      name: "Janet",
      initials: "JA",
      platform: "TrustedHouseSitters · Kurrajong Heights, NSW · Mar 2026"
    },
    {
      text: "Callum & Niamh were amazing sitters! We came home to happy puppies and they went the extra mile. One of our dogs wasn't feeling well and they took excellent care of everything. I'm so grateful our dogs were in such great hands. The house was spotless and they were a pleasure to talk with!",
      name: "Heather",
      initials: "HE",
      platform: "TrustedHouseSitters · Sydney, NSW · Mar 2026"
    },
    {
      text: "We couldn't have asked for better pet sitters. From start to finish Callum and Niamh were reliable, trustworthy, and incredibly caring with Bailey. They were very communicative, providing updates and photos the whole time. They also left our home spotless. They absolutely exceeded expectations. Bailey clearly loved them too!",
      name: "Libby",
      initials: "LI",
      platform: "TrustedHouseSitters · Sydney, NSW · Feb 2026"
    },
    {
      text: "Callum and Niamh were just lovely house sitters. We have 4 dogs, a cat, chooks and a big garden. The animals were very well looked after and happy. The house was tidy and sheets washed. I would be very happy to recommend these two lovely people to anyone.",
      name: "Angela",
      initials: "AN",
      platform: "TrustedHouseSitters · Bowral, NSW · Jan–Feb 2026"
    },
    {
      text: "Callum and Niamh were amazing. Mali took to them immediately, especially as Mali doesn't usually take to men quickly. They were loving and took great care of him, even taking him for walks in the rain. Our place was left in perfect condition. Mali adored them — so grateful our first experience with a sitter was so perfect!",
      name: "Elizabeth",
      initials: "EL",
      platform: "TrustedHouseSitters · Faulconbridge, NSW · Jan 2026"
    },
    {
      text: "Niamh and Callum were the perfect house sitters — reliable with fantastic communication. They looked after Zeus and the house impeccably. We're pretty sure Zeus was disappointed when we came home! We wish them all the very best and hope to see them again. Zeus already misses them!",
      name: "Danielle",
      initials: "DA",
      platform: "TrustedHouseSitters · Sydney, NSW · Jan 2026"
    },
    {
      text: "Our 3 pets loved their time with Callum and Niamh for 2 weeks over Christmas — Scuff is still looking in the spare room to check if his friends have really gone! We appreciated the regular updates and photos, and their due diligence taking Scuff out in the cooler parts of the day during 35–40 degree heat. Would have them back anytime!",
      name: "Kimberley",
      initials: "KI",
      platform: "TrustedHouseSitters · Joondalup, WA · Dec 2025–Jan 2026"
    },
    {
      text: "Callum and his partner looked after our Spaniel whilst we were away for a week — both lovely, very professional but also super friendly. Toby looked very happy and chilled and came home so content! We would absolutely use Callum again in a heartbeat and would highly recommend.",
      name: "Phillipa",
      initials: "PH",
      platform: "Rover · United Kingdom · Oct 2025"
    },
    {
      text: "I wouldn't hesitate in recommending Callum & Niamh. They took excellent care of both our dogs for 2 weeks, provided daily updates and photos. The dogs were exercised, loved and treated like family. I was so content knowing they were enjoying their holiday whilst we were on ours. You won't find better!",
      name: "Deb",
      initials: "DE",
      platform: "Rover · United Kingdom · Sep 2025"
    },
    {
      text: "Callum and Niamh have looked after my Hungarian Vizsla Travis on multiple home stays and are his regular dog walkers. They have a key to my house — they are trustworthy and reliable and he adores them, to the point where he drags me to their house. When Travis was ill at a festival stay, they handled two vet visits brilliantly. I would highly recommend them to anyone.",
      name: "Emma",
      initials: "EM",
      platform: "Rover · United Kingdom · Sep 2025"
    },
    {
      text: "Callum and Niamh have come to stay at our home to look after our cocker spaniel and tabby cat whenever we go away. On each occasion we've been blown away by the great job they've done. Our holidays are so much more relaxed for having found them — we go away knowing our most loved pets and possessions are being cared for just as we would. Thanks again!",
      name: "Charlotte",
      initials: "CH",
      platform: "Rover · United Kingdom · Sep 2025"
    },
    {
      text: "Callum and his partner Niamh have looked after my labradoodle Solomon for the last four years, since he was a puppy. Solly absolutely adores them both. They are reliable, trustworthy, and clearly care about his wellbeing. Whether it's regular walks, overnight stays, or house-sitting, they go above and beyond. I couldn't recommend them highly enough.",
      name: "Thomas James",
      initials: "TJ",
      platform: "Rover · United Kingdom · Sep 2025"
    },
    {
      text: "Callum and Niamh have looked after our dog multiple times and we couldn't recommend them enough. They are both lovely, kind and genuine people who put you at ease the moment you meet them. We can fully relax when away, knowing our dog is in the very best possible care. She completely adores them — you won't find a more trustworthy, dependable couple!",
      name: "Ben",
      initials: "BE",
      platform: "Rover · United Kingdom · Sep 2025"
    },
    {
      text: "Callum and his partner were recommended to look after my home and cat while I was abroad. Cat was very well cared for with regular WhatsApp updates. My home was immaculate on return — better than I'd left it. They even left fresh milk and bread, and washed the bedding. So thoughtful and considerate. I'd highly recommend and would use again.",
      name: "Anne-Marie",
      initials: "AM",
      platform: "Rover · United Kingdom · Sep 2025"
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section id="reviews" data-astro-cid-bgwftent> <div class="section-inner" data-astro-cid-bgwftent> <p class="section-label" data-astro-cid-bgwftent>What People Say</p> <h2 class="section-title" data-astro-cid-bgwftent>Over 40 five-star reviews.</h2> <div class="divider" data-astro-cid-bgwftent></div> <div class="stars-row" data-astro-cid-bgwftent> <span class="star" data-astro-cid-bgwftent>&#9733;</span> <span class="star" data-astro-cid-bgwftent>&#9733;</span> <span class="star" data-astro-cid-bgwftent>&#9733;</span> <span class="star" data-astro-cid-bgwftent>&#9733;</span> <span class="star" data-astro-cid-bgwftent>&#9733;</span> <span class="stars-label" data-astro-cid-bgwftent>5.0 across all platforms</span> </div> <div class="reviews-track-wrapper" data-astro-cid-bgwftent> <div class="reviews-track" id="reviewsTrack" data-astro-cid-bgwftent> ${reviews.map((review) => renderTemplate`<div class="review-card" data-astro-cid-bgwftent> <div class="review-stars" data-astro-cid-bgwftent> <span class="star" data-astro-cid-bgwftent>&#9733;</span> <span class="star" data-astro-cid-bgwftent>&#9733;</span> <span class="star" data-astro-cid-bgwftent>&#9733;</span> <span class="star" data-astro-cid-bgwftent>&#9733;</span> <span class="star" data-astro-cid-bgwftent>&#9733;</span> </div> <p class="review-text" data-astro-cid-bgwftent>"${review.text}"</p> <div class="review-author" data-astro-cid-bgwftent> <div class="review-avatar" data-astro-cid-bgwftent>${review.initials}</div> <div data-astro-cid-bgwftent> <div class="review-name" data-astro-cid-bgwftent>${review.name}</div> <div class="review-platform" data-astro-cid-bgwftent>${review.platform}</div> </div> </div> </div>`)} </div> </div> <div class="reviews-nav" data-astro-cid-bgwftent> <button class="rev-btn" id="prevBtn" data-astro-cid-bgwftent>&larr;</button> <button class="rev-btn" id="nextBtn" data-astro-cid-bgwftent>&rarr;</button> <div class="rev-dots" id="revDots" data-astro-cid-bgwftent></div> </div> </div> </section>  ${renderScript($$result, "/home/user/grottoseekers/src/components/Reviews.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/user/grottoseekers/src/components/Reviews.astro", void 0);

const $$Profiles = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section id="profiles" data-astro-cid-mp7lvjdw> <div class="section-inner" data-astro-cid-mp7lvjdw> <p class="section-label" data-astro-cid-mp7lvjdw>Find Us Online</p> <h2 class="section-title" data-astro-cid-mp7lvjdw>Our Verified Profiles</h2> <div class="divider" data-astro-cid-mp7lvjdw></div> <p class="profiles-intro" data-astro-cid-mp7lvjdw>
We're verified sitters on both major platforms — Rover for our UK sits
      and TrustedHouseSitters for Australia. Browse our full review histories below.
</p> <div class="profiles-grid" data-astro-cid-mp7lvjdw> <a href="https://www.rover.com/sit/callud53623" target="_blank" rel="noopener noreferrer" class="platform-card" data-astro-cid-mp7lvjdw> <span class="platform-logo" data-astro-cid-mp7lvjdw>&#128021;</span> <h3 data-astro-cid-mp7lvjdw>Rover</h3> <p data-astro-cid-mp7lvjdw>
Our UK-based profile with verified reviews from pet owners across
          Britain.
</p> <span class="platform-link-text" data-astro-cid-mp7lvjdw>View Profile &rarr;</span> </a> <a href="https://www.trustedhousesitters.com/house-and-pet-sitters/australia/new-south-wales/sydney/l/6979617/" target="_blank" rel="noopener noreferrer" class="platform-card" data-astro-cid-mp7lvjdw> <span class="platform-logo" data-astro-cid-mp7lvjdw>&#127969;</span> <h3 data-astro-cid-mp7lvjdw>TrustedHouseSitters</h3> <p data-astro-cid-mp7lvjdw>
Our Australian profile with house and pet sitting reviews from across
          the country.
</p> <span class="platform-link-text" data-astro-cid-mp7lvjdw>View Profile &rarr;</span> </a> </div> </div> </section>`;
}, "/home/user/grottoseekers/src/components/Profiles.astro", void 0);

const $$Enquiry = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section id="enquiry" data-astro-cid-dsmwveet> <div class="section-inner" data-astro-cid-dsmwveet> <div class="form-layout" data-astro-cid-dsmwveet> <div class="form-intro" data-astro-cid-dsmwveet> <p class="section-label" data-astro-cid-dsmwveet>Get In Touch</p> <h2 class="section-title" data-astro-cid-dsmwveet>Book Us or Say Hello</h2> <div class="divider" data-astro-cid-dsmwveet></div> <p data-astro-cid-dsmwveet>
Fill in the form and we'll get back to you as soon as possible to
          discuss your dates, do a meet & greet, or answer any questions you
          might have.
</p> <p data-astro-cid-dsmwveet>
We love hearing about your pets — the more detail you give us, the
          better we can plan!
</p> <div class="contact-options" data-astro-cid-dsmwveet> <a href="mailto:grottositters@outlook.com" class="contact-option" data-astro-cid-dsmwveet> <span class="contact-option-icon" data-astro-cid-dsmwveet>&#9993;&#65039;</span> <div class="contact-option-text" data-astro-cid-dsmwveet> <strong data-astro-cid-dsmwveet>Email Us</strong> <span data-astro-cid-dsmwveet>grottositters@outlook.com</span> </div> </a> <a href="https://wa.me/447306100251" target="_blank" rel="noopener noreferrer" class="contact-option" data-astro-cid-dsmwveet> <span class="contact-option-icon" data-astro-cid-dsmwveet>&#128172;</span> <div class="contact-option-text" data-astro-cid-dsmwveet> <strong data-astro-cid-dsmwveet>WhatsApp Us</strong> <span data-astro-cid-dsmwveet>+44 7306 100251</span> </div> </a> </div> </div> <form id="enquiryForm" data-astro-cid-dsmwveet> <p class="form-section-title" data-astro-cid-dsmwveet>Your Details</p> <div class="form-row" data-astro-cid-dsmwveet> <div class="form-group" data-astro-cid-dsmwveet> <label for="fname" data-astro-cid-dsmwveet>First Name</label> <input type="text" id="fname" name="fname" placeholder="Jane" required data-astro-cid-dsmwveet> </div> <div class="form-group" data-astro-cid-dsmwveet> <label for="lname" data-astro-cid-dsmwveet>Last Name</label> <input type="text" id="lname" name="lname" placeholder="Smith" required data-astro-cid-dsmwveet> </div> </div> <div class="form-row" data-astro-cid-dsmwveet> <div class="form-group" data-astro-cid-dsmwveet> <label for="email" data-astro-cid-dsmwveet>Email</label> <input type="email" id="email" name="email" placeholder="jane@example.com" required data-astro-cid-dsmwveet> </div> <div class="form-group" data-astro-cid-dsmwveet> <label for="phone" data-astro-cid-dsmwveet>Phone / WhatsApp</label> <input type="tel" id="phone" name="phone" placeholder="+44 7700 000000" data-astro-cid-dsmwveet> </div> </div> <div class="form-group" data-astro-cid-dsmwveet> <label for="address" data-astro-cid-dsmwveet>Property Address</label> <input type="text" id="address" name="address" placeholder="123 Example St, Sydney NSW 2000" required data-astro-cid-dsmwveet> </div> <div class="form-row" data-astro-cid-dsmwveet> <div class="form-group" data-astro-cid-dsmwveet> <label for="date-from" data-astro-cid-dsmwveet>Date From</label> <input type="date" id="date-from" name="date-from" required data-astro-cid-dsmwveet> </div> <div class="form-group" data-astro-cid-dsmwveet> <label for="date-to" data-astro-cid-dsmwveet>Date To</label> <input type="date" id="date-to" name="date-to" required data-astro-cid-dsmwveet> </div> </div> <p class="form-section-title" style="margin-top: 8px" data-astro-cid-dsmwveet>Your Pets</p> <div class="form-row" data-astro-cid-dsmwveet> <div class="form-group" data-astro-cid-dsmwveet> <label for="pet-name" data-astro-cid-dsmwveet>Pet Name(s)</label> <input type="text" id="pet-name" name="pet-name" placeholder="Biscuit, Luna…" data-astro-cid-dsmwveet> </div> <div class="form-group" data-astro-cid-dsmwveet> <label for="pet-type" data-astro-cid-dsmwveet>Type of Pet(s)</label> <select id="pet-type" name="pet-type" data-astro-cid-dsmwveet> <option value="" data-astro-cid-dsmwveet>Select…</option> <option data-astro-cid-dsmwveet>Dog(s)</option> <option data-astro-cid-dsmwveet>Cat(s)</option> <option data-astro-cid-dsmwveet>Dog(s) & Cat(s)</option> <option data-astro-cid-dsmwveet>Other</option> </select> </div> </div> <div class="form-row" data-astro-cid-dsmwveet> <div class="form-group" data-astro-cid-dsmwveet> <label for="pet-breed" data-astro-cid-dsmwveet>Breed(s)</label> <input type="text" id="pet-breed" name="pet-breed" placeholder="Golden Retriever…" data-astro-cid-dsmwveet> </div> <div class="form-group" data-astro-cid-dsmwveet> <label for="pet-age" data-astro-cid-dsmwveet>Age(s)</label> <input type="text" id="pet-age" name="pet-age" placeholder="3 years, 7 months…" data-astro-cid-dsmwveet> </div> </div> <div class="form-group" data-astro-cid-dsmwveet> <label for="message" data-astro-cid-dsmwveet>Anything else we should know?</label> <textarea id="message" name="message" placeholder="Special requirements, feeding routines, medical needs, access instructions…" data-astro-cid-dsmwveet></textarea> </div> <div class="submit-btns" data-astro-cid-dsmwveet> <button type="button" class="btn-email" id="sendEmailBtn" data-astro-cid-dsmwveet>&#9993;&#65039; &nbsp; Send via Email</button> <button type="button" class="btn-whatsapp" id="sendWhatsAppBtn" data-astro-cid-dsmwveet>
Send via WhatsApp
</button> </div> </form> </div> </div> </section>  ${renderScript($$result, "/home/user/grottoseekers/src/components/Enquiry.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/user/grottoseekers/src/components/Enquiry.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Grotto Sitters — Trusted House & Pet Sitters" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Hero", $$Hero, {})} ${renderComponent($$result2, "About", $$About, {})} ${renderComponent($$result2, "Services", $$Services, {})} ${renderComponent($$result2, "Reviews", $$Reviews, {})} ${renderComponent($$result2, "Gallery", $$Gallery, {})} ${renderComponent($$result2, "Profiles", $$Profiles, {})} ${renderComponent($$result2, "Enquiry", $$Enquiry, {})} ` })}`;
}, "/home/user/grottoseekers/src/pages/index.astro", void 0);

const $$file = "/home/user/grottoseekers/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
