# WEMA Global — Compliance report: website vs. “Tamil Developer Instructions + Copy-Paste Content”

Legend: **DONE** built in this front end · **PREVIEW** front end only, backend not connected · **HELD** deliberately not published until WEMA confirms.

| Doc page | Status | Where / notes |
|---|---|---|
| 1 Header & menu | DONE | Home · My Initiatives · Events · Explore · Contact, with the 3 dropdowns; Login · Create Account · My Dashboard; slogan “Together makes difference” (exact wording from the document). |
| 2 Home | DONE | Hero → Welcome → Our Initiatives → Events and Programs → Membership → Our Partners → closing CTA → footer. |
| 3 My Initiatives | DONE | initiatives.html |
| 4 WEMA Servants | DONE · PREVIEW | 3 separate paths (Volunteer, Funder, Seeker/NGO), each with its own button and form. |
| 5 WEMA Crowd Funding | DONE · PREVIEW | Sections “Project Submission” and “Funding Opportunities”; no “Project Directory” label; form with contact, website/social, budget and uploads. |
| 6 WEMA Global Directory | DONE · PREVIEW | 5 categories, application form with public-display consent, listing disclaimer. Admin statuses are in `docs/BACKEND-REQUIREMENTS.md`. |
| 7 WEMA Academy | DONE · PREVIEW | 4 program areas, the 3 collaboration institutions exactly as worded, course disclaimer, application form. No accreditation claim. |
| 8 Episcopal Alliance | DONE · PREVIEW | No guarantee of credentials/ordination/certification. |
| 9 Events landing | DONE | events.html + one page per programme. |
| 10 Global Leadership Conference | DONE · PREVIEW · HELD | “May 21–30 | New Jersey, USA” is kept as a comment in `src/pages/conferences.html` and is **not published** (year/venue unconfirmed). |
| 11 Partners | DONE · PREVIEW · HELD | Cards come from `assets/js/site-data.js → partners` (empty until authorized). |
| 12 WEMA Store | DONE · PREVIEW | Catalogue, cart and checkout labels as given. Products and prices are edited in `site-data.js → products`. A product without a price cannot be added to the cart. |
| 13 About Us | DONE · HELD | Legal-name block withheld until verified incorporation details are supplied (comment in `src/pages/about.html`). |
| 14 Leadership | DONE · HELD | Editable via `site-data.js → leaders`. The internal review list is in `docs/INTERNAL-LEADERSHIP-REVIEW.md` and is **not** on the site. |
| 15 Membership | DONE · PREVIEW | USD $199 per year, voluntary, auto-renewal off. No “donation” / “non-refundable” wording. Success/failed messages: `thank-you.html?type=membership_success` / `membership_failed`. |
| 16 Login, Dashboard | DONE · PREVIEW | Tabs: My Applications, My Membership, My Payments, My Profile, Support; application / payment / membership statuses kept separate. |
| 17 Email templates | DONE | `email-templates/` (5 templates, exact wording, no card details requested). Sending = backend. |
| 18 Footer & policies | DONE · HELD | All 9 policy pages exist as **draft outlines** for legal review. Contact email stays blank until verified (shows “Contact Us”). |
| 19 Forms, privacy, security | PREVIEW | See `docs/BACKEND-REQUIREMENTS.md`. |
| 20 Final checklist | see below | |

## Client additions (WhatsApp, 22 Oct)
1. **501(c)(3) notice (checkout / membership page)** — membership.html (above the checkout form), plus Membership Terms and Payment and Fees Policy. Wording as supplied (“WEMA Global” capitalised).
2. **501(c)(3) short notice (footer)** — every page footer and the email-template footers.
3. **Isaiah 11:12** — first slide of the home page: “A banner for the nations.” / “Bringing our people together from the four corners of the earth.” / “Isaiah 11:12”. The text floats gently, the highlighted words glow/pulse, and the slide rotates with the second hero slide (pause button available; motion is switched off for visitors who prefer reduced motion).

## Final checklist (doc page 20)
1 Header/menus/footer on desktop & mobile — DONE (tested) · 2 Five initiatives with links — DONE · 3 No “Project Directory” label — DONE · 4 Crowd Funding & Directory forms collect org/contact/website/social — DONE · 5 Directory published only after admin approval — BACKEND · 6 Membership voluntary, USD $199/year — DONE · 7 Fees separate and disclosed — DONE · 8 Separate statuses — DONE (UI) · 9 No unverified accreditation — DONE · 10 Conference year/venue, contacts, corporate details, leadership, partner roles confirmed — HELD · 11 Emails, payment links, reference numbers — BACKEND (preview reference shown) · 12 Privacy/security/accessibility — partly DONE; security = BACKEND.
