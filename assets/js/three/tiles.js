// Category 3D models for the Solutions tiles + a shared tile viewer.
import * as THREE from 'three';
import { createStage, buildDome, buildPTZ, buildBullet } from './models.js?v=2611221351';

const shell = (c = 0xf2f4f8) => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.3, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.15 });
const dark = () => new THREE.MeshPhysicalMaterial({ color: 0x161922, roughness: 0.32, metalness: 0.5, clearcoat: 0.6 });
const metal = () => new THREE.MeshStandardMaterial({ color: 0xa3acbb, roughness: 0.22, metalness: 1 });
const glass = () => new THREE.MeshPhysicalMaterial({ color: 0x0b0d14, roughness: 0.04, transmission: 0.2, transparent: true, opacity: 0.95, clearcoat: 1 });
const led = (c, i = 2) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: i });

function rbox(w, h, d, r, mat) {
  const s = new THREE.Shape(); const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 4, curveSegments: 16 });
  g.translate(0, 0, -d / 2);
  return new THREE.Mesh(g, mat);
}

export function buildReader() {
  const g = new THREE.Group();
  g.add(rbox(1.3, 2.1, 0.22, 0.22, dark()));
  const face = rbox(1.1, 1.9, 0.04, 0.18, glass()); face.position.z = 0.15; g.add(face);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.035, 16, 64), led(0x3fe8da, 2.5)); ring.position.set(0, 0.3, 0.2); g.add(ring);
  const logo = new THREE.Mesh(new THREE.CircleGeometry(0.12, 32), led(0x8b74ff, 1.5)); logo.position.set(0, 0.3, 0.2); g.add(logo);
  for (let i = 0; i < 12; i++) {
    const k = new THREE.Mesh(new THREE.CircleGeometry(0.075, 24), metal());
    k.position.set((i % 3 - 1) * 0.28, -0.25 - Math.floor(i / 3) * 0.2, 0.2); g.add(k);
  }
  const card = rbox(1.05, 0.66, 0.03, 0.08, shell(0xffffff));
  const stripe = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.12), led(0x6a4bff, 1.2)); stripe.position.set(0, 0.16, 0.04); card.add(stripe);
  const chip = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.15), metal()); chip.position.set(-0.3, -0.08, 0.04); card.add(chip);
  card.position.set(1.0, 0.55, 0.8); card.rotation.set(-0.2, -0.5, 0.25); g.add(card);
  g.userData = { card, pulse: ring };
  return g;
}

export function buildDetector() {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.2, 0.18, 96), shell()));
  const body = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.08, 0.45, 96), shell(0xf6f7fa)); body.position.y = -0.3; g.add(body);
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * Math.PI * 2;
    const v = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.3, 0.06), dark());
    v.position.set(Math.cos(a) * 1.04, -0.3, Math.sin(a) * 1.04); v.rotation.y = -a; g.add(v);
  }
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.95, 0.16, 96), shell()); cap.position.y = -0.6; g.add(cap);
  const grill = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.025, 8, 64), metal()); grill.rotation.x = Math.PI / 2; grill.position.y = -0.69; g.add(grill);
  const l = new THREE.Mesh(new THREE.SphereGeometry(0.08, 24, 16), led(0xff3355, 3)); l.position.set(0.55, -0.67, 0.2); g.add(l);
  g.userData = { pulse: l }; g.rotation.x = 0.6;
  return g;
}

export function buildServer() {
  const g = new THREE.Group(); const leds = [];
  for (let u = 0; u < 3; u++) {
    const unit = new THREE.Group(); unit.position.y = (u - 1) * 0.62;
    unit.add(rbox(2.6, 0.52, 1.6, 0.06, dark()));
    const front = rbox(2.5, 0.44, 0.03, 0.05, new THREE.MeshPhysicalMaterial({ color: 0x232838, metalness: 0.6, roughness: 0.3 })); front.position.z = 0.83; unit.add(front);
    for (let b = 0; b < 8; b++) {
      const bay = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.32, 0.02), metal()); bay.position.set(-1.0 + b * 0.26, 0, 0.86); unit.add(bay);
      const l = new THREE.Mesh(new THREE.CircleGeometry(0.028, 12), led(b % 3 ? 0x3fe8da : 0x8b74ff, 2)); l.position.set(-1.0 + b * 0.26, 0.12, 0.88); unit.add(l); leds.push(l);
    }
    const strip = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.018, 0.01), led(0x6a4bff, 1.8)); strip.position.set(0, -0.2, 0.87); unit.add(strip);
    g.add(unit);
  }
  g.userData = { leds }; g.rotation.set(0.15, -0.45, 0);
  return g;
}

export function buildSwitch() {
  const g = new THREE.Group(); const leds = [];
  g.add(rbox(3.0, 0.42, 1.4, 0.06, shell(0xe9ecf2)));
  const panel = rbox(2.9, 0.34, 0.03, 0.04, dark()); panel.position.z = 0.73; g.add(panel);
  for (let i = 0; i < 24; i++) {
    const col = i % 12, row = Math.floor(i / 12);
    const port = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 0.05), new THREE.MeshStandardMaterial({ color: 0x05070d, roughness: 0.8 }));
    port.position.set(-1.2 + col * 0.19, 0.06 - row * 0.13, 0.75); g.add(port);
    const l = new THREE.Mesh(new THREE.PlaneGeometry(0.035, 0.022), led(i % 2 ? 0x3fe8da : 0x7cff9c, 2)); l.position.set(-1.25 + col * 0.19, 0.135 - row * 0.13, 0.78); g.add(l); leds.push(l);
  }
  [-1.2, -0.63, -0.06, 0.51].forEach((x, i) => {
    const c = new THREE.CatmullRomCurve3([new THREE.Vector3(x, 0.06, 0.8), new THREE.Vector3(x, -0.25, 1.35), new THREE.Vector3(x + 0.3 * (i - 1.5), -1.1, 1.6)]);
    g.add(new THREE.Mesh(new THREE.TubeGeometry(c, 32, 0.035, 8), new THREE.MeshStandardMaterial({ color: [0x6a4bff, 0x0a7cff, 0x3fe8da, 0x8b74ff][i], roughness: 0.45 })));
  });
  g.userData = { leds }; g.rotation.set(0.4, -0.35, 0); g.position.y = 0.3;
  return g;
}

export function buildIntercom() {
  const g = new THREE.Group();
  g.add(rbox(1.2, 2.4, 0.28, 0.16, new THREE.MeshPhysicalMaterial({ color: 0x2c313d, metalness: 0.9, roughness: 0.26, clearcoat: 0.6 })));
  const cam = new THREE.Mesh(new THREE.CircleGeometry(0.2, 48), glass()); cam.position.set(0, 0.8, 0.2); g.add(cam);
  const camRing = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.025, 12, 48), metal()); camRing.position.set(0, 0.8, 0.2); g.add(camRing);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.06, 24), led(0x3fe8da, 1.2)); lens.position.set(0, 0.8, 0.21); g.add(lens);
  for (let i = 0; i < 5; i++) { const sp = new THREE.Mesh(new THREE.CircleGeometry(0.028, 12), dark()); sp.position.set(-0.2 + i * 0.1, 0.38, 0.2); g.add(sp); }
  const btn = rbox(0.8, 0.5, 0.06, 0.1, glass()); btn.position.set(0, -0.3, 0.18); g.add(btn);
  const bell = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.025, 12, 48), led(0x8b74ff, 2.5)); bell.position.set(0, -0.3, 0.23); g.add(bell);
  const nfc = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.35), new THREE.MeshStandardMaterial({ color: 0x1a1f2a, roughness: 0.4 })); nfc.position.set(0, -0.85, 0.2); g.add(nfc);
  g.userData = { pulse: bell }; g.rotation.y = -0.4;
  return g;
}


export function buildAccessories() { // IR illuminator + magnetic door lock
  const g = new THREE.Group(); const leds = [];
  const ill = new THREE.Group(); ill.position.set(-0.75, 0.35, 0); ill.rotation.y = 0.35; g.add(ill);
  ill.add(rbox(1.5, 1.1, 0.5, 0.12, dark()));
  const lens = rbox(1.3, 0.9, 0.04, 0.1, glass()); lens.position.z = 0.27; ill.add(lens);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) {
    const l = new THREE.Mesh(new THREE.CircleGeometry(0.06, 16), led(0xff2244, 1.5)); l.position.set(-0.5 + c * 0.2, -0.3 + r * 0.2, 0.3); ill.add(l); leds.push(l);
  }
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.6, 24), metal()); arm.position.set(0, -0.8, -0.1); ill.add(arm);
  const lock = new THREE.Group(); lock.position.set(1.0, -0.55, 0.3); lock.rotation.y = -0.4; g.add(lock);
  lock.add(rbox(1.6, 0.42, 0.42, 0.06, shell(0xdfe3ea)));
  const plate = rbox(1.5, 0.36, 0.08, 0.05, metal()); plate.position.set(0, 0.45, 0); lock.add(plate);
  const ind = new THREE.Mesh(new THREE.CircleGeometry(0.05, 16), led(0x4dd0d0, 2.5)); ind.position.set(0.6, 0, 0.22); lock.add(ind);
  g.userData = { leds, pulse: ind };
  return g;
}

export function buildCameraTrio() {
  const g = new THREE.Group();
  const d = buildDome(); d.position.set(-2.4, 0.2, -0.3); d.scale.setScalar(0.9); g.add(d);
  const p = buildPTZ(); p.position.set(0, 0.3, 0.4); p.scale.setScalar(1.1); g.add(p);
  const b = buildBullet(); b.position.set(2.4, 0.2, -0.3); b.scale.setScalar(0.9); g.add(b);
  g.userData = { parts: [d, p, b], head: p.userData.head };
  return g;
}

const builders = { ptz: buildPTZ, accessories: buildAccessories, cctv: buildCameraTrio, access: buildReader, fire: buildDetector, vms: buildServer, network: buildSwitch, intercom: buildIntercom };

/** One category model per tile. Animates only while visible; reacts to hover. */
export function mountTileViewer(canvas, kind) {
  const wide = kind === 'cctv'; const mid = kind === 'accessories';
  const stage = createStage(canvas, { distance: wide ? 9.6 : mid ? 6.6 : 5.8, fov: 30 });
  const model = (builders[kind] || buildBullet)();
  stage.scene.add(model);
  const u = model.userData, baseY = model.position.y, baseR = model.rotation.y;
  const tile = canvas.closest('.tile');
  let hover = 0, hv = 0, visible = false;
  tile?.addEventListener('pointerenter', () => (hover = 1));
  tile?.addEventListener('pointerleave', () => (hover = 0));
  new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: '120px' }).observe(canvas);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clock = new THREE.Clock();
  stage.renderer.render(stage.scene, stage.camera);
  (function tick() {
    requestAnimationFrame(tick);
    if (!visible || reduce) return;
    const t = clock.getElapsedTime();
    hv += (hover - hv) * 0.08;
    model.rotation.y = baseR + Math.sin(t * 0.5) * 0.3 + hv * 0.7;
    model.position.y = baseY + Math.sin(t * 1.2) * 0.06;
    model.scale.setScalar(1 + hv * 0.08);
    if (u.pulse) u.pulse.material.emissiveIntensity = 1.6 + Math.sin(t * 4) * 1.2;
    if (u.leds) u.leds.forEach((l, i) => (l.material.emissiveIntensity = Math.sin(t * 6 + i * 1.7) > 0.2 ? 2.4 : 0.15));
    if (u.card) { u.card.position.x = 1.0 - hv * 0.55; u.card.position.z = 0.8 - hv * 0.4; }
    if (u.head) u.head.rotation.y = Math.sin(t * 0.8) * 0.8;
    if (u.parts) u.parts.forEach((p, i) => (p.rotation.y = Math.sin(t * 0.6 + i * 1.3) * 0.45));
    stage.renderer.render(stage.scene, stage.camera);
  })();
}
