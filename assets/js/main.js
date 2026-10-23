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

  /* ---------- Comprehensive Form Validation & Strict Typing Constraints ---------- */
  function getFieldType(input) {
    if (!input || !input.tagName) return 'other';
    const tag = input.tagName.toLowerCase();
    if (tag !== 'input' && tag !== 'textarea' && tag !== 'select') return 'other';

    const type = (input.getAttribute('type') || (tag === 'textarea' ? 'textarea' : tag === 'select' ? 'select' : 'text')).toLowerCase();
    const id = (input.id || '').toLowerCase();
    const name = (input.name || '').toLowerCase();
    const auto = (input.autocomplete || '').toLowerCase();

    // Look for associated label text
    let label = '';
    if (input.id) {
      const lbl = document.querySelector(`label[for="${input.id}"]`);
      if (lbl) label = lbl.textContent;
    }
    if (!label) {
      const fieldBox = input.closest('.field') || input.closest('label');
      if (fieldBox) {
        const lbl = fieldBox.querySelector('label') || (fieldBox.tagName.toLowerCase() === 'label' ? fieldBox : null);
        if (lbl) label = lbl.textContent;
      }
    }
    const cleanLabel = label.replace(/[*:\s]+/g, ' ').trim().toLowerCase();

    // 1. Phone number field: type="tel", autocomplete="tel", or label/id/name has phone/mobile/tel
    if (
      type === 'tel' ||
      auto === 'tel' ||
      /\b(phone|mobile|cell|telephone|whatsapp)\b/i.test(cleanLabel) ||
      /\b(phone|mobile|tel)\b/i.test(name) ||
      /\b(phone|mobile|tel)\b/i.test(id) ||
      id === 'st2' ||
      id.includes('phone')
    ) {
      return 'phone';
    }

    // 2. Personal Name field: text input whose label represents a person's name
    const isOrgOrOther = /\b(org|organization|company|ministry|church|project|title|course|role|country|address|city|state|zip|school|institution)\b/i.test(cleanLabel) ||
                         /\b(org|organization|company|ministry|church|project|title|course)\b/i.test(id) ||
                         /\b(org|organization|company|ministry|church|project|title|course)\b/i.test(name);

    const isPersonalName = !isOrgOrOther && (
      /\b(full\s*name|applicant\s*(?:full\s*)?name|contact\s*name|primary\s*contact\s*name|customer\s*name|member\s*name|first\s*name|last\s*name|your\s*name)\b/i.test(cleanLabel) ||
      cleanLabel === 'name' ||
      auto === 'name' || auto === 'given-name' || auto === 'family-name' ||
      ['rn', 'cn', 'st0', 'pn', 'pp', 'formvolunteer_1', 'formfunder_1', 'formseeker_3'].includes(id)
    );

    if (isPersonalName && (type === 'text' || !input.hasAttribute('type'))) {
      return 'name';
    }

    // 3. Email field
    if (type === 'email' || auto === 'email' || /\bemail\b/i.test(cleanLabel) || /\bemail\b/i.test(id) || ['re', 'ce', 'le', 'pe', 'st1', 'formvolunteer_2', 'formfunder_4', 'formseeker_5', 'submit_5'].includes(id)) {
      return 'email';
    }

    // 4. URL field
    if (type === 'url' || /\b(website|url|web)\b/i.test(cleanLabel)) {
      return 'url';
    }

    // 5. Password field
    if (type === 'password' || auto.includes('password') || id === 'rp') {
      return 'password';
    }

    return type;
  }

  // Setup Name and Phone inputs attributes
  function setupInputs() {
    $$('input').forEach(inp => {
      const fType = getFieldType(inp);
      if (fType === 'phone') {
        inp.type = 'tel';
        inp.setAttribute('inputmode', 'numeric');
        inp.setAttribute('pattern', '[0-9]*');
        inp.setAttribute('maxlength', '15');
        inp.setAttribute('autocomplete', 'tel');
      } else if (fType === 'name') {
        inp.setAttribute('autocomplete', 'name');
        inp.setAttribute('pattern', '[A-Za-z\\s]+');
      }
    });
  }
  setupInputs();

  // Strict typing restriction event listeners on document
  document.addEventListener('keydown', e => {
    const target = e.target;
    if (!target || target.tagName !== 'INPUT') return;
    const fType = getFieldType(target);

    // Common allowed navigation/editing keys
    const navKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
    if (navKeys.includes(e.key) || e.ctrlKey || e.metaKey || e.altKey) return;

    if (fType === 'phone') {
      // Only digits 0-9 allowed to be typed
      if (e.key.length === 1 && !/^[0-9]$/.test(e.key)) {
        e.preventDefault();
      }
    } else if (fType === 'name') {
      // Only text letters and spaces allowed to be typed
      if (e.key.length === 1 && !/^[a-zA-Z\s]$/.test(e.key)) {
        e.preventDefault();
      }
    }
  }, true);

  document.addEventListener('beforeinput', e => {
    const target = e.target;
    if (!target || target.tagName !== 'INPUT') return;
    const fType = getFieldType(target);
    if (!e.data) return;

    if (fType === 'phone') {
      if (!/^[0-9]+$/.test(e.data)) {
        e.preventDefault();
      }
    } else if (fType === 'name') {
      if (!/^[a-zA-Z\s]+$/.test(e.data)) {
        e.preventDefault();
      }
    }
  }, true);

  document.addEventListener('paste', e => {
    const target = e.target;
    if (!target || target.tagName !== 'INPUT') return;
    const fType = getFieldType(target);
    if (fType !== 'phone' && fType !== 'name') return;

    const pasted = (e.clipboardData || window.clipboardData)?.getData('text');
    if (!pasted) return;

    e.preventDefault();
    let sanitized = '';
    if (fType === 'phone') {
      sanitized = pasted.replace(/\D/g, '').slice(0, 15);
    } else if (fType === 'name') {
      sanitized = pasted.replace(/[^a-zA-Z\s]/g, '');
    }

    if (sanitized) {
      const start = target.selectionStart || 0;
      const end = target.selectionEnd || 0;
      const val = target.value || '';
      const max = target.maxLength > 0 ? target.maxLength : 999;
      const updated = (val.slice(0, start) + sanitized + val.slice(end)).slice(0, max);
      target.value = updated;
      const nextPos = Math.min(start + sanitized.length, updated.length);
      target.setSelectionRange(nextPos, nextPos);
      target.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }, true);

  // Live sanitization & validation on input
  document.addEventListener('input', e => {
    const target = e.target;
    if (!target || !target.tagName) return;
    const tag = target.tagName.toLowerCase();
    if (tag !== 'input' && tag !== 'textarea' && tag !== 'select') return;

    const fType = getFieldType(target);
    if (fType === 'phone') {
      const cleaned = target.value.replace(/\D/g, '').slice(0, 15);
      if (target.value !== cleaned) target.value = cleaned;
    } else if (fType === 'name') {
      const cleaned = target.value.replace(/[^a-zA-Z\s]/g, '');
      if (target.value !== cleaned) target.value = cleaned;
    }

    // If field was previously marked invalid, re-validate live to clear error once valid
    const fieldBox = target.closest('.field');
    const consentBox = target.closest('.consent');
    if ((fieldBox && fieldBox.classList.contains('invalid')) || (consentBox && consentBox.classList.contains('invalid'))) {
      validateSingleField(target);
    }
  }, true);

  // Re-validate checkbox change live
  document.addEventListener('change', e => {
    const target = e.target;
    if (!target || target.type !== 'checkbox') return;
    const consentBox = target.closest('.consent');
    if (consentBox) {
      if (target.checked) consentBox.classList.remove('invalid');
    }
  }, true);

  // Validate on blur
  document.addEventListener('blur', e => {
    const target = e.target;
    if (!target || !target.tagName) return;
    const tag = target.tagName.toLowerCase();
    if (tag !== 'input' && tag !== 'textarea' && tag !== 'select') return;
    if (target.value && target.value.trim()) {
      validateSingleField(target);
    }
  }, true);

  function validateSingleField(inp) {
    const fType = getFieldType(inp);
    const isReq = inp.hasAttribute('required') || inp.required;
    const val = (inp.value || '').trim();
    const fieldBox = inp.closest('.field');
    const consentBox = inp.closest('.consent');
    let errorEl = fieldBox ? fieldBox.querySelector('.error-msg') : null;

    let isValid = true;
    let msg = '';

    if (inp.type === 'checkbox') {
      if (isReq && !inp.checked) {
        isValid = false;
        msg = 'Please check this box to proceed';
      }
      if (consentBox) {
        consentBox.classList.toggle('invalid', !isValid);
      }
      return isValid;
    }

    if (inp.type === 'file') {
      if (isReq && (!inp.files || inp.files.length === 0)) {
        isValid = false;
        msg = 'Please select a file to upload';
      }
    } else if (fType === 'name') {
      if (isReq && !val) {
        isValid = false;
        msg = 'Name is required';
      } else if (val) {
        if (!/^[a-zA-Z\s]+$/.test(val)) {
          isValid = false;
          msg = 'Only letters are allowed in name';
        } else if (val.replace(/\s/g, '').length < 2) {
          isValid = false;
          msg = 'Name must be at least 2 characters';
        }
      }
    } else if (fType === 'phone') {
      if (isReq && !val) {
        isValid = false;
        msg = 'Phone number is required';
      } else if (val) {
        if (!/^\d+$/.test(val)) {
          isValid = false;
          msg = 'Only numbers are allowed in phone number';
        } else if (val.length < 7 || val.length > 15) {
          isValid = false;
          msg = 'Please enter a valid phone number (7 to 15 digits)';
        }
      }
    } else if (fType === 'email') {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
      if (isReq && !val) {
        isValid = false;
        msg = 'Email address is required';
      } else if (val && !emailRegex.test(val)) {
        isValid = false;
        msg = 'Please enter a valid email address';
      }
    } else if (fType === 'url') {
      const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/i;
      if (isReq && !val) {
        isValid = false;
        msg = 'Website URL is required';
      } else if (val && !urlRegex.test(val)) {
        isValid = false;
        msg = 'Please enter a valid URL (e.g. https://example.com)';
      }
    } else if (fType === 'password') {
      if (isReq && !val) {
        isValid = false;
        msg = 'Password is required';
      } else if (val && val.length < 6) {
        isValid = false;
        msg = 'Password must be at least 6 characters';
      }
    } else if (inp.tagName.toLowerCase() === 'select') {
      if (isReq && !inp.value) {
        isValid = false;
        msg = 'Please select an option';
      }
    } else {
      if (isReq && !val) {
        isValid = false;
        msg = 'This field is required';
      }
    }

    if (fieldBox) {
      fieldBox.classList.toggle('invalid', !isValid);
      if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.className = 'error-msg';
        fieldBox.appendChild(errorEl);
      }
      errorEl.textContent = msg || 'Required';
    }

    return isValid;
  }

  function validateWemaForm(form) {
    let isAllValid = true;
    let firstInvalid = null;

    const elements = Array.from(form.querySelectorAll('input, select, textarea'));
    elements.forEach(el => {
      if (el.type === 'submit' || el.type === 'button' || el.type === 'hidden') return;
      const ok = validateSingleField(el);
      if (!ok) {
        isAllValid = false;
        if (!firstInvalid) firstInvalid = el;
      }
    });

    if (!isAllValid && firstInvalid) {
      firstInvalid.focus();
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return isAllValid;
  }
  window.validateWemaForm = validateWemaForm;

  /* ---------- Simple forms (contact, partner, login, register, servants, etc.) ---------- */
  $$('[data-demo-submit], #checkoutForm').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    const ok = validateWemaForm(f);
    if (ok) {
      if (f.hasAttribute('data-account')) try {
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
      if (f.dataset.redirect) {
        location.href = f.dataset.redirect;
      } else if (f.id === 'checkoutForm') {
        location.href = 'thank-you.html?type=order';
      }
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
        const formValid = validateWemaForm(f);
        if (needAmt) { const bad = !(+amt.value >= 1); amt.closest('.field').classList.toggle('invalid', bad); if (bad) return; }
        if (!formValid || !ok()) return;
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
