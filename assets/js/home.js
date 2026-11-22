// Homepage: everything here is lightweight. three.js + 3D scenes load on first interaction only.
import { renderLayout, initMotion, splitWords, onFirstInteraction } from './layout.js?v=2611221351';

renderLayout('index.html');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Hero headline entrance (CSS) ---------- */
if (!reduce) splitWords(document.querySelector('.hero h1'));

/* ---------- Sticky scroll story (no ScrollTrigger): shared state read by the 3D scene ---------- */
const story = { progress: 0, active: 0 };
function initStory() {
  const sec = document.querySelector('.story'); if (!sec) return;
  const steps = [...sec.querySelectorAll('.story__step')];
  const bars = [...sec.querySelectorAll('.story__progress b')];
  const big = sec.querySelector('.story__big');
  const nums = document.dir === 'rtl' ? ['٠١', '٠٢', '٠٣'] : ['01', '02', '03'];
  let shown = -1;
  const set = (i) => {
    if (i === shown) return; shown = i;
    steps.forEach((s, k) => s.classList.toggle('is-active', k === i));
    if (big) { big.textContent = nums[i]; big.classList.remove('is-anim'); void big.offsetWidth; big.classList.add('is-anim'); }
  };
  const update = () => {
    const r = sec.getBoundingClientRect();
    const p = Math.min(Math.max(-r.top / (r.height - innerHeight), 0), 0.9999);
    story.progress = p; story.active = Math.floor(p * 3);
    bars.forEach((b, k) => (b.style.transform = `scaleX(${Math.min(Math.max(p * 3 - k, 0), 1)})`));
    set(story.active);
  };
  if (reduce) { sec.classList.add('is-static'); steps.forEach((s) => s.classList.add('is-active')); return; }
  addEventListener('scroll', update, { passive: true }); addEventListener('resize', update); requestAnimationFrame(update);
}

/* ================= Industries carousel: arrows, drag, progress, autoplay ================= */
function initCarousel() {
  const track = document.querySelector('.ind-track'); if (!track) return;
  const bar = document.querySelector('.ind-dots i');
  const [prev, next] = document.querySelectorAll('.ind-btn');
  const rtl = document.dir === 'rtl';
  const step = () => track.querySelector('.ind-card').getBoundingClientRect().width + 16;
  const max = () => track.scrollWidth - track.clientWidth;
  const pos = () => Math.abs(track.scrollLeft); // RTL scrollLeft is negative
  const update = () => {
    const p = max() ? pos() / max() : 0;
    const vis = track.clientWidth / track.scrollWidth;
    bar.style.width = vis * 100 + '%'; bar.style.insetInlineStart = p * (1 - vis) * 100 + '%';
    prev.disabled = pos() < 4; next.disabled = pos() > max() - 4;
  };
  const go = (dir) => track.scrollBy({ left: dir * step() * (rtl ? -1 : 1), behavior: 'smooth' });
  prev.addEventListener('click', () => go(-1)); next.addEventListener('click', () => go(1));
  track.addEventListener('scroll', update, { passive: true }); addEventListener('resize', update); update();
  track.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') go(rtl ? -1 : 1); if (e.key === 'ArrowLeft') go(rtl ? 1 : -1); });
  // mouse drag (touch uses native scrolling)
  let down = false, sx = 0, sl = 0, moved = false;
  track.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = track.scrollLeft; track.classList.add('is-dragging'); });
  addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; track.scrollLeft = sl - dx; });
  addEventListener('pointerup', () => { if (!down) return; down = false; track.classList.remove('is-dragging'); });
  track.addEventListener('click', (e) => moved && e.preventDefault(), true);
  // gentle autoplay, paused on hover/focus/touch
  let paused = false;
  ['pointerenter', 'focusin', 'touchstart'].forEach((ev) => track.addEventListener(ev, () => (paused = true), { passive: true }));
  ['pointerleave', 'focusout'].forEach((ev) => track.addEventListener(ev, () => (paused = false)));
  if (!reduce) setInterval(() => { if (paused || down) return; pos() > max() - 4 ? track.scrollTo({ left: 0, behavior: 'smooth' }) : go(1); }, 4500);
}


/* ---------- Services: tabs, keyboard, auto-advance, calculator ---------- */
function initServices() {
  const tabs = [...document.querySelectorAll('.svc-tab')]; if (!tabs.length) return;
  const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')));
  const DUR = 7000; let cur = 0, auto = !reduce, paused = false, start = performance.now(), pausedAt = 0, visible = false;
  const show = (i, focus = false) => {
    if (i === cur && !panels[i].hidden) return;
    tabs.forEach((t, k) => { t.setAttribute('aria-selected', k === i); t.tabIndex = k === i ? 0 : -1; t.querySelector('.svc-tab__bar').style.transform = 'scaleX(0)'; });
    panels.forEach((p, k) => (p.hidden = k !== i));
    cur = i; start = performance.now();
    if (focus) tabs[i].focus();
    const list = tabs[i].parentElement; // keep the active tab visible in the mobile strip without scrolling the page
    if (list.scrollWidth > list.clientWidth) list.scrollTo({ left: tabs[i].offsetLeft - 20, behavior: 'smooth' });
    if (!reduce) { const p = panels[i]; p.classList.remove('is-anim'); void p.offsetWidth; p.classList.add('is-anim'); }
  };
  const stopAuto = () => { auto = false; tabs.forEach((t) => (t.querySelector('.svc-tab__bar').style.transform = 'scaleX(0)')); };
  tabs.forEach((t, i) => t.addEventListener('click', () => { stopAuto(); show(i); }));
  document.querySelector('.svc-tabs').addEventListener('keydown', (e) => {
    const rtl = document.dir === 'rtl';
    const map = { ArrowDown: 1, ArrowUp: -1, ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 };
    if (e.key in map) { e.preventDefault(); stopAuto(); show((cur + map[e.key] + tabs.length) % tabs.length, true); }
    if (e.key === 'Home') { e.preventDefault(); stopAuto(); show(0, true); }
    if (e.key === 'End') { e.preventDefault(); stopAuto(); show(tabs.length - 1, true); }
  });
  const box = document.querySelector('.svc');
  box.addEventListener('pointerenter', () => (paused = true));
  box.addEventListener('pointerleave', () => { paused = false; start = performance.now() - pausedAt; });
  box.addEventListener('focusin', () => (paused = true));
  let running = false;
  const tick = (now) => {
    if (!auto || !visible) { running = false; return; }   // loop only while on screen
    requestAnimationFrame(tick);
    if (paused) { pausedAt = now - start; return; }
    const k = Math.min((now - start) / DUR, 1);
    tabs[cur].querySelector('.svc-tab__bar').style.transform = `scaleX(${k})`;
    if (k >= 1) show((cur + 1) % tabs.length);
  };
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && auto && !running) { running = true; start = performance.now() - pausedAt; requestAnimationFrame(tick); }
    else if (!visible) pausedAt = performance.now() - start;
  }, { threshold: 0.35 }).observe(box);

  // Configuration calculator (quick H.265 estimate)
  const form = document.querySelector('[data-calc]'); if (!form) return;
  const rate = { 2: 2, 4: 3.5, 5: 4.2, 8: 7 }; // Mbps per camera @15fps
  const ar = document.documentElement.lang === 'ar';
  const nf = (v, d = 1) => v.toLocaleString(ar ? 'ar-EG' : 'en-US', { maximumFractionDigits: d });
  const calc = () => {
    const f = Object.fromEntries(new FormData(form));
    form.querySelectorAll('input[type=range]').forEach((r) => (r.nextElementSibling.textContent = nf(+r.value, 0)));
    const bw = rate[f.res] * (+f.fps / 15) * +f.cams;
    const tb = (bw * +f.mode * 86400 * +f.days) / 8 / 1e6;
    form.querySelector('[data-out=tb]').textContent = tb < 1 ? `${nf(tb * 1000, 0)} GB` : `${nf(tb)} TB`;
    form.querySelector('[data-out=bw]').textContent = bw < 1000 ? `${nf(bw, 0)} Mbps` : `${nf(bw / 1000, 2)} Gbps`;
  };
  form.addEventListener('input', () => { stopAuto(); calc(); }); calc();
}

initMotion();
initStory();
initCarousel();
initServices();
onFirstInteraction(() => import('./scenes/home3d.js?v=2611221351').then((m) => m.start(story)));
