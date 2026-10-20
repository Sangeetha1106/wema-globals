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
    payments: { stripe: '', paypal: '' },      // optional payment links
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
     Paste the real Amazon / Shopify product links. A button shows only when its link is filled. */
  products: [
    { name: 'Coco Peat', category: 'Coco Peat', image: 'assets/eco-leaves.svg', text: '', amazon: '', shopify: '' },
    { name: 'Printed T-Shirts', category: 'Garments', image: 'assets/logo.png', text: '', amazon: '', shopify: '' },
    { name: 'Clergy Apparels', category: 'Clergy Apparels', image: 'assets/clergy-dialogue.jpg', text: '', amazon: '', shopify: '' }
  ],

  /* ---- NEWS (kept for future use; empty until confirmed announcements exist) ---- */
  news: [],

  /* ---- PROJECTS listings. Empty until the first projects are published. ---- */
  projects: []
};
