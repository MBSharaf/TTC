// Heavy 3D scenes for the homepage. Loaded only after the first user interaction (see home.js),
// so three.js never blocks first paint / TBT.
import * as THREE from 'three';
import { createStage, buildPTZ, buildBullet, buildDome } from '../three/models.js';
import { mountTileViewer } from '../three/tiles.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = matchMedia('(max-width: 960px)').matches;

/* ================= HERO: PTZ camera inside a data-globe ================= */
function initHero() {
  const canvas = document.querySelector('.hero__canvas');
  const { scene, camera, renderer } = createStage(canvas, { distance: 9.5, fov: 34 });
  const root = new THREE.Group(); scene.add(root);
  root.position.set(isMobile ? 0 : (document.dir === 'rtl' ? -2.6 : 2.6), 0, 0);
  if (isMobile) root.scale.setScalar(0.72);

  // Camera hero object
  const cam = buildPTZ(); cam.scale.setScalar(0.95); cam.position.y = 0.15; root.add(cam);

  // Particle globe (fibonacci sphere)
  const N = isMobile ? 1400 : 2600, R = 2.6;
  const pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  const cA = new THREE.Color(0x8b74ff), cB = new THREE.Color(0x3fe8da);
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.39996;
    pos.set([Math.cos(th) * r * R, y * R, Math.sin(th) * r * R], i * 3);
    const c = cA.clone().lerp(cB, (y + 1) / 2); col.set([c.r, c.g, c.b], i * 3);
  }
  const pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  pg.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const points = new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.022, vertexColors: true, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending }));
  root.add(points);

  // Network arcs between "cities" on the globe
  const arcs = new THREE.Group(); root.add(arcs);
  const toVec = (lat, lon) => { const p = (90 - lat) * Math.PI / 180, t = (lon + 180) * Math.PI / 180;
    return new THREE.Vector3(-R * Math.sin(p) * Math.cos(t), R * Math.cos(p), R * Math.sin(p) * Math.sin(t)); };
  const hub = toVec(30, 31); // Cairo
  const cities = [[24.7, 46.7], [25.2, 55.3], [6.5, 3.4], [-1.3, 36.8], [33.9, 35.5], [31.9, 35.9], [15.5, 32.5], [-26.2, 28], [36.8, 10.2], [29.4, 48]];
  const arcMats = [];
  cities.forEach(([la, lo], i) => {
    const end = toVec(la, lo);
    const mid = hub.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(R * 1.35);
    const curve = new THREE.QuadraticBezierCurve3(hub, mid, end);
    const geo = new THREE.TubeGeometry(curve, 64, 0.008, 6, false);
    const mat = new THREE.MeshBasicMaterial({ color: i % 2 ? 0x3fe8da : 0x8b74ff, transparent: true, opacity: 0.9 });
    geo.setDrawRange(0, 0); arcMats.push({ geo, total: geo.index.count, delay: i * 0.25 });
    arcs.add(new THREE.Mesh(geo, mat));
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })); dot.position.copy(end); arcs.add(dot);
  });
  const hubDot = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), new THREE.MeshBasicMaterial({ color: 0x3fe8da })); hubDot.position.copy(hub); arcs.add(hubDot);
  arcs.rotation.y = -0.9; points.rotation.y = -0.9;

  // Orbit rings
  [3.05, 3.45].forEach((r, i) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.004, 8, 256), new THREE.MeshBasicMaterial({ color: i ? 0x3fe8da : 0x8b74ff, transparent: true, opacity: 0.35 }));
    ring.rotation.set(Math.PI / 2.2 + i * 0.3, i * 0.5, 0); root.add(ring); ring.userData.spin = i ? -0.0015 : 0.002;
  });

  // Scanning light cone from the lens
  const cone = new THREE.Mesh(new THREE.ConeGeometry(1.2, 4, 64, 1, true),
    new THREE.MeshBasicMaterial({ color: 0x3fe8da, transparent: true, opacity: 0.06, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
  cone.rotation.x = -Math.PI / 2; cone.position.z = 2.6; cam.userData.head.add(cone);

  // Interaction
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener('pointermove', (e) => { mouse.tx = e.clientX / innerWidth - 0.5; mouse.ty = e.clientY / innerHeight - 0.5; }, { passive: true });
  let scrollP = 0;
  const hero = document.querySelector('.hero');
  if (!reduce) addEventListener('scroll', () => { const r = hero.getBoundingClientRect(); scrollP = Math.min(Math.max(-r.top / r.height, 0), 1); }, { passive: true });

  // Intro
  root.scale.multiplyScalar(0.001);
  const target = isMobile ? 0.72 : 1;
  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);
  const clock = new THREE.Clock();
  (function tick() {
    requestAnimationFrame(tick);
    if (!visible) return;
    const t = clock.getElapsedTime();
    const k = Math.min(t / 1.6, 1); const fit = isMobile ? target : THREE.MathUtils.clamp(camera.aspect / 1.9, 1, 1.5); root.scale.setScalar(fit * (1 - Math.pow(1 - k, 4)) + 0.001);
    mouse.x += (mouse.tx - mouse.x) * 0.05; mouse.y += (mouse.ty - mouse.y) * 0.05;
    if (!reduce) {
      points.rotation.y += 0.0012; arcs.rotation.y += 0.0012;
      cam.userData.head.rotation.y = Math.sin(t * 0.5) * 0.7 + mouse.x * 0.8;
      cam.userData.head.rotation.x = 0.15 + mouse.y * 0.4;
      cone.material.opacity = 0.05 + Math.sin(t * 2) * 0.02;
      root.children.forEach((c) => c.userData.spin && (c.rotation.z += c.userData.spin));
      arcMats.forEach((a) => { const p = THREE.MathUtils.clamp((t - 0.8 - a.delay) / 1.4, 0, 1); a.geo.setDrawRange(0, Math.floor(a.total * p)); });
    } else arcMats.forEach((a) => a.geo.setDrawRange(0, a.total));
    if (!isMobile) { // keep the scene centred in the right half and sized to the screen
      const halfW = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z * camera.aspect;
      root.position.x = (document.dir === 'rtl' ? -1 : 1) * halfW * 0.48;
    }
    root.rotation.y = mouse.x * 0.25 + scrollP * 0.8;
    root.rotation.x = mouse.y * 0.12;
    root.position.y = scrollP * 1.5;
    camera.position.z = 9.5 + scrollP * 2;
    renderer.render(scene, camera);
  })();
}

/* ================= STORY: scroll-pinned product walkthrough ================= */
function initStory(story) {
  const canvas = document.querySelector('.story__stage canvas');
  const { scene, camera, renderer } = createStage(canvas, { distance: isMobile ? 7.4 : 6.4 });
  const models = [buildDome(), buildBullet(), buildPTZ()];
  models.forEach((m, i) => { m.visible = i === 0; scene.add(m); });
  // Glowing turntable under the product
  const deck = new THREE.Group(); deck.position.y = -1.5; deck.scale.setScalar(0.85); scene.add(deck);
  deck.add(new THREE.Mesh(new THREE.CylinderGeometry(1.9, 2.0, 0.12, 96), new THREE.MeshPhysicalMaterial({ color: 0xeef0f7, metalness: 0.2, roughness: 0.3, clearcoat: 1 })));
  const glowRing = new THREE.Mesh(new THREE.TorusGeometry(1.95, 0.025, 12, 128), new THREE.MeshStandardMaterial({ color: 0x5238b2, emissive: 0x5238b2, emissiveIntensity: 3 }));
  glowRing.rotation.x = Math.PI / 2; glowRing.position.y = 0.07; deck.add(glowRing);
  let shown = -1;
  let visible = false;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);
  (function tick() {
    requestAnimationFrame(tick);
    if (!visible) return;
    const progress = story.progress, active = story.active;
    if (active !== shown) { models.forEach((mm, k) => (mm.visible = k === active)); shown = active; }
    const local = (progress * 3) % 1;
    const m = models[Math.max(active, 0)];
    m.rotation.y = -0.8 + local * Math.PI * 1.6;
    m.rotation.x = Math.sin(local * Math.PI) * 0.25;
    const s = 0.95 + Math.sin(local * Math.PI) * 0.12; m.scale.setScalar(s);
    deck.rotation.y += 0.004;
    glowRing.material.emissiveIntensity = 2.2 + Math.sin(performance.now() / 400) * 0.8;
    renderer.render(scene, camera);
  })();
}


export function start(story) {
  initHero();
  initStory(story);
  document.querySelectorAll('canvas[data-model]').forEach((c) => mountTileViewer(c, c.dataset.model));
  requestAnimationFrame(() => document.documentElement.classList.add('is-3d'));
}
