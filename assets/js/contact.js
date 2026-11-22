// Contact page: accessible client-side validation, loading state, success state, click-to-load map.
// The submit currently simulates the request; swap `sendRequest` for a real POST when the backend exists.
import { renderLayout, initMotion } from './layout.js';

renderLayout('contact.html');
initMotion();

const form = document.querySelector('.cform');
const msgs = JSON.parse(form.dataset.msgs);
const rules = {
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || msgs.email,
  phone: (v) => /^[+\d][\d\s()-]{6,}$/.test(v) || msgs.phone,
};

function check(input) {
  const v = input.value.trim();
  let err = v ? true : msgs.req;
  if (err === true && rules[input.name]) err = rules[input.name](v);
  const box = input.closest('.field');
  box.classList.toggle('is-invalid', err !== true);
  box.querySelector('.field__err').textContent = err === true ? '' : err;
  input.setAttribute('aria-invalid', err !== true);
  return err === true;
}

form.querySelectorAll('input,textarea').forEach((el) => {
  el.addEventListener('blur', () => el.value && check(el));
  el.addEventListener('input', () => el.closest('.field').classList.contains('is-invalid') && check(el));
});

// Backend hook: replace with fetch('/api/contact', { method: 'POST', body: new FormData(form) })
const sendRequest = () => new Promise((r) => setTimeout(r, 900));

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fields = [...form.querySelectorAll('input,textarea')];
  const ok = fields.map(check).every(Boolean);
  if (!ok) { fields.find((f) => f.getAttribute('aria-invalid') === 'true')?.focus(); return; }
  const btn = form.querySelector('[type=submit]');
  btn.classList.add('is-loading'); btn.setAttribute('aria-busy', 'true');
  await sendRequest();
  form.classList.add('is-sent');
  form.querySelector('.cform__ok').focus?.();
});

// Google Maps is heavy: load the iframe only when the visitor asks for it.
document.querySelector('[data-map]')?.addEventListener('click', (e) => {
  const card = e.currentTarget.parentElement;
  const f = document.createElement('iframe');
  f.title = 'TTC Distribution — Google Maps';
  f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
  f.src = 'https://www.google.com/maps?q=47+Nabil+El+Wakad+Street,+Ard+El+Golf,+Cairo,+Egypt&output=embed';
  card.replaceChildren(f);
});
