import { products } from './data/products.js?v=2611221351';
import { renderLayout, initMotion, onFirstInteraction } from './layout.js?v=2611221351';
let mountCardViewer = null; // loaded lazily with three.js
import { t, pf } from './i18n.js?v=2611221351';

renderLayout('products.html');

const state = { q: '', type: 'All', brand: 'All', rfq: new Set(JSON.parse(localStorage.getItem('ttc-rfq') || '[]')) };
const cctv = products.filter((p) => p.category === 'cctv');
const types = ['All', ...new Set(cctv.map((p) => p.type))];
const typeLabel = (v) => (v === 'All' ? t.all : pf(cctv.find((p) => p.type === v) || { type: v }, 'type'));
const brands = ['All', ...new Set(cctv.map((p) => p.brand))];
const grid = document.querySelector('.grid');
const count = document.querySelector('[data-count-results]');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function chips(el, list, key) {
  const label = key === 'type' ? typeLabel : (v) => (v === 'All' ? t.all : v);
  el.innerHTML = list.map((v) => `<button class="chip" aria-pressed="${state[key] === v}" data-v="${esc(v)}">${esc(label(v))}</button>`).join('');
  el.addEventListener('click', (e) => {
    const b = e.target.closest('.chip'); if (!b) return;
    state[key] = b.dataset.v;
    el.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', c === b));
    render();
  });
}

function render() {
  const q = state.q.toLowerCase();
  const list = cctv.filter((p) =>
    (state.type === 'All' || p.type === state.type) &&
    (state.brand === 'All' || p.brand === state.brand) &&
    (!q || [p.name, p.name_ar, p.type, p.type_ar, p.brand, p.sku, ...p.tags, ...(p.tags_ar || [])].join(' ').toLowerCase().includes(q)));
  count.textContent = t.results(list.length);
  if (!list.length) { grid.innerHTML = `<p class="empty">${t.noResults}</p>`; return; }
  grid.innerHTML = list.map((p) => `
    <article class="card">
      <div class="card__media"><canvas aria-label="${esc(t.model3d(pf(p, 'name')))}" role="img"></canvas>
        <span class="card__badge">${esc(pf(p, 'type'))}</span><span class="card__3d">3D</span></div>
      <div class="card__body">
        <p dir="ltr" style="text-align:start">${esc(p.brand)} · ${esc(p.sku)}</p>
        <h3>${esc(pf(p, 'name'))}</h3>
        <div class="card__specs">${pf(p, 'tags').slice(0, 3).map((tg) => `<span>${esc(tg)}</span>`).join('')}</div>
        <div class="card__foot">
          <a class="card__link" href="product.html?id=${encodeURIComponent(p.id)}">${t.view3d}</a>
          <button class="rfq-add" data-id="${esc(p.id)}" aria-pressed="${state.rfq.has(p.id)}" aria-label="${esc(t.addTo(pf(p, 'name')))}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button>
        </div>
      </div>
    </article>`).join('');
  current = list; if (mountCardViewer) mount3D();
  [...grid.children].forEach((el, i) => { el.style.setProperty('--i', i); el.classList.add('card--in'); });
}

function updateRfq() {
  localStorage.setItem('ttc-rfq', JSON.stringify([...state.rfq]));
  const bar = document.querySelector('.rfq-bar');
  bar.querySelector('b').textContent = state.rfq.size;
  bar.classList.toggle('is-visible', state.rfq.size > 0);
}

grid.addEventListener('click', (e) => {
  const b = e.target.closest('.rfq-add'); if (!b) return;
  const id = b.dataset.id;
  state.rfq.has(id) ? state.rfq.delete(id) : state.rfq.add(id);
  b.setAttribute('aria-pressed', state.rfq.has(id)); updateRfq();
});

document.querySelector('.search input').addEventListener('input', (e) => { state.q = e.target.value; render(); });
document.querySelector('.filters__toggle').addEventListener('click', (e) => {
  const f = document.querySelector('.filters'); const on = f.classList.toggle('is-open');
  e.currentTarget.setAttribute('aria-expanded', on);
});

chips(document.querySelector('[data-chips="type"]'), types, 'type');
chips(document.querySelector('[data-chips="brand"]'), brands, 'brand');
let current = [];
function mount3D() { grid.querySelectorAll('canvas').forEach((cv, i) => mountCardViewer(cv, current[i])); document.documentElement.classList.add('is-3d'); }
render(); updateRfq(); initMotion();
onFirstInteraction(() => import('./three/models.js?v=2611221351').then((m) => { mountCardViewer = m.mountCardViewer; mount3D(); }));
