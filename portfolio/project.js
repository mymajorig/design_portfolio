import * as THREE from 'three';
import { playEnterFromProject } from './transitions.js';

// CURSOR GLOW
const cursorGlow = document.getElementById('cursor-glow');

window.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top = `${e.clientY}px`;
});

document.querySelectorAll('.back-button').forEach((el) => {
  el.addEventListener('mouseenter', () => cursorGlow.classList.add('hidden'));
  el.addEventListener('mouseleave', () => cursorGlow.classList.remove('hidden'));
});

const container = document.querySelector('#header-3d');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 12;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const pictureGroup = new THREE.Group();
scene.add(pictureGroup);

// This project's theme color, read from the --theme-color CSS variable that
// showIndividualProject sets on <html> before this script runs — so the frame
// and mark match the page accent automatically, per project.
const themeColorValue = getComputedStyle(document.documentElement)
  .getPropertyValue('--theme-color').trim() || '#e0662e';

// two wireframe squares, offset along z so the depth separation reads as you rotate
const squareGeometry = new THREE.PlaneGeometry(6, 6);
const squareEdges = new THREE.EdgesGeometry(squareGeometry);
const SQUARE_FILL_OPACITY = 0.4;

const squareBack = new THREE.LineSegments(squareEdges, new THREE.LineBasicMaterial({ color: 0x000000 }));
squareBack.position.z = 2;
pictureGroup.add(squareBack);

const squareBackFillMaterial = new THREE.MeshBasicMaterial({
  color: new THREE.Color(themeColorValue),
  transparent: true,
  opacity: 0,
  side: THREE.DoubleSide,
  depthWrite: true,
});
const squareBackFill = new THREE.Mesh(squareGeometry, squareBackFillMaterial);
squareBackFill.position.z = 2;
pictureGroup.add(squareBackFill);

const squareFront = new THREE.LineSegments(squareEdges, new THREE.LineBasicMaterial({ color: 0x000000 }));
squareFront.position.z = 5;
squareFront.rotation.z = THREE.MathUtils.degToRad(18);
pictureGroup.add(squareFront);

// the mark: the project's initial drawn on a transparent canvas in the theme
// color, so it reads as flat line-art rather than a pasted-in photo. A canvas
// texture (same trick as the starfield) lets us tint it without an image file.
function createMarkTexture(letter, color) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${size * 0.72}px "Bebas Neue", sans-serif`;
  ctx.fillText(letter, size / 2, size / 2 + size * 0.04);
  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}

const initial = (document.querySelector('.project-name-title')?.textContent || '?')
  .trim().charAt(0).toUpperCase();
const markMaterial = new THREE.MeshBasicMaterial({ transparent: true });
markMaterial.map = createMarkTexture(initial, themeColorValue);
const markPlane = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 3.2), markMaterial);
markPlane.position.z = 5.1;
squareFront.add(markPlane);
// once the brand font finishes loading, redraw the mark in Bebas Neue
document.fonts.ready.then(() => {
  markMaterial.map = createMarkTexture(initial, themeColorValue);
  markMaterial.needsUpdate = true;
});

let isDragging = false;
let lastPointerX = 0;
let lastPointerY = 0;
let idleTime = 0;
let fillOpacityTarget = 0;

// keep the rotation within a range so the mark always stays facing the camera
const MAX_ROTATION_Y = 0.5;
const MAX_ROTATION_X = 0.35;

container.style.cursor = 'grab';

container.addEventListener('mousedown', (e) => {
  isDragging = true;
  lastPointerX = e.clientX;
  lastPointerY = e.clientY;
  container.style.cursor = 'grabbing';
  fillOpacityTarget = SQUARE_FILL_OPACITY;
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const deltaX = e.clientX - lastPointerX;
  const deltaY = e.clientY - lastPointerY;
  pictureGroup.rotation.y = THREE.MathUtils.clamp(pictureGroup.rotation.y + deltaX * 0.01, -MAX_ROTATION_Y, MAX_ROTATION_Y);
  pictureGroup.rotation.x = THREE.MathUtils.clamp(pictureGroup.rotation.x + deltaY * 0.01, -MAX_ROTATION_X, MAX_ROTATION_X);
  lastPointerX = e.clientX;
  lastPointerY = e.clientY;
});

window.addEventListener('mouseup', () => {
  if (!isDragging) return;
  isDragging = false;
  container.style.cursor = 'grab';
  fillOpacityTarget = 0;
  // pick the idle sway back up from wherever the drag left off, so it doesn't jump
  idleTime = Math.asin(THREE.MathUtils.clamp(pictureGroup.rotation.y / MAX_ROTATION_Y, -1, 1));
});

function animate() {
  requestAnimationFrame(animate);
  if (!isDragging) {
    // smooth side-to-side float instead of a constant-speed bounce
    idleTime += 0.006;
    pictureGroup.rotation.y = MAX_ROTATION_Y * Math.sin(idleTime);
    pictureGroup.rotation.x = MAX_ROTATION_X * 0.5 * Math.sin(pictureGroup.rotation.y);
  }
  squareBackFillMaterial.opacity += (fillOpacityTarget - squareBackFillMaterial.opacity) * 0.15;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

// SECTION DECORATIVE SHAPES (goals, research, process, outcome)
// each section header gets its own slowly rotating wireframe shape
function createTraitShape(containerId, geometry) {
  const container = document.querySelector(containerId);
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 7;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const edges = new THREE.EdgesGeometry(geometry);
  const material = new THREE.LineBasicMaterial({ color: 0x000000 });
  const shape = new THREE.LineSegments(edges, material);
  scene.add(shape);

  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.003;
    shape.rotation.y += 0.002;
    shape.rotation.x = Math.sin(time * 0.5) * 0.1;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

createTraitShape('#trait-header-3d', new THREE.BoxGeometry(4, 4, 4));
createTraitShape('#research-3d', new THREE.IcosahedronGeometry(3));
createTraitShape('#process-3d', new THREE.OctahedronGeometry(3));
createTraitShape('#outcome-3d', new THREE.TetrahedronGeometry(3.2));

// LOAD PROJECT CONTENT FROM THE DATABASE
// The URL looks like project.html?slug=querri — we read that slug, fetch that
// one project from the API, and drop its text into the page.
async function loadProject() {
  const slug = new URLSearchParams(location.search).get('slug');
  if (!slug) return; // no slug in the URL: leave the placeholder text as-is

  let project;
  try {
    const res = await fetch(`/api/projects/${encodeURIComponent(slug)}`);
    if (!res.ok) return;
    project = await res.json();
  } catch (err) {
    console.error('Could not load project:', err);
    return;
  }

  document.title = project.title;

  const oneLiner = document.querySelector('.one-liner');
  if (oneLiner && project.oneLiner) {
    oneLiner.style.whiteSpace = 'pre-line'; // render the \n as a line break
    oneLiner.textContent = project.oneLiner;
  }

  const label = document.querySelector('.project-label');
  if (label) label.textContent = project.label ?? '';

  const title = document.querySelector('.project-name-title');
  if (title) title.textContent = project.title ?? '';

  // Key Learnings: rebuild the <ol> from the array stored in the database
  const learningsList = document.querySelector('.key-learnings ol');
  if (learningsList && Array.isArray(project.keyLearnings)) {
    learningsList.innerHTML = '';
    project.keyLearnings.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      learningsList.appendChild(li);
    });
  }

  // Match each section to its blurb by the header text (Goals/Research/etc.)
  const blurbs = {
    goals: project.goals,
    research: project.research,
    process: project.process,
    outcome: project.outcome,
  };
  document.querySelectorAll('.trait-section').forEach((section) => {
    const heading = section.querySelector('h2')?.textContent.trim().toLowerCase();
    const paragraph = section.querySelector('.project-text p');
    if (heading && paragraph && blurbs[heading] != null) {
      paragraph.textContent = blurbs[heading];
    }
  });
}

loadProject();

// PAGE ENTER TRANSITION
// If we arrived from a project card, a colored curtain collapses into the Back
// button; otherwise this just fades the page in.
playEnterFromProject();

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
