// Shared header (with "Our Products" mega menu), mobile drawer, footer, animated WhatsApp button,
// and dependency-free motion (IntersectionObserver + CSS). No GSAP / Lenis: keeps Lighthouse at ~100.
import { categories } from './data/products.js';
import { t, pf, altLangHref, root, isRTL } from './i18n.js';

const ico = {
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.7 11.8 11.8 0 004.5 4c1.7.7 2.4.8 3.2.6a2.8 2.8 0 001.8-1.3 2.3 2.3 0 00.2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.5-7-12a7 7 0 0114 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
};
export const CAT_ICON = {
  cctv: '<path d="M3 7l12-3 2 6-12 3z"/><path d="M17 8l4 1-1 4-3-1M7 13l-1 5h4"/>',
  access: '<rect x="5" y="3" width="14" height="18" rx="3"/><circle cx="12" cy="10" r="3"/><path d="M9 17h6"/>',
  fire: '<path d="M12 3c3 4 6 6 6 11a6 6 0 01-12 0c0-3 2-5 3-6 0 2 1 3 2 3 0-3 0-5 1-8z"/>',
  vms: '<rect x="4" y="4" width="16" height="6" rx="2"/><rect x="4" y="14" width="16" height="6" rx="2"/><path d="M8 7h.01M8 17h.01"/>',
  network: '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v5M12 12l-6 5M12 12l6 5"/>',
  intercom: '<rect x="7" y="3" width="10" height="18" rx="2"/><circle cx="12" cy="9" r="2"/><path d="M10 15h4M10 18h4"/>',
  accessories: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4M12 15v2"/>',
};
const catSvg = (id) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${CAT_ICON[id]}</svg>`;
export { ico as icon };

const WA = 'https://wa.me/201111470546';
const logo = `<a href="${root}${isRTL ? 'ar/' : ''}index.html" class="logo" aria-label="TTC Distribution — ${t.home}"><img src="${root}assets/img/ttc-logo.svg" alt="TTC Distribution" width="134" height="43"></a>`;

export function renderLayout(current = 'index.html') {
  const other = altLangHref();
  const otherLang = isRTL ? 'en' : 'ar';
  const cur = (h) => (h === current ? ' aria-current="page"' : '');
  const mega = categories.map((c) => `<a href="products.html#${c.id}" class="mega__item"><span class="mega__icon">${catSvg(c.id)}</span><span>${pf(c, 'name')}</span></a>`).join('');
  document.body.insertAdjacentHTML('afterbegin', `
  <a class="skip-link" href="#main">${t.skip}</a>
  <header class="header" id="top">
    <div class="container header__inner">
      ${logo}
      <nav class="nav" aria-label="${t.menu}">
        <a href="index.html"${cur('index.html')}>${t.home}</a>
        <div class="nav__dd">
          <button class="nav__trigger" aria-expanded="false" aria-controls="mega"${current === 'products.html' ? ' aria-current="page"' : ''}>${t.products} ${ico.chev}</button>
          <div class="mega" id="mega"><div class="mega__grid">${mega}</div>
            <a class="mega__all" href="products.html">${t.allProducts} →</a></div>
        </div>
        <a href="index.html#industries">${t.industries}</a>
        <a href="index.html#brands">${t.brands}</a>
        <a href="index.html#services">${t.about}</a>
        <a href="contact.html"${cur('contact.html')}>${t.contact}</a>
      </nav>
      <div class="header__actions">
        <a class="lang" href="${other}" lang="${otherLang}" hreflang="${otherLang}">${t.switchLang}</a>
        <a class="btn btn--primary btn--sm" href="contact.html">${t.quote}</a>
        <button class="burger" aria-label="${t.openMenu}" aria-expanded="false" aria-controls="drawer"><span></span><span></span><span></span></button>
      </div>
    </div>
  </header>
  <div class="drawer" id="drawer" aria-hidden="true">
    <div class="drawer__scrim" data-close></div>
    <div class="drawer__panel" role="dialog" aria-modal="true" aria-label="${t.menu}">
      <div class="drawer__top">${logo}<button class="drawer__close" data-close aria-label="${t.closeMenu}">${ico.close}</button></div>
      <nav class="drawer__nav" aria-label="${t.menu}">
        <a href="index.html">${t.home}</a>
        <button aria-expanded="false" aria-controls="sub-products">${t.products} ${ico.chev}</button>
        <div class="drawer__sub" id="sub-products"><div>
          ${categories.map((c) => `<a href="products.html#${c.id}"><span class="mega__icon">${catSvg(c.id)}</span>${pf(c, 'name')}</a>`).join('')}
        </div></div>
        <a href="index.html#industries">${t.industries}</a><a href="index.html#brands">${t.brands}</a>
        <a href="index.html#services">${t.about}</a><a href="contact.html">${t.contact}</a>
      </nav>
      <div class="drawer__foot">
        <a class="btn btn--primary" href="contact.html">${t.quote}</a>
        <a class="btn btn--ghost" href="${other}" lang="${otherLang}" hreflang="${otherLang}">${t.switchLang}</a>
      </div>
    </div>
  </div>`);

  document.body.insertAdjacentHTML('beforeend', `
  <footer class="footer">
    <div class="container">
      <div class="footer__grid">
        <div>${logo}<p class="footer__mission">${t.mission}</p><p class="footer__support">${t.support}</p></div>
        <div><h2>${t.product}</h2><ul>${categories.map((c) => `<li><a href="products.html#${c.id}">${pf(c, 'name')}</a></li>`).join('')}</ul></div>
        <div><h2>${t.company}</h2><ul><li><a href="index.html#services">${t.about}</a></li><li><a href="index.html#brands">${t.brands}</a></li><li><a href="index.html#industries">${t.industries}</a></li><li><a href="contact.html">${t.contact}</a></li></ul></div>
        <div><h2>${t.contactH}</h2><ul class="footer__contact">
          <li><a href="tel:+201111470546" dir="ltr">${ico.phone}+20 11 11470546</a></li>
          <li><a href="mailto:sales@ttcdist.com">${ico.mail}sales@ttcdist.com</a></li>
          <li><a href="mailto:info@ttcdist.com">${ico.mail}info@ttcdist.com</a></li>
          <li><a href="https://maps.google.com/?q=47+Nabil+El+Wakad+Ard+El+Golf+Cairo" target="_blank" rel="noopener">${ico.pin}${t.address}</a></li></ul></div>
      </div>
      <div class="footer__bottom"><span>${t.rights} © ${new Date().getFullYear()}</span><span>${t.concept}</span></div>
    </div>
  </footer>
  <div class="wa" data-wa>
    <div class="wa__bubble" role="status"><span>${t.waBubble}</span><button class="wa__x" aria-label="${t.waClose}">${ico.close}</button></div>
    <a class="wa__btn" href="${WA}" target="_blank" rel="noopener" aria-label="${t.waLabel}"><i class="wa__ring"></i><i class="wa__ring"></i>${ico.wa}<span class="wa__label">${t.waLabel}</span></a>
  </div>`);

  initHeader(); initDrawer(); initMega(); initWhatsApp();
}

function initHeader() {
  const header = document.querySelector('.header');
  const wa = document.querySelector('[data-wa]');
  let last = 0;
  addEventListener('scroll', () => {
    const y = scrollY, down = y > last;
    header.classList.toggle('is-scrolled', y > 10);
    header.classList.toggle('is-hidden', y > 500 && down && !document.body.classList.contains('is-locked') && !header.matches(':focus-within'));
    wa.classList.toggle('is-tucked', y > 300 && down);
    last = y;
  }, { passive: true });
}

function initMega() {
  const dd = document.querySelector('.nav__dd'); if (!dd) return;
  const btn = dd.querySelector('.nav__trigger');
  let timer;
  const set = (on) => { clearTimeout(timer); dd.classList.toggle('is-open', on); btn.setAttribute('aria-expanded', on); };
  dd.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && set(true));
  dd.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') timer = setTimeout(() => set(false), 120); });
  btn.addEventListener('click', () => set(matchMedia('(hover: hover)').matches ? true : !dd.classList.contains('is-open')));
  dd.addEventListener('keydown', (e) => { if (e.key === 'Escape') { set(false); btn.focus(); } });
  dd.addEventListener('focusout', (e) => { if (!dd.contains(e.relatedTarget)) set(false); });
  document.addEventListener('click', (e) => { if (!dd.contains(e.target)) set(false); });
}

function initDrawer() {
  const drawer = document.getElementById('drawer');
  const burger = document.querySelector('.burger');
  const panel = drawer.querySelector('.drawer__panel');
  const focusables = () => [...panel.querySelectorAll('a,button')].filter((el) => el.offsetParent !== null);
  const open = () => {
    drawer.classList.add('is-open'); drawer.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true'); document.body.classList.add('is-locked');
    setTimeout(() => panel.querySelector('.drawer__close').focus(), 50);
  };
  const close = () => {
    drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false'); document.body.classList.remove('is-locked'); burger.focus();
  };
  burger.addEventListener('click', open);
  drawer.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', close));
  drawer.querySelectorAll('.drawer__nav a, .drawer__sub a, .drawer__foot a').forEach((a) => a.addEventListener('click', close));
  drawer.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') {
      const f = focusables(); const first = f[0], lastEl = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
    }
  });
  const toggle = drawer.querySelector('[aria-controls="sub-products"]');
  const sub = document.getElementById('sub-products');
  sub.inert = true;
  toggle.addEventListener('click', () => {
    const on = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(on)); sub.classList.toggle('is-open', on); sub.inert = !on;
  });
}

/** WhatsApp: pulse rings, label on hover, a one-time greeting bubble after 6s (dismissible, remembered). */
function initWhatsApp() {
  const wa = document.querySelector('[data-wa]');
  const KEY = 'ttc-wa-dismissed';
  if (!sessionStorage.getItem(KEY)) setTimeout(() => wa.classList.add('has-bubble'), 6000);
  wa.querySelector('.wa__x').addEventListener('click', () => { wa.classList.remove('has-bubble'); sessionStorage.setItem(KEY, '1'); });
  wa.querySelector('.wa__btn').addEventListener('click', () => sessionStorage.setItem(KEY, '1'));
}

/** Reveal-on-scroll with IntersectionObserver + CSS transitions (no animation library). */
export function initMotion() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const els = document.querySelectorAll('[data-reveal],[data-stagger]');
  if (reduce || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return; }
  document.querySelectorAll('[data-stagger]').forEach((w) => [...w.children].forEach((c, i) => c.style.setProperty('--i', i)));
  const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  els.forEach((e) => io.observe(e));
}

/** Split heading words for a CSS entrance (keeps Arabic letter-joining inside each word). */
export function splitWords(el) {
  const nodes = [...el.childNodes]; el.textContent = '';
  let i = 0;
  nodes.forEach((node) => {
    const cls = node.nodeType === 1 ? node.className : '';
    // keep runs of Latin words together so "TTC Distribution" isn't reordered inside RTL text
    const words = node.textContent.trim().split(/\s+/).filter(Boolean).reduce((acc, w) => {
      const latin = /^[A-Za-z0-9&.,'()\-]+$/.test(w);
      if (latin && acc.length && acc[acc.length - 1].latin) acc[acc.length - 1].w += ' ' + w; else acc.push({ w, latin });
      return acc;
    }, []);
    words.forEach(({ w, latin }) => {
      const outer = document.createElement('span'); outer.className = 'split-line';
      const inner = document.createElement('span'); inner.textContent = w; inner.style.setProperty('--i', i++);
      if (latin && isRTL) outer.dir = 'ltr';
      if (cls) inner.className = cls;
      outer.append(inner); el.append(outer, ' ');
    });
  });
  el.classList.add('is-split');
}

/** Run `fn` once on the visitor's first real interaction (keeps heavy 3D out of the initial load). */
export function onFirstInteraction(fn) {
  let done = false;
  // real input only: programmatic scrolls (crawlers, audits) don't pull in three.js
  const evs = ['pointermove', 'pointerdown', 'touchstart', 'wheel', 'keydown'];
  const go = () => { if (done) return; done = true; evs.forEach((e) => removeEventListener(e, go, true)); fn(); };
  evs.forEach((e) => addEventListener(e, go, { capture: true, passive: true, once: true }));
  // don't leave the 3D waiting forever if the visitor just reads: start shortly after load anyway
  const later = () => setTimeout(go, 3000);
  document.readyState === 'complete' ? later() : addEventListener('load', later, { once: true });
}
