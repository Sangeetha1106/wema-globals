# WEMA Global — Website (front end)

Open `index.html`, or upload this folder to any web host (HTTPS recommended for the app/PWA features).
This build follows the client's **Tamil Developer Instructions + Copy-Paste Content** document (Oct 2026) plus the 501(c)(3) notices and the Isaiah 11:12 opening banner. See `docs/DOCUMENT-COMPLIANCE-REPORT.md` for the page-by-page status and `docs/BACKEND-REQUIREMENTS.md` for what still needs a server.

## How the site is built
- Page sources are in `src/pages/*.html` (small front-matter block + page body).
- The shared header, navigation, footer, cookie bar and scripts are in `build.py`.
- After editing anything in `src/pages` or the menu/footer in `build.py`, run `python3 build.py` to regenerate the finished pages in the root folder.

## Edit without touching layouts
`assets/js/site-data.js` → contact details (email, phone, address), social links, store products (name, price, shipping, tax), leadership profiles, partner cards, optional homepage slides.
Empty values show "coming soon" or hide the icon, so only approved details are ever shown.

## When WEMA confirms event details
Open `src/pages/conferences.html`, move the held date line (HTML comment at the top) into the page once the year and exact venue are confirmed, then run `python3 build.py`. Do the same for the legal-name block in `src/pages/about.html`.

## Languages
13 languages (en, es, fr, de, pt, it, nl, pl, ru, uk, sv, el, ro). Dictionaries live in `assets/lang/<code>.js`, compiled from `tools/translations/<code>.txt` with `python3 tools/build_lang.py`.
**Important:** the existing translations were written for the earlier wording. The new master-script text will show in English until its strings are extracted (`python3 tools/extract_strings.py`) and translated. Missing entries safely fall back to English.

## Structure
- `*.html` – built pages (do not edit directly; edit `src/pages` and rebuild)
- `assets/` – CSS, JS, logo, icons, photos, language files
- `email-templates/` – automatic email designs (not sent until the server phase)
- `manifest.webmanifest`, `sw.js` – installable app (PWA)

## Not included (server phase)
Real login, Stripe/PayPal processing, email sending, file uploads, database, admin review screens. Forms in this build are the finished front end; they validate and then show a confirmation page, and they say so on the page ("Preview note").
