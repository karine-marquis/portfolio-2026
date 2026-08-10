const body = document.body;
const progress = document.createElement('div');
progress.className = 'progress';
document.body.appendChild(progress);
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  progress.style.width = `${scrolled}%`;
});
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');
if (burger && nav) burger.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
  link.addEventListener('click', e => {
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return;
    e.preventDefault();
    body.classList.add('fade-out');
    setTimeout(() => location.href = link.href, 260);
  });
});
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, {threshold:.12});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
const form = document.querySelector('[data-contact-form]');
if (form) form.addEventListener('submit', e => {
  e.preventDefault();
  document.querySelector('.toast')?.classList.add('show');
  form.reset();
});
