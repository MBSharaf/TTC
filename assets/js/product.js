import { getProduct, products } from './data/products.js?v=2611221351';
import { renderLayout, initMotion, onFirstInteraction } from './layout.js?v=2611221351';
import { t, pf, specKey } from './i18n.js?v=2611221351';

renderLayout('products.html');
const id = new URLSearchParams(location.search).get('id') || products[0].id;
const p = getProduct(id) || products[0];
const $ = (s) => document.querySelector(s);

// ---- Content (textContent only: safe for future API data) ----
document.title = `${pf(p, 'name')} — ${pf(p, 'type')} ${t.titleSuffix}`;
document.querySelector('meta[name=description]').content = pf(p, 'summary');
$('[data-crumb]').textContent = pf(p, 'name');
$('[data-brand]').textContent = `${p.brand} · ${pf(p, 'type')}`;
$('h1').textContent = pf(p, 'name');
$('[data-summary]').textContent = pf(p, 'summary');
$('[data-sku]').textContent = `SKU ${p.sku}`;
const meta = $('.pdp__meta');
pf(p, 'tags').forEach((tg) => { const s = document.createElement('span'); s.textContent = tg; meta.append(s); });
const dl = $('.specs dl');
Object.entries(p.specs).forEach(([k, v]) => {
  const dt = document.createElement('dt'), dd = document.createElement('dd');
  dt.textContent = specKey(k); dd.textContent = v; dd.dir = 'ltr'; dd.style.textAlign = 'start'; dl.append(dt, dd);
});

// JSON-LD Product
const ld = document.createElement('script'); ld.type = 'application/ld+json';
ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: p.name, sku: p.sku, brand: { '@type': 'Brand', name: p.brand }, description: p.summary, category: p.type });
document.head.append(ld);

// ---- 3D viewer (lazy): drag to rotate 360°, pinch/scroll to zoom, preset angles ----
async function start3D() {
  const [THREE, { OrbitControls }, { createStage, loadProductModel }] = await Promise.all([
    import('three'), import('three/addons/controls/OrbitControls.js'), import('./three/models.js?v=2611221351')]);
  const canvas = $('.viewer canvas');
  const { scene, camera, renderer } = createStage(canvas, { distance: matchMedia('(max-width: 960px)').matches ? 6.8 : 6, fov: 30 });
  const controls = new OrbitControls(camera, canvas);
  Object.assign(controls, { enableDamping: true, dampingFactor: 0.06, enablePan: false, minDistance: 3.2, maxDistance: 11, autoRotate: true, autoRotateSpeed: 1.2 });
  controls.addEventListener('start', () => (controls.autoRotate = false));
  const floor = new THREE.Mesh(new THREE.CircleGeometry(2.2, 64), new THREE.MeshBasicMaterial({ color: 0x5238b2, transparent: true, opacity: 0.08 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -1.6; scene.add(floor);
  let model, grow = 0;
  loadProductModel(p).then((m) => { model = m; m.scale.setScalar(0.01); scene.add(m); });
  const D = camera.position.z;
  const presets = { front: [0, 0.3, D], side: [D, 0.3, 0], top: [0, D, 0.01], back: [0, 0.3, -D] };
  let target = null;
  document.querySelectorAll('.views button').forEach((b) => b.addEventListener('click', () => {
    document.querySelectorAll('.views button').forEach((x) => x.setAttribute('aria-pressed', x === b));
    controls.autoRotate = false; target = new THREE.Vector3(...presets[b.dataset.view]);
  }));
  $('[data-autorotate]').addEventListener('click', (e) => { controls.autoRotate = !controls.autoRotate; e.currentTarget.setAttribute('aria-pressed', controls.autoRotate); });
  (function tick() {
    requestAnimationFrame(tick);
    if (model && grow < 1) { grow = Math.min(grow + 0.03, 1); model.scale.setScalar(1 - Math.pow(1 - grow, 4) + 0.001); }
    if (target) { camera.position.lerp(target, 0.08); if (camera.position.distanceTo(target) < 0.01) target = null; }
    controls.update(); renderer.render(scene, camera);
  })();
  document.documentElement.classList.add('is-3d');
}
start3D();

// Quote button
const rfq = new Set(JSON.parse(localStorage.getItem('ttc-rfq') || '[]'));
const addBtn = $('[data-add-rfq]');
const sync = () => (addBtn.textContent = rfq.has(p.id) ? t.added : t.add);
addBtn.addEventListener('click', () => { rfq.has(p.id) ? rfq.delete(p.id) : rfq.add(p.id); localStorage.setItem('ttc-rfq', JSON.stringify([...rfq])); sync(); });
sync();

initMotion();
