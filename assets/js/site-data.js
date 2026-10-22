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
    address:  '30 N Gould St, Ste R, Sheridan, WY 82801, USA',
    social:   { linkedin: '', x: '', facebook: '', instagram: '', youtube: '', whatsapp: '' },
    apps:     { ios: '', android: '' },        // optional store links
    statsUrl: ''                               // optional JSON URL for live Missions & Impact statistics
  },

  /* ---- OPTIONAL ADVERTISING / ANNOUNCEMENT SLIDES (homepage hero) ----
     The approved homepage hero is a single, uncluttered slide, so this list is empty.
     To add a slide later, add an item like:
     { enabled: true, type: 'event', label: 'Announcement', title: '...', text: '...', image: 'assets/leaders-group.jpg',
       cta: [{ text: 'Learn more', href: 'events.html' }], start: 'YYYY-MM-DD', end: 'YYYY-MM-DD' }
     Only add confirmed information. */
  banners: [],

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
