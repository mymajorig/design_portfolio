// Demo of fetching + rendering project data from the API.
// This is a REFERENCE for wiring your real pages later — the fetch calls are
// exactly what project_list.js and project.js would use.

const listEl = document.querySelector('#list');
const detailEl = document.querySelector('#detail');

// Escape text before putting it into innerHTML (good habit — prevents a stray
// quote or < in your data from breaking the markup).
const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );

// ── List view: GET /api/projects ───────────────────────────────────────────
async function loadList() {
  const res = await fetch('/api/projects');
  const projects = await res.json(); // -> an array of project rows

  if (projects.length === 0) {
    listEl.innerHTML =
      '<p class="empty">No projects yet. Add rows with <code>npm run db:studio</code>.</p>';
    return;
  }

  // Each card links to #<slug>, which the router below turns into a detail view.
  listEl.innerHTML = projects
    .map(
      (p) => `
      <a class="card" href="#${esc(p.slug)}">
        ${p.previewImage ? `<img src="${esc(p.previewImage)}" alt="" />` : ''}
        <h2>${esc(p.title)}</h2>
        <p>${esc(p.headliner)}</p>
      </a>`
    )
    .join('');
}

// ── Detail view: GET /api/projects/:slug ────────────────────────────────────
async function loadDetail(slug) {
  const res = await fetch(`/api/projects/${encodeURIComponent(slug)}`);
  if (!res.ok) {
    detailEl.innerHTML = `<p class="empty">Project "${esc(slug)}" not found.</p>`;
    return;
  }
  const p = await res.json(); // -> one project row

  // key_learnings is a JSON column, so it arrives already parsed as an array.
  const learnings = Array.isArray(p.keyLearnings) ? p.keyLearnings : [];

  detailEl.innerHTML = `
    <button class="back" onclick="location.hash=''">&larr; All projects</button>
    <p class="label">${esc(p.label)}</p>
    <h1>${esc(p.title)}</h1>
    <p class="one-liner">${esc(p.oneLiner).replace(/\n/g, '<br>')}</p>
    <p>${esc(p.description)}</p>
    ${
      learnings.length
        ? `<h3>Key Learnings</h3><ol>${learnings.map((l) => `<li>${esc(l)}</li>`).join('')}</ol>`
        : ''
    }
  `;
}

// ── Tiny router: switch views based on the URL hash ─────────────────────────
// (Your real site uses separate pages + ?slug= instead — same idea, this just
//  keeps the whole demo on one page.)
function route() {
  const slug = location.hash.slice(1);
  const showDetail = Boolean(slug);
  listEl.hidden = showDetail;
  detailEl.hidden = !showDetail;
  if (showDetail) loadDetail(slug);
  else loadList();
}

window.addEventListener('hashchange', route);
route();
