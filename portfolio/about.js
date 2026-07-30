// Fade the page in on load, and fade it out before navigating away — matching
// the page transition used on the other pages.
requestAnimationFrame(() => document.body.classList.add('page-loaded'));

document.querySelectorAll('a[href]').forEach((link) => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('http') || link.target === '_blank') return;

  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.remove('page-loaded');
    setTimeout(() => {
      window.location.href = href;
    }, 400);
  });
});
