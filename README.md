# WEMA Global — Website (front end)

Open `index.html`, or upload this folder to any web host (HTTPS recommended for the app/PWA features).

## Edit without touching layouts
`assets/js/site-data.js` → contact details, social links, payment links, banners, Store product links, Missions & Impact figures, news, projects.

## Languages
13 European languages (en, es, fr, de, pt, it, nl, pl, ru, uk, sv, el, ro). Translations live in `assets/lang/<code>.js` (English text → translation) and are compiled from `tools/translations/<code>.txt` with `python3 tools/build_lang.py`. Review with native speakers before launch.
If you change any English wording in `src/pages`, re-run `python3 build.py` and add the new English text to the translation files; missing entries safely fall back to English.

## Structure
- `*.html` – built pages (source in `src/pages`, shared header/footer in `build.py`; run `python3 build.py`)
- `assets/logo.png` – transparent logo (header, footer, app icon)
- `assets/*.jpg` – supplied photos (some show other events' branding; replace with WEMA photos)
- `email-templates/` – automatic email designs
- `docs/IMPLEMENTATION-PLAN.md` – point-by-point confirmation of the instructions
- `manifest.webmanifest`, `sw.js` – installable app (PWA)

## Not included (server phase)
Real login, Stripe/PayPal processing, email sending, CMS/admin screens, database. Forms and checkout in this build are the finished front end and redirect to the confirmation page.
