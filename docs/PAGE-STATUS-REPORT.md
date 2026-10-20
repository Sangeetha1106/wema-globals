# WEMA Global — Page-by-Page Status Report
Reference: Front-End UI Master Script, Version 1.0 (Tamil explanation + English developer copy).

Legend: **DONE** = built to the master script · **PREVIEW** = front end works, backend not connected · **WEMA INPUT** = needs content/decision from WEMA.

## Global elements
| Item | Status | Notes |
|---|---|---|
| Brand "WEMA Global", slogan "Together Makes a Difference" | DONE | Used on every page. The wrong spelling "WEMAX" is removed everywhere. |
| Header (all pages) | DONE | Menu: Home · About Us · Our Initiatives · Membership · Events · Store · Contact, with the approved sub-menus; buttons Login and Become a Member; hamburger menu on tablet/phone. |
| Footer (all pages) | DONE | 5 columns exactly as specified; © [Current Year] WEMA Global. All rights reserved. Social icons stay hidden until real links are added. |
| Single USD $199 membership fee | DONE | Shown as one overall fee. No per-initiative fees anywhere. |
| Public pages readable without membership | DONE | No login wall on any information page. |
| Inner-page template | DONE | Breadcrumb → title → intro → main sections → how it works → eligibility → approved fees → FAQ → CTAs → related links. |
| Honest labelling of unfinished features | DONE | Forms carry a "Preview note"; no page says payment, email or login is live. |

## Pages
| Page | Status | Notes |
|---|---|---|
| index.html (Home) | DONE | All 13 sections in the approved order. Hero is a single uncluttered slide. |
| about.html | DONE | Our Story, Vision & Mission, Leadership & Governance, Global Presence map. WEMA INPUT: final story text and leadership details. |
| membership.html / membership-benefits.html | DONE | Overview, steps, separate-charges explanation, FAQ; proposed benefits with the "no guarantee" note. |
| servants.html · crowdfund.html · academy.html · directory.html · alliance.html | DONE (content) · PREVIEW (forms) | Approved taglines/descriptions only. No invented fees, accreditation, ordination or listings. Directory includes NGO & Nonprofit Partners as a subcategory. WEMA INPUT: detailed content for each page. |
| conferences.html / events.html | DONE | "Conference details to be announced" until WEMA confirms. WEMA INPUT: date, venue, programme, speakers, fees. |
| store.html | DONE | Product preview from `site-data.js`; buy buttons appear only when a verified Amazon/Shopify link is entered. No checkout. WEMA INPUT: product links, prices, descriptions. |
| contact.html | DONE · PREVIEW | WEMA INPUT: official email and phone. |
| register.html / login.html / dashboard.html | PREVIEW | Layout complete. No real account, payment or login yet. |
| thank-you.html | DONE | Messages never claim a payment or email was completed. |
| donate.html | KEPT, not in menu | Not in the master script. Kept from the earlier brief; reachable from the Contact page only. WEMA to decide. |
| 8 policy pages (Privacy, Terms & Conditions, Membership, Refund & Cancellation, Cookie, Disclaimer, Crowdfunding, Code of Conduct) | DONE (layout + outline) | Marked as draft outlines. WEMA INPUT + legal review: final wording, refund rules per category, membership validity/renewal. |
| 404 / offline | DONE | |

## Backend features NOT yet functional
Stripe and PayPal payments · member accounts and login · database and saved submissions · file uploads · sending emails (templates are ready in `email-templates/`) · admin review/approval · certificates, IDs, QR passes · live translation of the new wording.

## Removed because WEMA has not confirmed it (per the master script)
Per-initiative fees ($99 Alliance, $49 profile claim, $50 credit bundle, $199 application fees) · "strictly non-refundable" statements · accreditation claims (TRACS/ATS/ABHE) · ordination and visa-letter promises · conference dates, ticket prices, tour packages · sample directory listings · scholarship claims · course lists.
