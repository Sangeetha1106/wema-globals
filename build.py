#!/usr/bin/env python3
"""WEMA Global site builder.
Source pages live in src/pages/*.html (a small front-matter block + the page body).
This script wraps each body with the shared header, navigation, footer, cookie bar and scripts,
and writes the finished pages into the site root.   Usage:  python3 build.py
Front matter keys:  title, desc, nav (home|about|initiatives|membership|events|store|contact), body (css class), og (image)
"""
import os, re, glob, html
ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'src', 'pages')
SITE = 'WEMA Global'
SLOGAN = 'Together Makes a Difference'

ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
CARET = '<svg class="caret" viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 1.5l5 5 5-5"/></svg>'
GLOBE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19"/><ellipse cx="12" cy="12" rx="4.2" ry="9.5"/></svg>'

# ---- Navigation (single source of truth) ----
NAV = [
 ('home', 'Home', 'index.html', []),
 ('about', 'About Us', 'about.html', [('Our Story', 'about.html#story'), ('Vision & Mission', 'about.html#vision'), ('Leadership & Governance', 'about.html#leadership')]),
 ('initiatives', 'Our Initiatives', 'index.html#initiatives', [('WEMA Servants', 'servants.html'), ('WEMA Crowdfund', 'crowdfund.html'), ('WEMA Academy', 'academy.html'), ('WEMA Global Directory', 'directory.html'), ('WEMA Global Episcopal Alliance', 'alliance.html')]),
 ('membership', 'Membership', 'membership.html', [('Membership Overview', 'membership.html'), ('Membership Benefits', 'membership-benefits.html'), ('Register', 'register.html'), ('Login', 'login.html')]),
 ('events', 'Events', 'conferences.html', [('WEMA Global Leadership Conference', 'conferences.html'), ('Upcoming Events', 'events.html')]),
 ('store', 'Store', 'store.html', []),
 ('contact', 'Contact', 'contact.html', []),
]
INITIATIVES = NAV[2][3]
POLICIES = [('Privacy Policy', 'privacy-policy.html'), ('Terms & Conditions', 'terms-and-conditions.html'), ('Membership Policy', 'membership-policy.html'),
            ('Refund & Cancellation Policy', 'refund-policy.html'), ('Cookie Policy', 'cookie-policy.html'), ('Disclaimer', 'disclaimer.html'),
            ('Crowdfunding Policy', 'crowdfunding-policy.html'), ('Code of Conduct', 'code-of-conduct.html')]
LANGS = [('en', 'English'), ('es', 'Español'), ('fr', 'Français'), ('de', 'Deutsch'), ('pt', 'Português'), ('it', 'Italiano'), ('nl', 'Nederlands'),
         ('pl', 'Polski'), ('ru', 'Русский'), ('uk', 'Українська'), ('sv', 'Svenska'), ('el', 'Ελληνικά'), ('ro', 'Română')]

def esc(s): return html.escape(s, quote=True)

def header(active):
    items = []
    for key, label, href, subs in NAV:
        cur = ' aria-current="page"' if key == active else ''
        if subs:
            dd = ''.join('<a href="%s">%s</a>' % (h, esc(t)) for t, h in subs)
            items.append('<li class="has-drop"><a href="%s"%s>%s %s</a><div class="dropdown">%s</div></li>' % (href, cur, esc(label), CARET, dd))
        else:
            items.append('<li><a href="%s"%s>%s</a></li>' % (href, cur, esc(label)))
    drawer = []
    for key, label, href, subs in NAV:
        drawer.append('<a class="d-link" href="%s">%s</a>' % (href, esc(label)))
        drawer += ['<a class="d-sub" href="%s">%s</a>' % (h, esc(t)) for t, h in subs]
    langs_d = ''.join('<button type="button" data-code="%s">%s</button>' % l for l in LANGS)
    return f'''<a class="skip" href="#main">Skip to content</a>
<header class="site-head">
  <div class="topbar"><div class="container">
    <div class="tb-left"><span>USA Registered Organization · Sheridan, Wyoming</span></div>
    <div class="tb-right">
      <div class="lang"><button class="lang-btn" type="button" aria-haspopup="true" aria-expanded="false" aria-label="Language">{GLOBE}<span class="lang-current">English</span><svg width=10 height=10 viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1.5l5 5 5-5"/></svg></button><div class="lang-menu" role="menu"></div></div>
    </div>
  </div></div>
  <div class="mainbar"><div class="container">
    <a class="brand" href="index.html" aria-label="{SITE}"><img src="assets/logo.png" alt="WEMA logo" width="58" height="58"><span><b>{SITE}</b><small>{SLOGAN}</small></span></a>
    <nav aria-label="Primary"><ul class="nav">
{chr(10).join(items)}
    </ul></nav>
    <div class="head-cta"><a class="btn btn-outline btn-sm btn-login" href="login.html">Login</a><a class="btn btn-gold btn-sm" href="register.html">Become a Member</a>
      <button class="burger" aria-label="Menu" aria-expanded="false"><span></span></button></div>
  </div></div>
</header>
<div class="drawer" aria-label="Menu">
{chr(10).join(drawer)}
  <div class="d-actions"><a class="btn btn-gold" href="register.html">Become a Member</a><a class="btn btn-outline" href="login.html">Login</a></div>
  <div class="d-lang">{langs_d}</div>
</div>'''

def footer():
    ini = ''.join('<li><a href="%s">%s</a></li>' % (h, esc(t)) for t, h in INITIATIVES)
    quick = ''.join('<li><a href="%s">%s</a></li>' % (h, esc(l)) for k, l, h, s in NAV)
    quick = quick.replace('index.html#initiatives', 'index.html#initiatives')
    pol = ''.join('<li><a href="%s">%s</a></li>' % (h, esc(t)) for t, h in POLICIES)
    sup = ''.join('<li><a href="%s">%s</a></li>' % (h, esc(t)) for t, h in [('Membership Benefits', 'membership-benefits.html'), ('Register', 'register.html'), ('Login', 'login.html'),
          ('Submit a Project', 'crowdfund.html#submit-project'), ('Apply to Become a Partner', 'directory.html#partner-apply'), ('Contact Support', 'contact.html')])
    return f'''<footer class="site-foot">
  <div class="container app-strip">
    <div><b>WEMA Global on your phone</b><span>Add the website to your home screen and use it like an app.</span></div>
    <div class="app-btns"><button class="btn btn-gold btn-sm" type="button" id="installBtn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 11l5 5 5-5M4 20h16"/></svg> Add to Home Screen</button>
      <a class="btn btn-outline btn-sm" data-app="ios" href="#" hidden>App Store</a><a class="btn btn-outline btn-sm" data-app="android" href="#" hidden>Google Play</a></div>
  </div>
  <div class="container foot-top">
    <div class="foot-brand">
      <img src="assets/logo.png" alt="WEMA logo" width="92" height="92" loading="lazy">
      <b>{SITE}</b><span class="tag">{SLOGAN}</span>
      <p>WEMA Global is a platform designed to encourage service, learning, collaboration and meaningful connections across communities and organizations.</p>
      <div class="socials" aria-label="Social media">
        <a href="#" data-social="linkedin" aria-label="LinkedIn" hidden><b>in</b></a><a href="#" data-social="x" aria-label="X" hidden><b>X</b></a><a href="#" data-social="facebook" aria-label="Facebook" hidden><b>f</b></a><a href="#" data-social="instagram" aria-label="Instagram" hidden><b>ig</b></a><a href="#" data-social="youtube" aria-label="YouTube" hidden><svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg></a><a href="#" data-social="whatsapp" aria-label="WhatsApp" hidden><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/></svg></a>
      </div>
    </div>
    <div><h4>Quick Links</h4><ul>{quick}</ul></div>
    <div><h4>Our Initiatives</h4><ul>{ini}</ul></div>
    <div><h4>Membership &amp; Support</h4><ul>{sup}</ul></div>
    <div><h4>Policies</h4><ul>{pol}</ul></div>
  </div>
  <div class="container foot-legal">
    <p><b>World Episcopal Missionary Alliance Inc.</b>, USA Registered Organization · 30 N Gould St, Ste R, Sheridan, WY 82801, USA. <span data-cfg="email" data-cfg-type="mail"></span> <span data-cfg="phone" data-cfg-type="tel"></span></p>
    <p>WEMA Global is a facilitation and networking platform. It does not guarantee funding, grants, employment, admission, accreditation, ordination, partnership approval, investment or any specific outcome.</p>
  </div>
  <div class="container foot-bottom">
    <span>© <span data-year>2026</span> WEMA Global. All rights reserved.</span>
    <nav aria-label="Legal"><a href="#" data-open-cookie>Cookie preferences</a></nav>
  </div>
</footer>
<button class="to-top" aria-label="Back to top"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button>
<div class="modal" id="iosHelp" role="dialog" aria-modal="true" aria-labelledby="ios-t"><div class="modal-box"><button class="modal-close" aria-label="Close">×</button><h3 id="ios-t">Add to Home Screen</h3><p>iPhone / iPad (Safari): tap Share, then Add to Home Screen.</p><p>Android (Chrome): open the menu, then Install app.</p><p>Computer (Chrome / Edge): click the install icon in the address bar.</p></div></div>
<div class="cookie" role="dialog" aria-label="Cookie preferences">
  <h4>Cookie preferences</h4>
  <p>Necessary cookies keep the site working. Optional cookies stay off unless you allow them. See our <a href="cookie-policy.html" style="text-decoration:underline">Cookie Policy</a>.</p>
  <div class="opts">
    <label>Necessary <span class="switch"><input type="checkbox" checked disabled aria-label="Necessary"><span></span></span></label>
    <label>Analytics <span class="switch"><input type="checkbox" aria-label="Analytics"><span></span></span></label>
    <label>Marketing <span class="switch"><input type="checkbox" aria-label="Marketing"><span></span></span></label>
    <label>Third-party <span class="switch"><input type="checkbox" aria-label="Third-party"><span></span></span></label>
  </div>
  <div class="btns"><button class="btn btn-gold btn-sm" data-ck="accept">Accept all</button><button class="btn btn-outline-dark btn-sm" data-ck="necessary">Necessary only</button><button class="btn btn-outline-dark btn-sm" data-ck="custom">Customize</button><button class="btn btn-outline-dark btn-sm" data-ck="save" hidden>Save preferences</button></div>
</div>'''

def parse(path):
    raw = open(path, encoding='utf-8').read()
    m = re.match(r'---\n(.*?)\n---\n(.*)', raw, re.S)
    meta, body = {}, raw
    if m:
        for line in m.group(1).splitlines():
            if ':' in line:
                k, v = line.split(':', 1); meta[k.strip()] = v.strip()
        body = m.group(2)
    return meta, body

def page(meta, body):
    title = meta.get('title', SITE)
    full = SITE if title == SITE else '%s | %s' % (title, SITE)
    desc = meta.get('desc', SLOGAN)
    og = meta.get('og', 'assets/leaders-group.jpg')
    bcls = (' class="%s"' % meta['body']) if meta.get('body') else ''
    return f'''<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(full)}</title>
<meta name="description" content="{esc(desc)}">
<meta property="og:title" content="{esc(full)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:image" content="{og}">
<meta property="og:type" content="website">
<meta name="theme-color" content="#3B0A45">
<link rel="icon" type="image/png" href="assets/favicon.png">
<link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="{SITE}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body{bcls}>
{header(meta.get('nav', ''))}
<main id="main">
{body.strip()}
</main>
{footer()}
<script src="assets/js/site-data.js" defer></script>
<script src="assets/js/render.js" defer></script>
<script src="assets/js/main.js?v=3" defer></script>
</body>
</html>
'''

# Old file names that now point to the new structure (kept so earlier links do not break)
REDIRECTS = {'partners.html': 'directory.html#ngo-partners', 'wits.html': 'academy.html', 'terms-of-use.html': 'terms-and-conditions.html',
             'summit2027.html': 'conferences.html', 'media.html': 'index.html'}

def main():
    n = 0
    for f in sorted(glob.glob(os.path.join(SRC, '*.html'))):
        meta, body = parse(f)
        out = os.path.join(ROOT, os.path.basename(f))
        open(out, 'w', encoding='utf-8').write(page(meta, body)); n += 1
    for old, new in REDIRECTS.items():
        open(os.path.join(ROOT, old), 'w', encoding='utf-8').write(
            '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Redirecting | WEMA Global</title>'
            '<meta http-equiv="refresh" content="0; url=%s"><link rel="canonical" href="%s"></head>'
            '<body><p>This page has moved. <a href="%s">Continue</a>.</p></body></html>' % (new, new, new))
    print('built %d pages + %d redirects' % (n, len(REDIRECTS)))

if __name__ == '__main__':
    main()
