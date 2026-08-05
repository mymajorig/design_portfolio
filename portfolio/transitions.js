// Shared page transition: a full-screen "curtain" painted in a project's theme
// color. It rises over the page when you click a project card, and on the
// project page it collapses down into the Back button — so the color "molds"
// into the button and stays there.
//
// Per-project colors will come from the database later (a `themeColor` field on
// each project); until then everything falls back to the Querri brand orange.
const DEFAULT_THEME_COLOR = '#da855e';
const STORAGE_KEY = 'projectTransitionColor';
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Call from a project card's click handler (list page / home page).
export function playExitToProject(href, color) {
  const themeColor = color || DEFAULT_THEME_COLOR;
  // hand the color to the destination page so it can continue the curtain
  sessionStorage.setItem(STORAGE_KEY, themeColor);

  if (REDUCED_MOTION) {
    window.location.href = href;
    return;
  }

  const curtain = document.createElement('div');
  curtain.className = 'page-curtain';
  curtain.style.backgroundColor = themeColor;
  document.body.appendChild(curtain);

  // one clean fade-in of the theme color
  requestAnimationFrame(() => curtain.classList.add('page-curtain--visible'));

  // navigate once the fade has finished; the destination page paints the same
  // color on its first frame (see the inline script in project.html), so the
  // color stays put across the navigation — no blink, no second fade
  setTimeout(() => {
    window.location.href = href;
  }, 550);
}

// Call once on the project detail page as it loads.
export function playEnterFromProject() {
  const color = sessionStorage.getItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);

  // arrived without a transition (direct load / refresh / reduced motion): just
  // fade the page in. Theme the back button directly so it's visible at rest —
  // it inherits --theme-color from <html> (set by showIndividualProject), so we
  // only need to add the class, no stored transition color required.
  if (!color || REDUCED_MOTION) {
    document.documentElement.style.backgroundColor = '';
    requestAnimationFrame(() => document.body.classList.add('page-loaded'));
    const backButton = document.querySelector('.back-button');
    if (backButton) backButton.classList.add('back-button--themed');
    return;
  }

  const curtain = document.createElement('div');
  curtain.className = 'page-curtain page-curtain--visible';
  curtain.style.backgroundColor = color;
  // explicit full-screen size so width/height can animate to the button later
  curtain.style.width = '100%';
  curtain.style.height = '100%';
  document.body.appendChild(curtain);

  // reveal the page content behind the curtain
  document.body.classList.add('page-loaded');

  const backButton = document.querySelector('.back-button');

  // Color the button NOW, while it's still hidden under the full-screen curtain.
  // That way, when the curtain finishes shrinking onto it, the two are already
  // identical — the handoff is invisible and the collapse + button read as one
  // continuous motion instead of "collapse, then the button separately appears".
  themeBackButton(color);

  // hide the real button while the curtain collapses, so you don't see it sitting
  // in the background before the curtain lands on it (that double-image is what
  // read as choppy). visibility (not display) keeps its layout box so the collapse
  // can still measure where to shrink to. It's revealed again in finish().
  if (backButton) backButton.style.visibility = 'hidden';

  // hold on the colored screen briefly, then flow down into the back button
  setTimeout(() => {
    if (!backButton) {
      curtain.style.opacity = '0';
      curtain.addEventListener('transitionend', () => {
        curtain.remove();
        document.documentElement.style.backgroundColor = '';
      }, { once: true });
      return;
    }

    const rect = backButton.getBoundingClientRect();
    curtain.classList.add('page-curtain--collapsing');
    curtain.style.top = `${rect.top}px`;
    curtain.style.left = `${rect.left}px`;
    curtain.style.width = `${rect.width}px`;
    curtain.style.height = `${rect.height}px`;
    curtain.style.borderRadius = '999px';

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      // Reveal the pill FIRST (it's identical to, and directly under, the
      // collapsed curtain), THEN remove the curtain — so the pill handoff stays
      // invisible. The "Back" label starts transparent (set with no transition,
      // so the reveal itself doesn't animate) so it doesn't pop in with the pill...
      backButton.style.color = 'transparent';
      backButton.style.visibility = 'visible';
      curtain.remove();
      document.documentElement.style.backgroundColor = '';
      // ...then a moment later, add the transition and clear the color so the
      // label fades from transparent to its real color. Uses setTimeout, not
      // requestAnimationFrame: rAF is paused in a background tab, which would
      // leave the label stuck invisible; setTimeout still fires, so the label is
      // guaranteed to end up visible.
      setTimeout(() => {
        backButton.style.transition = 'color 0.4s ease';
        backButton.style.color = '';
      }, 60);
    };
    // finish when the size animation completes (fallback in case it doesn't fire)
    curtain.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'width') finish();
    });
    setTimeout(finish, 1000); // fallback, slightly longer than the collapse
  }, 300);
}

// Give the back button the project's theme color as its background.
function themeBackButton(color) {
  const backButton = document.querySelector('.back-button');
  if (!backButton) return;
  backButton.style.setProperty('--theme-color', color);
  backButton.classList.add('back-button--themed');
}
