/* WEMA Global — builds editable sections from assets/js/site-data.js */
(function () {
  'use strict';
  const D = window.WEMA || { config: {}, banners: [], products: [], figures: [], news: [], projects: [] };
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>';
  const SHIELD = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.5l8 3v6c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10v-6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg>';
  const EXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/></svg>';

  /* ---------- Contact details, social, app links ---------- */
  const C = D.config || {};
  $$('[data-cfg]').forEach(el => {
    const key = el.dataset.cfg, val = C[key];
    if (!val) return;
    if (el.dataset.cfgType === 'mail') { el.href = 'mailto:' + val; el.textContent = val; }
    else if (el.dataset.cfgType === 'tel') { el.href = 'tel:' + val.replace(/\s+/g, ''); el.textContent = val; }
    else el.textContent = val;
  });
  $$('[data-social]').forEach(a => { const u = (C.social || {})[a.dataset.social]; if (u) { a.href = u; a.target = '_blank'; a.rel = 'noopener'; a.hidden = false; } });

  /* ---------- Academy: optional WEMA Global App slot (hidden until a link is set) ---------- */
  const appSlot = $('[data-app-slot]'), AP = C.academyApp || {};
  if (appSlot) {
    let any = false;
    $$('[data-app-link]', appSlot).forEach(a => { const u = AP[a.dataset.appLink]; if (u && /^https?:\/\//i.test(u)) { a.href = u; a.target = '_blank'; a.rel = 'noopener'; a.hidden = false; any = true; } });
    $$('[data-app-soon],[data-app-soon-note]', appSlot).forEach(x => { x.hidden = any; });
  }

  /* ---------- Homepage video slot ---------- */
  const vs = $('[data-video-slot]');
  if (vs && D.homeVideo) {
    const V = D.homeVideo; let src = '';
    const yt = (V.youtube || '').match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/), vm = (V.vimeo || '').match(/vimeo\.com\/(\d+)/);
    if (yt) src = 'https://www.youtube-nocookie.com/embed/' + yt[1];
    else if (vm) src = 'https://player.vimeo.com/video/' + vm[1];
    if (src) vs.innerHTML = '<iframe src="' + src + '" title="' + esc(V.title || 'Video') + '" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
    else if (V.file) vs.innerHTML = '<video controls preload="none" playsinline' + (V.poster ? ' poster="' + esc(V.poster) + '"' : '') + ' src="' + esc(V.file) + '"></video>';
  }

  /* ---------- Homepage sliding banner ---------- */
  const slides = $('.slides');
  if (slides) {
    const today = new Date().toISOString().slice(0, 10);
    const live = (D.banners || []).filter(b => b.enabled !== false && (!b.start || b.start <= today) && (!b.end || b.end >= today)).slice(0, Math.max(0, 5 - $$('.hero-slide', slides).length));
    live.forEach((b, i) => {
      const el = document.createElement('div');
      el.className = 'hero-slide banner banner--' + esc(b.type);
      el.setAttribute('role', 'group'); el.setAttribute('aria-roledescription', 'slide');
      el.setAttribute('aria-label', (i + 2) + ' of ' + (live.length + 1));
      const ctas = (b.cta || []).map(c => `<a class="btn ${c.secondary ? 'btn-outline' : 'btn-gold'}" href="${esc(c.href)}">${esc(c.text)}${c.secondary ? '' : ' ' + ARROW}</a>`).join('');
      const isImg = /\.(jpg|jpeg|png|webp)$/i.test(b.image || '');
      el.innerHTML = `<div class="hero-bg" style="background-image:url('${esc(b.image)}')"></div><div class="hero-ov"></div>
        <div class="container hero-grid"><div>
          <span class="pill"><i class="dot"></i> ${esc(b.label)}</span>
          <h2 class="b-title">${esc(b.title)}</h2>
          <p class="sub">${esc(b.text)}</p>
          <div class="cta-row">${ctas}</div></div>
          <div class="hero-art b-art" aria-hidden="true"><div class="arch"><img src="${esc(b.image)}" alt="" ${isImg ? '' : 'style="object-fit:cover"'}></div></div>
        </div>`;
      slides.appendChild(el);
    });
    const all = $$('.hero-slide', slides);
    if (all.length > 1) {
      const ui = document.createElement('div'); ui.className = 'slider-ui';
      ui.innerHTML = `<button type="button" class="s-btn" data-dir="-1" aria-label="Previous slide">‹</button>
        <div class="s-dots" role="tablist">${all.map((_, i) => `<button type="button" role="tab" aria-label="Slide ${i + 1}" data-i="${i}"></button>`).join('')}</div>
        <button type="button" class="s-btn" data-dir="1" aria-label="Next slide">›</button>
        <button type="button" class="s-btn s-pause" aria-label="Pause slideshow">❚❚</button>`;
      $('.hero').appendChild(ui);
      let cur = 0, timer = null, playing = !reduce;
      const dots = $$('.s-dots button', ui);
      function show(n) {
        cur = (n + all.length) % all.length;
        all.forEach((s, i) => { s.classList.toggle('active', i === cur); s.setAttribute('aria-hidden', i !== cur); });
        dots.forEach((d, i) => { d.classList.toggle('on', i === cur); d.setAttribute('aria-selected', i === cur); });
        $('.hero').dataset.slide = all[cur].classList.contains('banner') ? 'banner' : 'conference';
      }
      function play() { stop(); if (playing) timer = setInterval(() => show(cur + 1), 8000); }
      function stop() { clearInterval(timer); }
      ui.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        if (b.dataset.dir) show(cur + +b.dataset.dir);
        else if (b.dataset.i) show(+b.dataset.i);
        else if (b.classList.contains('s-pause')) { playing = !playing; b.textContent = playing ? '❚❚' : '▶'; b.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow'); }
        play();
      });
      const hero = $('.hero');
      hero.addEventListener('mouseenter', stop); hero.addEventListener('mouseleave', play);
      hero.addEventListener('focusin', stop); hero.addEventListener('focusout', play);
      let x0 = null;
      hero.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
      hero.addEventListener('touchend', e => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 60) { show(cur + (dx < 0 ? 1 : -1)); play(); } x0 = null; });
      show(0); play();
    } else if (all[0]) all[0].classList.add('active');
  }

  /* ---------- Eco Shop product catalog ---------- */
  const pg = $('#productGrid');
  if (pg) {
    pg.innerHTML = (D.products || []).slice(0, +pg.dataset.limit || 99).map(p => {
      const buy = [];
      if (p.amazon) buy.push(`<a class="btn btn-gold btn-sm" href="${esc(p.amazon)}" target="_blank" rel="noopener sponsored">Buy on Amazon ${EXT}</a>`);
      if (p.shopify) buy.push(`<a class="btn btn-purple btn-sm" href="${esc(p.shopify)}" target="_blank" rel="noopener sponsored">Buy on Shopify ${EXT}</a>`);
      const logo = /logo\.png$/.test(p.image);
      return `<article class="product reveal" data-cat="${esc(p.category)}"><div class="prod-img${logo ? ' is-logo' : ''}"><img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy"></div>
        <div class="prod-body"><span class="tag-sm">${esc(p.category)}</span><h3>${esc(p.name)}</h3>${p.text ? `<p>${esc(p.text)}</p>` : ''}
        <div class="buy">${buy.length ? buy.join('') : '<span class="soon">Coming soon on Amazon and Shopify</span>'}</div></div></article>`;
    }).join('');
    const uniqueCats = [...new Set((D.products || []).map(p => p.category))];
    const cats = uniqueCats.length > 1 ? ['All'].concat(uniqueCats) : uniqueCats;
    const bar = $('#shopFilter');
    if (bar) {
      bar.innerHTML = cats.map((c, i) => `<button type="button" class="${i ? '' : 'active'}" data-c="${esc(c)}">${esc(c)}</button>`).join('');
      bar.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        $$('button', bar).forEach(x => x.classList.toggle('active', x === b));
        $$('.product', pg).forEach(p => p.style.display = (b.dataset.c === 'All' || p.dataset.cat === b.dataset.c) ? '' : 'none');
      });
    }
    if ((D.products || []).length === 1) {
      pg.style.maxWidth = '420px';
      pg.style.margin = '0 auto';
      pg.style.gridTemplateColumns = '1fr';
    }
  }

  /* ---------- Impact figures ---------- */
  const fg = $('#figures');
  if (fg) {
    const f = D.figures || [];
    fg.innerHTML = f.map(x => `<div class="stat"><b data-count="${x.value}" ${x.plain ? 'data-plain="1"' : ''} data-suffix="${esc(x.suffix || '')}">${x.plain ? x.value : Number(x.value).toLocaleString()}${esc(x.suffix || '')}</b><span>${esc(x.label)}</span></div>`).join('');
    fg.style.setProperty('--cols', Math.min(f.length || 1, 4));
  }

  /* ---------- News ---------- */
  const ng = $('#newsGrid');
  if (ng) {
    const limit = +ng.dataset.limit || 99;
    ng.innerHTML = (D.news || []).slice(0, limit).map((n, i) => `<article class="post reveal reveal-d${i % 3}"><div class="p-thumb"><img src="${esc(n.image)}" alt="" loading="lazy"><span class="tag">${esc(n.tag)}</span></div>
      <div class="p-meta"><h3>${esc(n.title)}</h3><p>${esc(n.text)}</p><a class="link-arrow" href="${esc(n.href || '#')}">Read more ${ARROW}</a></div></article>`).join('');
  }

  /* ---------- Projects list ---------- */
  const pj = $('#projGrid');
  if (pj) {
    const list = D.projects || [];
    pj.innerHTML = list.map(p => `<article class="proj"><div class="p-top"><img src="${esc(p.image || 'assets/global-network.jpg')}" alt="" loading="lazy">${p.status ? `<span>${esc(p.status)}</span>` : ''}</div>
      <div class="p-body"><h3>${esc(p.title)}</h3><div class="meta"><span>${PIN}${esc(p.country)}</span><span>${esc(p.id)}</span></div><p>${esc(p.summary)}</p></div></article>`).join('');
    const st = $('#projStatus'); if (st) st.style.display = list.length ? 'none' : 'block';
  }

  /* ---------- Optional live statistics feed ---------- */
  if (C.statsUrl && fg) {
    fetch(C.statsUrl).then(r => r.json()).then(list => {
      if (!Array.isArray(list) || !list.length) return;
      D.figures = list; fg.innerHTML = list.map(x => `<div class="stat"><b data-count="${x.value}" ${x.plain ? 'data-plain="1"' : ''} data-suffix="${esc(x.suffix || '')}">${x.plain ? x.value : Number(x.value).toLocaleString()}${esc(x.suffix || '')}</b><span>${esc(x.label)}</span></div>`).join('');
      fg.style.setProperty('--cols', Math.min(list.length, 4));
      if (window.WEMA_translate) window.WEMA_translate();
    }).catch(() => {});
  }

  /* ---------- Leadership profiles (editable in site-data.js -> leaders). Empty until confirmed and approved. ---------- */
  const lg = $('#leaderGrid');
  if (lg) {
    const list = D.leaders || [];
    lg.innerHTML = list.map(p => `<article class="card reveal">${p.photo ? `<img src="${esc(p.photo)}" alt="${esc(p.name)}" loading="lazy" style="width:100%;border-radius:12px;margin-bottom:12px">` : ''}
      <h3 style="margin:0 0 4px">${esc(p.name)}</h3><div style="color:var(--purple);font-weight:700">${esc(p.title)}</div><div style="color:var(--muted);font-size:.9rem">${esc(p.country || '')}</div>
      ${p.bio ? `<p style="margin-top:10px">${esc(p.bio)}</p>` : ''}${p.link ? `<a class="link-arrow" href="${esc(p.link)}" target="_blank" rel="noopener">Profile ${ARROW}</a>` : ''}</article>`).join('');
    const em = $('#leaderEmpty'); if (em) em.style.display = list.length ? 'none' : '';
  }

  /* ---------- Partner cards (editable in site-data.js -> partners). Publish only with the partner's authorization. ---------- */
  const pg2 = $('#partnerGrid');
  if (pg2) {
    const list = D.partners || [];
    pg2.innerHTML = list.map(p => `<article class="card reveal">${p.logo ? `<img src="${esc(p.logo)}" alt="${esc(p.name)}" loading="lazy" style="max-height:80px;margin-bottom:12px">` : ''}
      <h3 style="margin:0 0 4px">${esc(p.name)}</h3><div style="color:var(--muted);font-size:.9rem">${esc(p.country || '')} · ${esc(p.type || '')}</div>
      <p style="margin-top:10px">${esc(p.text || '')}</p>${p.website ? `<a class="link-arrow" href="${esc(p.website)}" target="_blank" rel="noopener">Official website ${ARROW}</a>` : ''}</article>`).join('');
    const em = $('#partnerEmpty'); if (em) em.style.display = list.length ? 'none' : '';
  }
})();
