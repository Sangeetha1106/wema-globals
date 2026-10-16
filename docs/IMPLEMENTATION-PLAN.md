# WEMA Global — Point-by-point confirmation (Consolidated Instructions)

**Legend.** DONE = built and tested in this front end. BACKEND = needs the server phase (database, CMS, gateways) and is not in this zip.

## 1. Terminology & content
| Instruction | Status | Detail |
|---|---|---|
| "USA Registered Organization" everywhere; remove the word "based" | DONE | Top bar, About, footer, legal pages, news and meta text now say "USA Registered Organization" with World Episcopal Missionary Alliance Inc., Sheridan, Wyoming, 30 N Gould St, Ste R, Sheridan, WY 82801, USA. A search of every page and script finds no "based" / "USA-based". |
| Remove dummy data | DONE | No "Sample listing", no "0 Languages" (counters show real values from first paint), no Lorem Ipsum. Where real data does not exist yet (projects, speakers, schedule, prices) the page says so plainly. |
| WITS accreditation "In Process (TRACS, ATS, ABHE)" | DONE | WITS hero area, an Accreditation block (each body marked In Process), homepage news, footer, Terms. |

## 2. Menu & navigation
| Instruction | Status | Detail |
|---|---|---|
| Exactly 10 menu items | DONE | HOME · ABOUT WEMA · WEMA SERVANTS · PARTNERS · PROJECTS · WITS · STORE · CONFERENCES · MEDIA · CONTACT. No dropdowns, no other names. Collapses to a drawer menu on tablets and phones. |
| 13 European languages in the top utility bar | DONE | English, Spanish, French, German, Portuguese, Italian, Dutch, Polish, Russian, Ukrainian, Swedish, Greek, Romanian. Top bar: Language switcher · WEMA Support Network · Login / Register. |
| Switching language translates the entire website | DONE | All visible text, form labels, placeholders, buttons, legal pages, the page title and the thank-you messages are translated (341 strings x 12 languages, in `assets/lang/`). Brand names stay in English. English is the fallback. Translations are first-pass and need review by native speakers before launch. |

## 3. Homepage
| Instruction | Status | Detail |
|---|---|---|
| Sliding ad banner (carousel) | DONE (front end) · BACKEND for CMS form | Slide 1 is the May 2027 conference with countdown. Slides 2-4 (WEMA Store, Missions, Sponsor/advertiser) come from `assets/js/site-data.js` → `banners` (type, image, text, buttons, start/end dates, on/off). The Admin console will write the same data. |
| Our Missions & Impact section | DONE (layout) · figures need real numbers | Homepage section for WEMA Missionaries and Alfa Omega Children's Home, with live statistics tiles fed from `figures` (or from a JSON feed at `config.statsUrl`). Neither mission website publishes beneficiary numbers, so only verified facts are shown (2 active missions, serving since 2004). **Please send the real numbers (people helped, etc.).** |
| Highlighted Donate / Make a Payment | DONE | Gold pulsing Donate button in the header on every page, a full-width Donate band under the hero, drawer button on mobile, and `donate.html`. |

## 4. Store
| Instruction | Status | Detail |
|---|---|---|
| Eco-Mission → WEMA Store | DONE | `store.html`; menu item STORE; product catalog (Coco Peat, Printed T-Shirts, Clergy Apparels). |
| No internal cart | DONE | No cart anywhere. Each product shows "Buy on Amazon" and/or "Buy on Shopify" only when you paste the link into `site-data.js` → `products`; until then it says "Coming soon on Amazon and Shopify". Product photos/descriptions are also filled there. |

## 5. Global presence
| Instruction | Status | Detail |
|---|---|---|
| Interactive Global Map in ABOUT WEMA and PARTNERS (and homepage) | DONE | World map with USA, Canada, Europe and India highlighted and pinned (hover or tap a pin or the region buttons). USA pin is Sheridan, Wyoming. |

## 6. Payments, automation, legal checkout
| Instruction | Status | Detail |
|---|---|---|
| Stripe (USD) or PayPal only | DONE (UI) · BACKEND for live gateways | Checkout offers only Card (Stripe) and PayPal, in USD. No Razorpay or Indian gateway anywhere. Server integration: Stripe Checkout + webhooks, PayPal Orders + webhooks. |
| Mandatory non-refundable checkbox on ALL checkout pages | DONE | Exact text: "I agree that all payments and fees are strictly non-refundable and are considered as a final donation towards the missions and operations of WEMA Global." The pay button stays disabled until it is ticked. Present on: Donate / Make a Payment, Conference Delegate Registration, WITS Fee Payment, WEMA Servants Member Registration. A note says the English text applies if a translation differs. |
| Automatic confirmation emails and receipts | Templates DONE · BACKEND to send | Branded HTML templates in `email-templates/` (registration, payment receipt, conference confirmation, auto-reply, conference reminder, monthly reminder). Flow: gateway webhook → record → instant confirmation + receipt + auto-reply → scheduled reminders. The thank-you page already tells users what is sent. |

## 7. App & policies
| Instruction | Status | Detail |
|---|---|---|
| PWA / Add to Home Screen | DONE | Manifest, icons, service worker, offline page, and an "Add to Home Screen" button in the footer (iOS gets step-by-step help). Needs HTTPS in production. |
| Legal footer + real policies | DONE | Footer names World Episcopal Missionary Alliance Inc. (USA Registered Organization) with the address. Privacy Policy, Terms of Use and a Strict Refund Policy are separate pages, linked in the footer. Final wording should be reviewed by a US lawyer. |
| Editable contact details & social icons | DONE (file) · BACKEND for CMS screen | `site-data.js` → `config`: email, phone, WhatsApp, address, social links, payment links, app links. Empty values show "coming soon" and hide social icons, so they update the moment you fill them in. |

## Pages in this build (19)
Home, About WEMA, WEMA Servants (with Digital ID Card format WEMA-SRV-[YEAR]-[SEQUENCE]), Partners, Projects (incl. the Facilitation Bridge), WITS, Store, Conferences, Media, Contact, Donate / Make a Payment, Login, Register, Thank you, Privacy Policy, Terms of Use, Refund Policy, 404, Offline.

## Timing
Front end (this zip): delivered. Backend, in the SOW's order: foundation (accounts, roles, CMS, security) → payments and automation (Stripe, PayPal, webhooks, emails, receipts, reminders) → Servants, Partners, Projects, WITS → Conferences (passes, QR, certificates) → live translation management, analytics, testing and launch. Dates depend on the agreed schedule.
