/* WEMA Global — front-end behaviour (vanilla JS).
   Full-site translation: every visible English text, placeholder, alt/aria text and the page title
   is looked up in assets/lang/<code>.js (English text -> translation). Missing entries fall back to English. */
(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- Header, back-to-top, drawer ---------- */
  const head = $('.site-head'), toTop = $('.to-top');
  function onScroll() {
    const y = window.scrollY;
    if (head) head.classList.toggle('scrolled', y > 40);
    if (toTop) toTop.classList.toggle('show', y > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
  const burger = $('.burger'), drawer = $('.drawer');
  function setDrawer(open) {
    if (!burger || !drawer) return;
    burger.setAttribute('aria-expanded', open); drawer.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) burger.addEventListener('click', () => setDrawer(burger.getAttribute('aria-expanded') !== 'true'));
  $$('.drawer a').forEach(a => a.addEventListener('click', () => setDrawer(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      setDrawer(false);
      $$('.modal.open,.lightbox.open').forEach(m => m.classList.remove('open'));
      $$('.lang.open').forEach(l => l.classList.remove('open'));
    }
  });

  // Handle links pointing to current page or anchor
  document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href === '#' || href.startsWith('javascript:') || a.target === '_blank') return;

    const currentFile = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const parts = href.split('#');
    const targetFile = parts[0];
    const targetHash = parts[1];
    const targetFileClean = (targetFile || currentFile).toLowerCase();

    if (targetFileClean === currentFile) {
      if (targetHash) {
        const el = document.getElementById(targetHash);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
          history.pushState(null, '', '#' + targetHash);
        }
      } else {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
        if (window.location.hash) {
          history.pushState(null, '', window.location.pathname + window.location.search);
        }
      }
    }
  });

  /* ==========================================================
     FULL-SITE LANGUAGE ENGINE (13 European languages)
     ========================================================== */
  const LANGS = [['en', 'English'], ['es', 'Español'], ['fr', 'Français'], ['de', 'Deutsch'], ['pt', 'Português'], ['it', 'Italiano'],
    ['nl', 'Nederlands'], ['pl', 'Polski'], ['ru', 'Русский'], ['uk', 'Українська'], ['sv', 'Svenska'], ['el', 'Ελληνικά'], ['ro', 'Română']];
  window.WEMA_I18N = window.WEMA_I18N || {};
  const norm = s => s.replace(/\s+/g, ' ').trim();
  const textMap = new WeakMap();          // text node -> { en, tr }
  const SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1 };
  const ATTRS = ['placeholder', 'alt', 'aria-label', 'title'];
  let current = 'en';

  function loadLang(code) {
    return new Promise(res => {
      if (code === 'en' || window.WEMA_I18N[code]) return res();
      const s = document.createElement('script');
      s.src = 'assets/lang/' + code + '.js'; s.onload = () => res(); s.onerror = () => res();
      document.head.appendChild(s);
    });
  }
  function translateAll() {
    const dict = current === 'en' ? null : (window.WEMA_I18N[current] || {});
    const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: n => (n.parentNode && !SKIP[n.parentNode.nodeName] && /\S/.test(n.nodeValue)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    });
    const nodes = []; while (tw.nextNode()) nodes.push(tw.currentNode);
    nodes.forEach(n => {
      const rec = textMap.get(n);
      const en = (rec && n.nodeValue === rec.tr) ? rec.en : n.nodeValue;
      if (!dict) { if (rec && n.nodeValue === rec.tr) { n.nodeValue = rec.en; textMap.delete(n); } return; }
      const tr = dict[norm(en)];
      if (tr) {
        const lead = en.match(/^\s*/)[0], trail = en.match(/\s*$/)[0];
        const out = lead + tr + trail;
        if (n.nodeValue !== out) n.nodeValue = out;
        textMap.set(n, { en, tr: out });
      } else if (rec && n.nodeValue === rec.tr) { n.nodeValue = rec.en; textMap.delete(n); }
    });
    $$('[placeholder],[alt],[aria-label],[title]').forEach(el => {
      ATTRS.forEach(a => {
        if (!el.hasAttribute(a)) return;
        const k = 'data-en-' + a;
        if (!el.hasAttribute(k)) el.setAttribute(k, el.getAttribute(a));
        const en = el.getAttribute(k), tr = dict && dict[norm(en)];
        el.setAttribute(a, tr || en);
      });
    });
    // page title and meta description
    const t = document.documentElement.dataset.enTitle || (document.documentElement.dataset.enTitle = document.title);
    const parts = t.split(' | '), tt = dict && dict[norm(parts[0])];
    document.title = (tt || parts[0]) + (parts[1] ? ' | ' + parts[1] : '');
    const md = $('meta[name="description"]');
    if (md) { if (!md.dataset.en) md.dataset.en = md.content; md.content = (dict && dict[norm(md.dataset.en)]) || md.dataset.en; }
  }
  window.WEMA_translate = translateAll;
  async function applyLang(code, persist) {
    if (!LANGS.some(l => l[0] === code)) code = 'en';
    await loadLang(code);
    current = code;
    translateAll();
    document.documentElement.lang = code;
    $$('.lang-current').forEach(el => el.textContent = (LANGS.find(l => l[0] === code) || LANGS[0])[1]);
    $$('.lang-menu button').forEach(b => b.setAttribute('aria-current', b.dataset.code === code));
    if (persist !== false) store.set('wema_lang', code);
    document.dispatchEvent(new CustomEvent('wema:lang', { detail: code }));
  }
  const langWrap = $('.lang');
  if (langWrap) {
    const menu = $('.lang-menu', langWrap);
    menu.innerHTML = LANGS.map(l => `<button type="button" data-code="${l[0]}" lang="${l[0]}">${l[1]}</button>`).join('');
    $('.lang-btn', langWrap).addEventListener('click', e => {
      e.stopPropagation(); const o = langWrap.classList.toggle('open'); $('.lang-btn', langWrap).setAttribute('aria-expanded', o);
    });
    menu.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { applyLang(b.dataset.code); langWrap.classList.remove('open'); } });
    document.addEventListener('click', e => { if (!langWrap.contains(e.target)) langWrap.classList.remove('open'); });
  }
  $$('.d-lang button').forEach(b => b.addEventListener('click', () => { applyLang(b.dataset.code); setDrawer(false); }));

  /* ---------- Reveal, counters, journey ---------- */
  function countUp(el) {
    if (el.dataset.done) return; el.dataset.done = 1;
    const end = parseFloat(el.dataset.count), suffix = el.dataset.suffix || '';
    const fmt = n => (el.dataset.plain ? String(n) : n.toLocaleString());
    if (reduce) { el.textContent = fmt(end) + suffix; return; }
    const t0 = performance.now();
    (function step(t) {
      const p = Math.min((t - t0) / 1600, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(end * eased)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      $$('[data-count]', en.target).forEach(countUp);
      io.unobserve(en.target);
    });
  }, { threshold: .08, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal,.journey,.stats').forEach(el => io.observe(el));
  if (reduce) $$('.reveal').forEach(el => el.classList.add('in'));

  /* ---------- Conference countdown (target set by data-countdown, CMS-controlled) ---------- */
  $$('[data-countdown]').forEach(cd => {
    const target = new Date(cd.dataset.countdown).getTime();
    const cells = { d: $('[data-cd=d] b', cd), h: $('[data-cd=h] b', cd), m: $('[data-cd=m] b', cd), s: $('[data-cd=s] b', cd) };
    const pad = n => String(n).padStart(2, '0');
    function tick() {
      const diff = Math.max(0, target - Date.now());
      const v = { d: Math.floor(diff / 864e5), h: Math.floor(diff % 864e5 / 36e5), m: Math.floor(diff % 36e5 / 6e4), s: Math.floor(diff % 6e4 / 1e3) };
      for (const k in v) {
        const txt = k === 'd' ? String(v[k]) : pad(v[k]);
        if (cells[k].textContent !== txt) { cells[k].textContent = txt; const p = cells[k].parentElement; p.classList.remove('tick'); void p.offsetWidth; p.classList.add('tick'); }
      }
    }
    tick(); setInterval(tick, 1000);
  });

  /* ---------- Tabs, map pins, lightbox ---------- */
  $$('[data-tabs]').forEach(group => {
    const btns = $$('.tabs button', group), panes = $$('.tab-pane', group);
    btns.forEach((b, i) => b.addEventListener('click', () => {
      btns.forEach(x => x.classList.toggle('active', x === b)); panes.forEach((p, j) => p.classList.toggle('active', j === i));
    }));
  });
  $$('.map-wrap').forEach(w => {
    const root = w.parentElement, pins = $$('.pin', root), chips = $$('.chip[data-pin]', root);
    const set = name => { pins.forEach(p => p.classList.toggle('active', p.dataset.name === name)); chips.forEach(c => c.classList.toggle('active', c.dataset.pin === name)); };
    chips.forEach(c => c.addEventListener('click', () => set(c.dataset.pin)));
    pins.forEach(p => p.addEventListener('click', () => set(p.dataset.name)));
  });
  const lb = $('.lightbox');
  if (lb) {
    $$('.gallery button').forEach(b => b.addEventListener('click', () => { $('img', lb).src = $('img', b).src; $('img', lb).alt = $('img', b).alt; lb.classList.add('open'); }));
    lb.addEventListener('click', e => { if (e.target === lb || e.target.closest('.lb-close')) lb.classList.remove('open'); });
  }
  $$('.modal').forEach(m => m.addEventListener('click', e => { if (e.target === m || e.target.closest('.modal-close')) m.classList.remove('open'); }));

  /* ---------- Simple forms (contact, partner, login, register) ---------- */
  $$('[data-demo-submit]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault(); let ok = true;
    $$('[required]', f).forEach(inp => {
      const field = inp.closest('.field'), bad = inp.type === 'checkbox' ? !inp.checked : !inp.value.trim();
      if (field) field.classList.toggle('invalid', bad); if (bad) ok = false;
    });
    if (ok) {
      try {
        const nameInp = $('#rn', f) || $('#pp', f) || $('#pn', f);
        const emailInp = $('#re', f) || $('#le', f) || $('#pe', f);
        const roleSel = $('#rr', f);
        const countryInp = $('#rc', f) || $('#pc', f);
        const user = {
          name: nameInp ? nameInp.value : 'Registered Member',
          email: emailInp ? emailInp.value : 'member@wemaglobal.org',
          role: roleSel ? roleSel.value : 'Individual / Member',
          country: countryInp && countryInp.value ? countryInp.value : 'United States'
        };
        localStorage.setItem('wema_user', JSON.stringify(user));
      } catch (err) {}
      if (f.dataset.redirect) location.href = f.dataset.redirect;
    }
  }));

  /* ---------- Checkout forms: mandatory non-refundable checkbox before any payment ---------- */
  $$('form[data-checkout]').forEach(f => {
    const chk = $('.pay-consent', f), btn = $('.pay-btn', f), amt = $('#amount', f), needAmt = f.hasAttribute('data-amount');
    const ok = () => (!chk || chk.checked) && (!needAmt || +amt.value >= 1);
    function upd() { const o = ok(); if (btn) { btn.disabled = !o; btn.style.opacity = o ? 1 : .5; } }
    $$('.amt-chip', f).forEach(c => c.addEventListener('click', () => { amt.value = c.dataset.v; $$('.amt-chip', f).forEach(x => x.classList.toggle('active', x === c)); upd(); }));
    [chk, amt].forEach(el => el && el.addEventListener('input', upd)); upd();
    if (btn) {
      btn.addEventListener('click', () => {
        let valid = true;
        $$('[required]', f).forEach(inp => { const bad = !inp.value.trim(); inp.closest('.field').classList.toggle('invalid', bad); if (bad) valid = false; });
        if (needAmt) { const bad = !(+amt.value >= 1); amt.closest('.field').classList.toggle('invalid', bad); if (bad) valid = false; }
        if (!valid || !ok()) return;
        const method = ($('input[name=method]:checked', f) || {}).value || 'stripe';
        const sel = $('select', f), q = new URLSearchParams({ type: f.dataset.type, method });
        if (sel) q.set('for', sel.value);
        if (needAmt) { q.set('amount', amt.value); q.set('freq', ($('input[name=freq]:checked', f) || {}).value || 'once'); }
        const links = (window.WEMA && WEMA.config && WEMA.config.payments) || {};
        if (links[method]) window.open(links[method], '_blank', 'noopener');
        location.href = 'thank-you.html?' + q.toString();
      });
    }
  });

  /* ---------- Thank-you page (messages come from the hidden, translatable #tyStrings blocks) ---------- */
  const ty = $('#thanks');
  if (ty) {
    const q = new URLSearchParams(location.search);
    let type = q.get('type') || 'enquiry';
    if (!document.getElementById('ty_' + type)) type = 'enquiry';
    function renderThanks() {
      const blk = document.getElementById('ty_' + type);
      $('#tyH').textContent = blk.querySelector('b').textContent;
      $('#tyP').textContent = blk.querySelector('span').textContent;
      const isDon = type === 'donation', amount = q.get('amount');
      $('#tyDetail').hidden = !isDon;
      $('#tyAmtRow').hidden = !amount;
      if (amount) $('#tyAmt').textContent = '$' + Number(amount).toLocaleString() + ' USD' + (q.get('freq') === 'monthly' ? ' · ' + ((document.getElementById('s_monthly') || {}).textContent || 'Monthly') : '');
      $('#tyItem').textContent = q.get('for') || ''; $('#tyItemRow').hidden = !q.get('for');
      $('#tyMethod').textContent = q.get('method') === 'paypal' ? 'PayPal' : 'Stripe';
    }
    document.addEventListener('wema:lang', renderThanks); renderThanks();
  }

  /* ---------- Contact: preselect department from ?dept= ---------- */
  const dept = new URLSearchParams(location.search).get('dept'), cdSel = $('#cd');
  if (dept && cdSel) { const o = Array.from(cdSel.options).find(x => x.text.toLowerCase() === dept.toLowerCase()); if (o) cdSel.value = o.value; }

  /* ---------- Cookie preferences ---------- */
  const ck = $('.cookie');
  if (ck) {
    if (!store.get('wema_cookie')) setTimeout(() => ck.classList.add('show'), 1400);
    const close = v => { store.set('wema_cookie', v); ck.classList.remove('show'); };
    const custom = $('[data-ck=custom]', ck), save = $('[data-ck=save]', ck);
    $('[data-ck=accept]', ck).addEventListener('click', () => close('all'));
    $('[data-ck=necessary]', ck).addEventListener('click', () => close('necessary'));
    custom.addEventListener('click', () => { ck.classList.add('expanded'); custom.hidden = true; save.hidden = false; });
    save.addEventListener('click', () => close('custom'));
    $$('[data-open-cookie]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); ck.classList.add('show', 'expanded'); custom.hidden = true; save.hidden = false; }));
  }

  /* ---------- Legal contents highlight ---------- */
  const tocLinks = $$('.toc a');
  if (tocLinks.length) {
    const so = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) tocLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id)); }), { rootMargin: '-30% 0px -60% 0px' });
    tocLinks.forEach(a => { const s = document.querySelector(a.getAttribute('href')); s && so.observe(s); });
  }

  /* ---------- PWA: manifest + service worker + Add to Home Screen ---------- */
  if (/^https?:$/.test(location.protocol)) {
    if (!document.querySelector('link[rel="manifest"]')) {
      const ml = document.createElement('link');
      ml.rel = 'manifest';
      ml.href = 'manifest.webmanifest';
      document.head.appendChild(ml);
    }
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
    }
  }
  let deferred = null; const ib = $('#installBtn');
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; });
  if (ib) ib.addEventListener('click', async () => {
    if (deferred) { deferred.prompt(); await deferred.userChoice; deferred = null; } else { const m = $('#iosHelp'); m && m.classList.add('open'); }
  });

  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  /* ---------- Start: apply saved language last, after everything has rendered ---------- */
  applyLang(store.get('wema_lang') || 'en', false);
})();
