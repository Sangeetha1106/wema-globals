/* WEMA Store: catalogue, cart and checkout preview (front end only). Products come from assets/js/site-data.js */
(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const money = n => 'USD $' + Number(n).toFixed(2);
  function boot() {
    const D = window.WEMA || {}, P = D.products || [];
    let cart = {};
    const grid = $('#productGrid'), empty = $('#productEmpty'), bar = $('#shopFilter');
    if (!grid) return;
    if (!P.length) { empty.style.display = ''; }
    function card(p) {
      const priced = typeof p.price === 'number';
      return `<article class="product reveal in" data-cat="${esc(p.category)}"><div class="prod-img"><img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy"></div>
        <div class="prod-body"><span class="tag-sm">${esc(p.category)}</span><h3>${esc(p.name)}</h3>
        <p class="p-desc" hidden>${esc(p.text || '')}</p>
        <p><b>${priced ? money(p.price) : 'Price to be confirmed'}</b></p>
        <div class="buy"><button type="button" class="btn btn-outline-dark btn-sm" data-view="${esc(p.id)}">View Product</button>
        <button type="button" class="btn btn-gold btn-sm" data-add="${esc(p.id)}" ${priced ? '' : 'disabled'}>Add to Cart</button></div></div></article>`;
    }
    grid.innerHTML = P.map(card).join('');
    const cats = [...new Set(P.map(p => p.category))];
    if (bar && cats.length > 1) {
      bar.innerHTML = ['All'].concat(cats).map((c, i) => `<button type="button" class="${i ? '' : 'active'}" data-c="${esc(c)}">${esc(c)}</button>`).join('');
      bar.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        $$('button', bar).forEach(x => x.classList.toggle('active', x === b));
        $$('.product', grid).forEach(p => p.style.display = (b.dataset.c === 'All' || p.dataset.cat === b.dataset.c) ? '' : 'none');
      });
    }
    grid.addEventListener('click', e => {
      const v = e.target.closest('[data-view]'), a = e.target.closest('[data-add]');
      if (v) { const d = v.closest('.product').querySelector('.p-desc'); d.hidden = !d.hidden; }
      if (a) { cart[a.dataset.add] = (cart[a.dataset.add] || 0) + 1; render(); $('#cart').scrollIntoView({ behavior: 'smooth' }); }
    });
    function render() {
      const lines = Object.keys(cart).map(id => ({ p: P.find(x => x.id === id), q: cart[id] })).filter(l => l.p);
      const box = $('#cartBox'), sum = $('#orderSummary'), btn = $('#placeOrder');
      if (!lines.length) {
        box.innerHTML = '<p style="margin:0;color:var(--muted)">Your cart is empty.</p>';
        sum.innerHTML = '<p style="margin:0;color:var(--muted)">Your cart is empty.</p>';
        ['ckPrice', 'ckShip', 'ckTax', 'ckTotal'].forEach(i => $('#' + i).textContent = '—'); btn.disabled = true; return;
      }
      const html = lines.map(l => `<div class="list-row"><span>${esc(l.p.name)} × ${l.q}</span><b>${money(l.p.price * l.q)}</b> <button type="button" class="btn btn-outline-dark btn-sm" data-rm="${esc(l.p.id)}">Remove</button></div>`).join('');
      box.innerHTML = html; sum.innerHTML = html;
      const price = lines.reduce((s, l) => s + l.p.price * l.q, 0);
      const ship = lines.every(l => typeof l.p.shipping === 'number') ? lines.reduce((s, l) => s + l.p.shipping, 0) : null;
      const tax = lines.every(l => typeof l.p.tax === 'number') ? lines.reduce((s, l) => s + l.p.price * l.q * l.p.tax, 0) : null;
      $('#ckPrice').textContent = money(price);
      $('#ckShip').textContent = ship == null ? 'To be confirmed' : money(ship);
      $('#ckTax').textContent = tax == null ? 'To be confirmed' : money(tax);
      $('#ckTotal').textContent = (ship == null || tax == null) ? 'To be confirmed' : money(price + ship + tax);
      btn.disabled = false;
    }
    document.addEventListener('click', e => { const r = e.target.closest('[data-rm]'); if (r) { delete cart[r.dataset.rm]; render(); } });
    const f = $('#checkoutForm');
    f.addEventListener('submit', e => {
      e.preventDefault(); let ok = true;
      $$('[required]', f).forEach(i => { const bad = !i.value.trim(); i.closest('.field').classList.toggle('invalid', bad); if (bad) ok = false; });
      if (ok) location.href = 'thank-you.html?type=order';
    });
    render();
  }
  window.addEventListener('DOMContentLoaded', () => setTimeout(boot, 0));
})();
