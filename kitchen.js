'use strict';
document.documentElement.classList.add('js');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');
menuToggle.hidden = false;
const closeMenu = () => {
  mainNav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
};
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  mainNav.classList.toggle('is-open', open);
});
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && mainNav.classList.contains('is-open')) {
    closeMenu();
    menuToggle.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
window.matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);
const finishes = {
  ivory: { image: 'assets/kitchen-ivory.webp', alt: 'Soft ivory cabinetry inspiration with natural oak and brass', description: 'Soft ivory, natural oak and subtle brass. An inviting take on timeless design.' },
  walnut: { image: 'assets/kitchen-walnut.webp', alt: 'Warm walnut cabinetry inspiration with sculptural natural stone', description: 'Rich walnut, sculptural stone and warm brass. A grounded, architectural statement.' }
};
document.querySelector('.finish-controls').hidden = false;
document.querySelectorAll('.finish-button').forEach(button => {
  button.addEventListener('click', () => {
    const finish = finishes[button.dataset.finish];
    const image = document.querySelector('#cabinet-image');
    image.src = finish.image;
    image.alt = finish.alt;
    document.querySelector('#finish-description').textContent = finish.description;
    document.querySelectorAll('.finish-button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  });
});
const range = document.querySelector('#comparison-range');
document.querySelector('.comparison-controls').hidden = false;
range.addEventListener('input', () => {
  document.querySelector('#comparison').style.setProperty('--split', `${range.value}%`);
  range.setAttribute('aria-valuetext', `${range.value} percent before concept visible`);
});
const comparison = document.querySelector('#comparison');
const revealAt = event => {
  const bounds = comparison.getBoundingClientRect();
  range.value = Math.round(Math.max(0, Math.min(100, (event.clientX - bounds.left) / bounds.width * 100)));
  range.dispatchEvent(new Event('input'));
};
comparison.addEventListener('pointerdown', event => {
  if (event.button !== 0) return;
  comparison.setPointerCapture(event.pointerId);
  revealAt(event);
});
comparison.addEventListener('pointermove', event => {
  if (comparison.hasPointerCapture(event.pointerId)) revealAt(event);
});
comparison.addEventListener('pointerup', event => {
  if (comparison.hasPointerCapture(event.pointerId)) comparison.releasePointerCapture(event.pointerId);
});
const form = document.querySelector('#estimate-form');
const emailReady = document.querySelector('#email-ready');
const copyStatus = document.querySelector('#copy-status');
const copyFallback = document.querySelector('#copy-fallback');
let draftText = '';
form.hidden = false;
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const value = name => String(data.get(name) || '').trim();
  draftText = [
    'Hello Accent Property Services,', '', 'I would like to discuss a kitchen renovation.', '',
    `Name: ${value('name')}`, `Email: ${value('email')}`, `Phone: ${value('phone') || 'Not provided'}`,
    `Project ZIP code: ${value('zip')}`, `Investment range: ${value('budget') || 'Let’s discuss'}`,
    `Ideal timing: ${value('timing') || 'Still exploring'}`, `Cabinet style: ${value('cabinet') || 'Help me choose'}`, `Project direction: ${value('package')}`,  '', 'My project:', value('vision'), '',
    'I can share kitchen photos and approximate measurements as needed.'
  ].join('\n');
  document.querySelector('#email-draft').href = `mailto:accentgv@gmail.com?subject=${encodeURIComponent('Kitchen Renovation Estimate')}&body=${encodeURIComponent(draftText)}`;
  form.hidden = true;
  emailReady.hidden = false;
  copyStatus.textContent = '';
  copyFallback.hidden = true;
  emailReady.focus({ preventScroll: true });
  emailReady.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
});
document.querySelector('#edit-details').addEventListener('click', () => {
  emailReady.hidden = true;
  form.hidden = false;
  form.elements.name.focus({ preventScroll: true });
});
document.querySelector('#copy-details').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(draftText);
    copyStatus.textContent = 'Copied. Paste your details into an email to accentgv@gmail.com.';
    copyFallback.hidden = true;
  } catch {
    copyFallback.value = draftText;
    copyFallback.hidden = false;
    copyFallback.focus();
    copyFallback.select();
    copyStatus.textContent = 'Select and copy the project details below, then paste them into your email.';
  }
});

// Supplier styles are intentionally distinct from the conceptual kitchen images.
const cabinetCards = [...document.querySelectorAll('.cabinet-card')];
document.querySelector('.collection-filters').hidden = false;
document.querySelectorAll('[data-series-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-series-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  cabinetCards.forEach(card => { card.hidden = button.dataset.seriesFilter !== 'all' && card.dataset.series !== button.dataset.seriesFilter; });
  document.querySelector('#cabinet-count').textContent = cabinetCards.filter(card => !card.hidden).length + ' cabinet styles';
}));
const showEstimateForm = () => { emailReady.hidden = true; form.hidden = false; };
document.querySelectorAll('.choose-cabinet').forEach(button => {
  button.hidden = false;
  button.addEventListener('click', () => {
    showEstimateForm(); form.elements.cabinet.value = button.dataset.style;
    form.elements.package.value = 'Cabinetry project';
    document.querySelector('#estimate').scrollIntoView();
    form.elements.name.focus({ preventScroll: true });
  });
});
document.querySelector('#choose-upgrade').addEventListener('click', () => {
  showEstimateForm(); form.elements.package.value = 'Level 1 cabinets + installation — $2,950.00';
  form.elements.budget.value = 'Under $25,000'; form.elements.cabinet.value = ''; 
});
