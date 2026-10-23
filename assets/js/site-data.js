/* ==========================================================================
   WEMA GLOBAL — EDITABLE SITE DATA (stand-in for the CMS / Admin console)
   Change values here; no page layout needs to be touched.
   Text written in English is translated automatically when the visitor
   switches language, if a matching translation exists in assets/lang/.
   ========================================================================== */
window.WEMA = {

  /* ---- CONTACT DETAILS & SOCIAL MEDIA ----
     Fill these in when the official USA number, email and accounts are ready.
     Empty = "coming soon" (contact) or hidden (social icons). */
  config: {
    email:    '',
    phone:    '',
    whatsapp: '',
    social:   { linkedin: '', x: '', facebook: '', instagram: '', youtube: '', whatsapp: '' },
    liveMode: false,   // set true ONLY after backend (payments, login, email, uploads, admin) is connected and tested
    statsUrl: ''                               // optional JSON URL for live Missions & Impact statistics
  },

  /* ---- OPTIONAL ADVERTISING / ANNOUNCEMENT SLIDES (homepage hero) ----
     The approved homepage hero is a single, uncluttered slide, so this list is empty.
     To add a slide later, add an item like:
     { enabled: true, type: 'event', label: 'Announcement', title: '...', text: '...', image: 'assets/leaders-group.jpg',
       cta: [{ text: 'Learn more', href: 'events.html' }], start: 'YYYY-MM-DD', end: 'YYYY-MM-DD' }
     Only add confirmed information. */
  banners: [],   // up to 3 extra slides here; the homepage shows at most 5 slides in total (2 fixed + 3 editable)

  /* ---- HOMEPAGE VIDEO SLOT ----
     Set ONE of:  youtube: 'https://www.youtube.com/watch?v=...'  |  vimeo: 'https://vimeo.com/...'  |  file: 'assets/video/intro.mp4'
     Optional: poster: 'assets/....jpg', title: 'Video title'. Leave all empty to keep the empty slot. */
  homeVideo: { youtube: '', vimeo: '', file: '', poster: '', title: 'WEMA Global introduction' },

  /* ---- WEMA STORE PRODUCTS ----
     price / shipping / tax are numbers in USD. Leave price empty until confirmed: the product then shows
     "Price to be confirmed" and cannot be added to the cart. tax = rate as a decimal (e.g. 0.07) or leave empty. */
  products: [
    { id: 'clergy-apparels', name: 'Clergy Apparels', category: 'Clergy Apparels', image: 'assets/clergy-dialogue.jpg', text: 'Product details, availability and delivery information will be shown here.', price: null, shipping: null, tax: null }
  ],

  /* ---- LEADERSHIP profiles (publish only after name spelling, title and permission are confirmed) ----
     { name, title, country, bio, photo, link } */
  leaders: [],

  /* ---- PARTNER cards (publish only with the partner's permission and confirmed details) ----
     { name, country, type, text, website, logo } */
  partners: [],

  news: [],
  projects: []
};
