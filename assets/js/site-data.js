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

  /* ---- HOMEPAGE SLIDING BANNER (shown after the conference slide) ----
     type: event | product | mission | sponsor   ·   enabled:false hides   ·   start/end: 'YYYY-MM-DD' */
  banners: [
    { enabled: true, type: 'product', label: 'WEMA Store',
      title: 'Shop for a Cause',
      text: 'Coco Peat, Printed T-Shirts and Clergy Apparels, available on Amazon and Shopify.',
      image: 'assets/eco-leaves.svg', cta: [{ text: 'Visit WEMA Store', href: 'store.html' }] },
    { enabled: true, type: 'mission', label: 'Our Missions & Impact',
      title: 'WEMA Missionaries and Alfa Omega Children\'s Home',
      text: 'See the services and impact of our missions.',
      image: 'assets/clergy-dialogue.jpg', cta: [{ text: 'Our Missions & Impact', href: 'index.html#missions' }, { text: 'Donate', href: 'donate.html', secondary: true }] },
    { enabled: true, type: 'sponsor', label: 'Advertisement',
      title: 'Sponsor and advertise with WEMA Global',
      text: 'Reach an international audience of leaders, ministries and partners.',
      image: 'assets/arena-stage.jpg', cta: [{ text: 'Sponsor Enquiry', href: 'contact.html?dept=Sponsorship' }] }
  ],

  /* ---- WEMA STORE PRODUCTS ----
     Paste the real Amazon / Shopify product links. A button shows only when its link is filled. */
  products: [
    { name: 'Coco Peat', category: 'Coco Peat', image: 'assets/eco-leaves.svg', text: '', amazon: '', shopify: '' },
    { name: 'Printed T-Shirts', category: 'Garments', image: 'assets/logo.png', text: '', amazon: '', shopify: '' },
    { name: 'Clergy Apparels', category: 'Clergy Apparels', image: 'assets/clergy-dialogue.jpg', text: '', amazon: '', shopify: '' }
  ],

  /* ---- OUR MISSIONS & IMPACT: live statistics ----
     Add real numbers here (or set config.statsUrl to a JSON feed with the same shape).
     Example: { value: 1500, label: 'People helped', suffix: '+' } */
  figures: [
    { value: 2, label: 'Active missions' },
    { value: 2004, label: 'Serving since', plain: true }
  ],

  /* ---- NEWS (Home + Media), newest first ---- */
  news: [
    { tag: 'Conferences', title: 'WEMA Global International Conference, May 21–30, 2027',
      text: 'Delegate registration, sponsors, exhibitors and virtual participation. Dates and location will be announced.',
      image: 'assets/assembly-hall.jpg', href: 'conferences.html' },
    { tag: 'WITS', title: 'WITS accreditation: In Process (TRACS, ATS, ABHE)',
      text: 'The WEMA Institute of Theological Studies is working through its accreditation process.',
      image: 'assets/wits-classroom.jpg', href: 'wits.html' },
    { tag: 'WEMA', title: 'World Episcopal Missionary Alliance Inc. is a USA Registered Organization',
      text: 'Registered in Sheridan, Wyoming, USA.',
      image: 'assets/leaders-group.jpg', href: 'about.html' }
  ],

  /* ---- PROJECTS listings. Empty until the first projects are published. ----
     { id, title, org, country, summary, image, status } */
  projects: []
};
