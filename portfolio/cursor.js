// Directional cursor: an outlined black circle with a filled black pointer
// arrow that snaps to one of 4 modes — up / right / down / left — to match
// whichever way the mouse is currently moving, replacing the OS pointer
// everywhere on the site.
//
// The arrow glyph itself points "up" at rest (0deg). atan2(dy, dx) gives the
// movement angle in the math convention (0deg = pointing right), so +90deg
// re-bases it onto our glyph's "up = 0" convention; that continuous angle is
// then snapped to the nearest cardinal direction (0/90/180/270).
//
// Several layers keep 4-mode switching from feeling choppy:
//  1. The raw per-event mouse delta is noisy (hand tremor, diagonal movement
//     zig-zags a few degrees frame to frame) — smoothing it into a running
//     velocity vector before computing an angle from it means the direction
//     being snapped is already clean, not jittery.
//  2. A hysteresis margin around each 90deg boundary means the mode only
//     switches once the movement is solidly past the midpoint between two
//     directions, so hovering near a diagonal doesn't flicker between modes.
//  3. The displayed angle eases toward the snapped target on a
//     requestAnimationFrame loop (not inside the mousemove handler), so each
//     mode switch reads as a smooth turn rather than an instant jump-cut.
// A faint CSS blur scales up only during that turn and eases out quickly, as
// a cheap stand-in for real motion blur.

const SIZE = 40;
const MAX_BLUR_PX = 0.9;
const BLUR_START_DEG_PER_SEC = 450; // below this speed, no blur at all
const BLUR_MAX_DEG_PER_SEC = 1400;  // at/above this speed, blur is maxed out
const VELOCITY_SMOOTHING = 0.35;    // how quickly the smoothed velocity vector catches up to the raw one
const SNAP_HYSTERESIS_DEG = 15;     // extra margin past the 45deg midpoint before switching modes

function shortestAngleDelta(current, target) {
  // the signed difference along whichever direction is closer, so the arrow
  // never spins the "long way" around when crossing the 0/360 seam
  return ((target - current + 540) % 360) - 180;
}

function nearestCardinal(angle) {
  return (((Math.round(angle / 90) * 90) % 360) + 360) % 360;
}

export function initDirectionalCursor() {
  // skip touch devices — there's no "mouse" to point with there
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursorEl = document.createElement('div');
  cursorEl.id = 'directional-cursor';
  cursorEl.innerHTML = `
    <svg viewBox="0 0 40 40" width="${SIZE}" height="${SIZE}">
      <circle cx="20" cy="20" r="20" fill="#1e1e1e"/>
      <path d="M20 10 L20 30 M20 10 L13 17 M20 10 L27 17"
            stroke="#F2F0EF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>
  `;
  document.body.appendChild(cursorEl);

  let currentAngle = 0;
  let targetAngle = 0;
  let currentBlur = 0;
  let lastX = null;
  let lastY = null;
  let lastFrameTime = performance.now();
  let smoothVX = 0;
  let smoothVY = 0;

  window.addEventListener('mousemove', (e) => {
    cursorEl.style.left = `${e.clientX}px`;
    cursorEl.style.top = `${e.clientY}px`;

    if (lastX !== null) {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      // smooth the velocity vector itself (not just the angle derived from
      // it) so a couple of noisy, zig-zagging events in a row don't each
      // yank the target angle around
      smoothVX += (dx - smoothVX) * VELOCITY_SMOOTHING;
      smoothVY += (dy - smoothVY) * VELOCITY_SMOOTHING;

      if (Math.hypot(smoothVX, smoothVY) > 0.6) {
        const rawAngle = Math.atan2(smoothVY, smoothVX) * (180 / Math.PI) + 90;
        // only switch modes once movement is solidly past the midpoint
        // between the current mode and its neighbor — keeps the cursor
        // "sticky" in one mode instead of flickering near a 45deg diagonal
        const driftFromCurrentMode = Math.abs(shortestAngleDelta(targetAngle, rawAngle));
        if (driftFromCurrentMode > 45 + SNAP_HYSTERESIS_DEG) {
          targetAngle = nearestCardinal(rawAngle);
        }
      }
    }
    lastX = e.clientX;
    lastY = e.clientY;
  });

  function animate(now) {
    requestAnimationFrame(animate);
    const dt = Math.min((now - lastFrameTime) / 1000, 0.1); // clamp to avoid jumps after a tab switch
    lastFrameTime = now;

    const delta = shortestAngleDelta(currentAngle, targetAngle);
    // exponential smoothing, normalized to elapsed time so the turn speed
    // stays consistent regardless of frame rate
    const ease = 1 - Math.pow(0.0015, dt);
    currentAngle += delta * ease;

    // only sharp, fast direction changes earn any blur at all (slow/ordinary
    // turning stays perfectly crisp); it eases back to 0 fast once it settles
    const angularSpeed = Math.abs(delta * ease) / dt; // degrees per second
    const blurRange = BLUR_MAX_DEG_PER_SEC - BLUR_START_DEG_PER_SEC;
    const targetBlur = Math.min(Math.max(angularSpeed - BLUR_START_DEG_PER_SEC, 0) / blurRange, 1) * MAX_BLUR_PX;
    currentBlur += (targetBlur - currentBlur) * 0.5;

    cursorEl.style.transform = `translate(-50%, -50%) rotate(${currentAngle}deg)`;
    cursorEl.style.filter = currentBlur > 0.05 ? `blur(${currentBlur.toFixed(2)}px)` : 'none';
  }
  requestAnimationFrame(animate);

  document.addEventListener('mouseleave', () => cursorEl.classList.add('hidden'));
  document.addEventListener('mouseenter', () => cursorEl.classList.remove('hidden'));

  // elements that need the real OS cursor (e.g. a draggable 3d shape showing
  // grab/grabbing) opt out by setting data-cursor-hide
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('[data-cursor-hide]')) cursorEl.classList.add('hidden');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('[data-cursor-hide]')) cursorEl.classList.remove('hidden');
  });
}
