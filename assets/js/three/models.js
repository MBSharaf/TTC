// Procedural, high-quality 3D security cameras (Three.js).
// Used until real Hyper3D .glb models are dropped in /assets/models/.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const shell = (color = 0xf2f4f8) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.32, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.18 });
const dark = () => new THREE.MeshPhysicalMaterial({ color: 0x14161c, roughness: 0.35, metalness: 0.4, clearcoat: 0.6 });
const metal = () => new THREE.MeshStandardMaterial({ color: 0x9aa3b2, roughness: 0.25, metalness: 1 });
const glass = () => new THREE.MeshPhysicalMaterial({ color: 0x0b0d14, roughness: 0.02, metalness: 0, transmission: 0.25, transparent: true, opacity: 0.92, clearcoat: 1, ior: 1.5 });
const domeGlass = () => new THREE.MeshPhysicalMaterial({ color: 0x1b1f2a, roughness: 0.03, transmission: 0.85, thickness: 0.4, transparent: true, opacity: 0.55, clearcoat: 1, ior: 1.45 });
const accent = (c = 0x6a4bff) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 1.6, roughness: 0.4 });

function lens(radius = 0.32) {
  const g = new THREE.Group();
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 1.05, 0.2, 64), dark());
  barrel.rotation.x = Math.PI / 2; g.add(barrel);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(radius * 0.92, 0.025, 16, 64), metal());
  ring.position.z = 0.1; g.add(ring);
  const iris = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.78, 48, 32, 0, Math.PI * 2, 0, Math.PI / 2), glass());
  iris.rotation.x = Math.PI / 2; iris.position.z = 0.08; iris.scale.z = 0.45; g.add(iris);
  const pupil = new THREE.Mesh(new THREE.CircleGeometry(radius * 0.22, 32), accent(0x3fe8da));
  pupil.position.z = 0.115; g.add(pupil);
  for (let i = 0; i < 8; i++) { // IR LEDs
    const a = (i / 8) * Math.PI * 2;
    const led = new THREE.Mesh(new THREE.CircleGeometry(0.03, 16), new THREE.MeshStandardMaterial({ color: 0x400000, emissive: 0x7a0010, emissiveIntensity: 0.8 }));
    led.position.set(Math.cos(a) * radius * 1.25, Math.sin(a) * radius * 1.25, 0.06); g.add(led);
  }
  return g;
}

export function buildBullet() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 1.6, 16, 64), shell());
  body.rotation.x = Math.PI / 2; g.add(body);
  const hood = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 2.0, 64, 1, true, -Math.PI * 0.62, Math.PI * 1.24), shell(0xe8ebf1));
  hood.material.side = THREE.DoubleSide; hood.rotation.x = Math.PI / 2; hood.rotation.y = Math.PI; hood.position.set(0, 0.04, 0.12); g.add(hood);
  const face = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.06, 64), dark());
  face.rotation.x = Math.PI / 2; face.position.z = 1.18; g.add(face);
  const l = lens(0.22); l.position.z = 1.22; g.add(l);
  const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.425, 0.012, 8, 96), accent()); stripe.position.z = 0.55; g.add(stripe);
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.7, 32), shell()); arm.position.set(0, 0.7, -0.25); g.add(arm);
  const joint = new THREE.Mesh(new THREE.SphereGeometry(0.15, 32, 16), metal()); joint.position.set(0, 0.42, -0.25); g.add(joint);
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.08, 64), shell()); plate.position.set(0, 1.08, -0.25); g.add(plate);
  g.rotation.x = 0.18; g.position.y = -0.25;
  return g;
}

export function buildDome() {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.12, 0.32, 96), shell()); g.add(base);
  const lip = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.05, 16, 96), metal()); lip.rotation.x = Math.PI / 2; lip.position.y = -0.17; g.add(lip);
  const bubble = new THREE.Mesh(new THREE.SphereGeometry(0.9, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), domeGlass()); bubble.position.y = -0.16; g.add(bubble);
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.58, 64, 32), dark()); ball.position.y = -0.32; g.add(ball);
  const l = lens(0.26); l.position.set(0, -0.48, 0.42); l.rotation.x = 0.55; g.add(l);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.08, 0.012, 8, 128), accent()); ring.rotation.x = Math.PI / 2; ring.position.y = 0.02; g.add(ring);
  g.rotation.x = Math.PI; g.rotation.x = -0.35; g.position.y = 0.25;
  g.scale.setScalar(1.05);
  // flip so the dome looks down-forward
  const wrap = new THREE.Group(); wrap.add(g); g.rotation.set(Math.PI - 0.5, 0, 0);
  return wrap;
}

export function buildPTZ() {
  const g = new THREE.Group();
  const mount = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.9, 48), shell()); mount.position.y = 1.15; g.add(mount);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.1, 64), shell()); cap.position.y = 1.62; g.add(cap);
  const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.62, 0.42, 96), shell()); housing.position.y = 0.55; g.add(housing);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.014, 8, 128), accent()); ring.rotation.x = Math.PI / 2; ring.position.y = 0.34; g.add(ring);
  const head = new THREE.Group(); head.position.y = -0.05; g.add(head);
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.64, 96, 64), dark()); head.add(sphere);
  const window = new THREE.Mesh(new THREE.SphereGeometry(0.66, 64, 32, -0.5, 1, 1.1, 0.95), domeGlass()); window.rotation.y = 0; head.add(window);
  const l = lens(0.25); l.position.set(0, -0.06, 0.6); head.add(l);
  const wiper = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.5, 0.05), metal()); wiper.position.set(0.42, 0.1, 0.47); head.add(wiper);
  g.userData.head = head;
  g.position.y = -0.3;
  return g;
}

export const builders = { bullet: buildBullet, dome: buildDome, ptz: buildPTZ };

/* One WebGL context for the whole page. Phones allow only a few contexts and drop the oldest
   (the hero) when more are created, so every view renders here and is copied into its own 2D canvas. */
const MOBILE = matchMedia('(max-width: 960px)').matches;
const DPR = Math.min(devicePixelRatio || 1, MOBILE ? 1.5 : 2);
let shared;
function getShared() {
  if (shared) return shared;
  const gl = new THREE.WebGLRenderer({ canvas: document.createElement('canvas'), antialias: !MOBILE, alpha: true, powerPreference: 'high-performance' });
  gl.setPixelRatio(1);
  gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.05;
  gl.outputColorSpace = THREE.SRGBColorSpace;
  gl.setClearColor(0x000000, 0);
  const pmrem = new THREE.PMREMGenerator(gl);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture; pmrem.dispose();
  shared = { gl, env };
  return shared;
}

/** Stage: scene + camera + lights, drawn through the shared renderer into `canvas`. */
export function createStage(canvas, { fov = 32, distance = 6 } = {}) {
  const { gl, env } = getShared();
  const ctx = canvas.getContext('2d');
  const scene = new THREE.Scene(); scene.environment = env;
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);
  camera.position.set(0, 0.4, distance);
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 5, 4); scene.add(key);
  const rimV = new THREE.PointLight(0x6a4bff, 30, 20); rimV.position.set(-4, 1, -2); scene.add(rimV);
  const rimT = new THREE.PointLight(0x3fe8da, 22, 20); rimT.position.set(4, -1, -2); scene.add(rimT);
  scene.add(new THREE.AmbientLight(0xffffff, 0.25));
  let w = 0, h = 0;
  const resize = () => {
    const cw = canvas.clientWidth, ch = canvas.clientHeight;
    if (!cw || !ch) return;
    w = Math.round(cw * DPR); h = Math.round(ch * DPR);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    camera.aspect = cw / ch; camera.updateProjectionMatrix();
  };
  resize();
  new ResizeObserver(resize).observe(canvas);
  const renderer = {
    domElement: canvas,
    render(sc, cam) {
      if (!w || !h) return;
      const el = gl.domElement;
      if (el.width < w || el.height < h) gl.setSize(Math.max(el.width, w), Math.max(el.height, h), false);
      gl.setViewport(0, el.height - h, w, h); gl.setScissor(0, el.height - h, w, h); gl.setScissorTest(true);
      gl.clear(); gl.render(sc, cam);
      ctx.clearRect(0, 0, w, h); ctx.drawImage(el, 0, 0, w, h, 0, 0, w, h);
    },
  };
  return { THREE, renderer, scene, camera, resize };
}

/** Returns a model: GLB if provided (Hyper3D export), otherwise procedural. */
export async function loadProductModel(product) {
  if (product.model) {
    try {
      const gltf = await new GLTFLoader().loadAsync(product.model);
      const obj = gltf.scene;
      const box = new THREE.Box3().setFromObject(obj);
      const size = box.getSize(new THREE.Vector3()).length();
      obj.scale.setScalar(3 / size);
      box.setFromObject(obj); obj.position.sub(box.getCenter(new THREE.Vector3()));
      const wrap = new THREE.Group(); wrap.add(obj); return wrap;
    } catch (e) { console.warn('GLB failed, using procedural model', e); }
  }
  return (builders[product.shape] || buildBullet)();
}

/** Lightweight renderer for many small cards: only renders while visible. */
export function mountCardViewer(canvas, product) {
  const stage = createStage(canvas, { distance: 6.4 });
  let model, visible = false, hover = false, t = Math.random() * 6;
  loadProductModel(product).then((m) => { model = m; model.rotation.y = -0.6; stage.scene.add(model); stage.renderer.render(stage.scene, stage.camera); });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);
  const card = canvas.closest('.card');
  card?.addEventListener('pointerenter', () => (hover = true));
  card?.addEventListener('pointerleave', () => (hover = false));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tick = () => {
    if (!canvas.isConnected) return; // card removed by a filter change: stop this loop
    requestAnimationFrame(tick);
    if (!visible || !model) return;
    t += hover ? 0.03 : 0.006;
    if (!reduce) { model.rotation.y = -0.6 + Math.sin(t) * (hover ? 1.4 : 0.35); model.position.y = Math.sin(t * 1.3) * 0.05; }
    stage.renderer.render(stage.scene, stage.camera);
  };
  tick();
}
