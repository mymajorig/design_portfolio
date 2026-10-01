// Fade the page in on load, and fade it out before navigating away — matching
// the page transition used on about.html.
requestAnimationFrame(() => document.body.classList.add('page-loaded'));

// If the browser restores this page from bfcache (e.g. hitting Back after a
// same-tab navigation away), re-add page-loaded so it doesn't stay stuck
// invisible at the opacity:0 it was faded out to before leaving.
window.addEventListener('pageshow', (e) => {
  if (e.persisted) document.body.classList.add('page-loaded');
});

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
