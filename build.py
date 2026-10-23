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
INITIATIVES = [('WEMA Servants', 'servants.html'), ('WEMA Project Fund', 'crowdfund.html'), ('WEMA Global Directory', 'directory.html'),
               ('WEMA Academy', 'academy.html'), ('WEMA Global Episcopal Alliance', 'alliance.html')]
EVENTS = [('WEMA Global Leadership Conference', 'conferences.html'), ('Mission Leaders Programs', 'mission-leaders-programs.html'), ('Missionary Orientation', 'missionary-orientation.html'),
          ('Vision 2030 Introduction Programme', 'vision-2030.html'), ('WEMA Prayer Warrior Team', 'prayer-warrior-team.html')]
EXPLORE = [('About Us', 'about.html'), ('Partners', 'partners.html'), ('WEMA Store', 'store.html'), ('Contact Us', 'contact.html')]
NAV = [
 ('home', 'Home', 'index.html', []),
 ('initiatives', 'Our Initiatives', 'initiatives.html', INITIATIVES),
 ('events', 'Events', 'events.html', EVENTS),
 ('explore', 'Explore', 'about.html', EXPLORE),
 ('contact', 'Contact', 'contact.html', []),
]
POLICIES = [('Privacy Policy', 'privacy-policy.html'), ('Terms of Use', 'terms-of-use.html'), ('Membership Terms', 'membership-terms.html'),
            ('Payment and Fees Policy', 'payment-fees-policy.html'), ('Refund/Cancellation Policy', 'refund-cancellation-policy.html'),
            ('Project Submission Disclaimer', 'project-submission-disclaimer.html'), ('Directory Listing Terms', 'directory-listing-terms.html'),
            ('Academy/Course Terms', 'academy-course-terms.html'), ('Conference/Event Terms', 'conference-event-terms.html'),
            ('Cookie Policy', 'cookie-policy.html'), ('Code of Conduct', 'code-of-conduct.html'), ('Corporate/Legal Information', 'corporate-legal-information.html')]
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
    <div class="tb-left"></div>
    <div class="tb-right">
      <div class="lang"><button class="lang-btn" type="button" aria-haspopup="true" aria-expanded="false" aria-label="Language">{GLOBE}<span class="lang-current">English</span><svg width=10 height=10 viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1.5l5 5 5-5"/></svg></button><div class="lang-menu" role="menu"></div></div>
      <a href="dashboard.html">My Dashboard</a>
    </div>
  </div></div>
  <div class="mainbar"><div class="container">
    <a class="brand" href="index.html" aria-label="{SITE}"><img src="assets/logo.png" alt="WEMA logo" width="58" height="58"><span><b>{SITE}</b><small>{SLOGAN}</small></span></a>
    <nav aria-label="Primary"><ul class="nav">
{chr(10).join(items)}
    </ul></nav>
    <div class="head-cta"><a class="btn btn-outline btn-sm btn-login" href="login.html">Login</a><a class="btn btn-gold btn-sm" href="register.html">Create Account</a>
      <button class="burger" aria-label="Menu" aria-expanded="false"><span></span></button></div>
  </div></div>
</header>
<div class="drawer" aria-label="Menu">
{chr(10).join(drawer)}
  <div class="d-actions"><a class="btn btn-gold" href="register.html">Create Account</a><a class="btn btn-outline" href="login.html">Login</a><a class="btn btn-outline" href="dashboard.html">My Dashboard</a></div>
  <div class="d-lang">{langs_d}</div>
</div>'''

def footer():
    ini = ''.join('<li><a href="%s">%s</a></li>' % (h, esc(t)) for t, h in INITIATIVES)
    exp = ''.join('<li><a href="%s">%s</a></li>' % (h, esc(t)) for t, h in [('About Us', 'about.html'), ('Partners', 'partners.html'), ('WEMA Store', 'store.html'), ('Events', 'events.html'), ('Contact Us', 'contact.html')])
    pol = ''.join('<li><a href="%s">%s</a></li>' % (h, esc(t)) for t, h in POLICIES)
    return f'''<footer class="site-foot">
  <div class="container app-strip">
    <div><b>WEMA Global on your phone</b><span>Add the website to your home screen and use it like an app.</span></div>
    <div class="app-btns"><button class="btn btn-gold btn-sm" type="button" id="installBtn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 11l5 5 5-5M4 20h16"/></svg> Add to Home Screen</button></div>
  </div>
  <div class="container foot-top">
    <div class="foot-brand">
      <img src="assets/logo.png" alt="WEMA logo" width="92" height="92" loading="lazy">
      <b>{SITE}</b><span class="tag">{SLOGAN}</span>
      <p>Connecting people, ministries, organizations and communities through service, learning, leadership development and collaborative initiatives.</p>
    </div>
    <div><h4>Initiatives</h4><ul>{ini}</ul></div>
    <div><h4>Explore</h4><ul>{exp}</ul></div>
    <div><h4>Policies</h4><ul>{pol}</ul></div>
    <div><h4>Contact</h4><ul><li><a href="contact.html" data-cfg="email" data-cfg-type="mail">Contact Us</a></li></ul></div>
  </div>
  <div class="container foot-legal">
    <p>WEMA Global does not guarantee approval, funding, admission, credentials, certificates or any particular outcome.</p>
  </div>
  <div class="container foot-bottom">
    <span>© <span data-year>2026</span> WEMA Global. All rights reserved.</span>
    <nav aria-label="Legal"><a href="privacy-policy.html">Privacy Policy</a><a href="terms-of-use.html">Terms of Use</a><a href="#" data-open-cookie>Cookie preferences</a></nav>
  </div>
</footer>
<button class="to-top" aria-label="Back to top"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button>
<div class="modal" id="iosHelp" role="dialog" aria-modal="true" aria-labelledby="ios-t"><div class="modal-box"><button class="modal-close" aria-label="Close">×</button><h3 id="ios-t">Add to Home Screen</h3><p>iPhone / iPad (Safari): tap Share, then Add to Home Screen.</p><p>Android (Chrome): open the menu, then Install app.</p><p>Computer (Chrome / Edge): click the install icon in the address bar.</p></div></div>
<div class="cookie" role="dialog" aria-label="Cookie preferences">
  <h4>Cookie preferences</h4>
  <p>Necessary cookies keep the site working. Optional cookies stay off unless you allow them. See our <a href="privacy-policy.html#cookies" style="text-decoration:underline">Privacy Policy</a>.</p>
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
<link rel="stylesheet" href="assets/css/style.css?v=4">
</head>
<body{bcls}>
{header(meta.get('nav', ''))}
<main id="main">
{re.sub(r'<!--.*?-->', '', body, flags=re.S).strip()}
</main>
{footer()}
<script src="assets/js/site-data.js" defer></script>
<script src="assets/js/render.js" defer></script>
<script src="assets/js/main.js?v=4" defer></script>
</body>
</html>
'''

def main():
    n = 0
    for f in sorted(glob.glob(os.path.join(SRC, '*.html'))):
        meta, body = parse(f)
        out = os.path.join(ROOT, os.path.basename(f))
        open(out, 'w', encoding='utf-8').write(page(meta, body)); n += 1
    print('built %d pages' % n)

if __name__ == '__main__':
    main()
