import * as THREE from 'three';

// STAR FIELD BACKGROUND
const starsContainer = document.getElementById('stars-container');
const starsScene = new THREE.Scene();
const starsCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
starsCamera.position.z = 5;

const starsRenderer = new THREE.WebGLRenderer({ alpha: true });
starsRenderer.setSize(window.innerWidth, window.innerHeight);
starsContainer.appendChild(starsRenderer.domElement);

function createStarTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(0,0,0,1)');
  gradient.addColorStop(0.3, 'rgba(0,0,0,0.5)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

const starGeometry = new THREE.BufferGeometry();
const starCount = 5000;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) {
  starPositions[i] = (Math.random() - 0.5) * 200;
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

const starMaterial = new THREE.PointsMaterial({
  color: 0x000000,
  size: 0.3,
  sizeAttenuation: true,
  transparent: true,
  map: createStarTexture(),
  depthWrite: false,
  depthTest: true,
});
const stars = new THREE.Points(starGeometry, starMaterial);
starsScene.add(stars);

let mouseX = 0;
let mouseY = 0;
window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function animateStars() {
  requestAnimationFrame(animateStars);
  stars.rotation.y += (mouseX * 0.3 - stars.rotation.y) * 0.05;
  stars.rotation.x += (mouseY * 0.3 - stars.rotation.x) * 0.05;
  starsRenderer.render(starsScene, starsCamera);
}
animateStars();

window.addEventListener('resize', () => {
  starsCamera.aspect = window.innerWidth / window.innerHeight;
  starsCamera.updateProjectionMatrix();
  starsRenderer.setSize(window.innerWidth, window.innerHeight);
});

// SPINNING WIREFRAME CUBE
const cubeContainer = document.getElementById('cube-container');
const cubeScene = new THREE.Scene();
const cubeCamera = new THREE.PerspectiveCamera(75, cubeContainer.clientWidth / cubeContainer.clientHeight, 0.1, 1000);
cubeCamera.position.z = 10;

const cubeRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
cubeRenderer.setSize(cubeContainer.clientWidth, cubeContainer.clientHeight);
cubeContainer.appendChild(cubeRenderer.domElement);

const boxGeometry = new THREE.BoxGeometry(7, 7, 7);
const edges = new THREE.EdgesGeometry(boxGeometry);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
const cube = new THREE.LineSegments(edges, lineMaterial);
cubeScene.add(cube);

// pastel fill that fades in while the cube is being pressed/dragged, and fades out on release
const FILL_OPACITY = 0.25;
const fillMaterial = new THREE.MeshBasicMaterial({
  color: 0xc9b6f0,
  transparent: true,
  opacity: 0,
  side: THREE.DoubleSide,
  depthWrite: true,
});
const cubeFill = new THREE.Mesh(boxGeometry, fillMaterial);
cube.add(cubeFill);

let isDragging = false;
let lastPointerX = 0;
let lastPointerY = 0;
let fillOpacityTarget = 0;

cubeContainer.style.cursor = 'grab';

cubeContainer.addEventListener('mousedown', (e) => {
  isDragging = true;
  lastPointerX = e.clientX;
  lastPointerY = e.clientY;
  cubeContainer.style.cursor = 'grabbing';
  fillOpacityTarget = FILL_OPACITY;
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const deltaX = e.clientX - lastPointerX;
  const deltaY = e.clientY - lastPointerY;
  cube.rotation.y += deltaX * 0.01;
  cube.rotation.x += deltaY * 0.01;
  lastPointerX = e.clientX;
  lastPointerY = e.clientY;
});

window.addEventListener('mouseup', () => {
  if (!isDragging) return;
  isDragging = false;
  cubeContainer.style.cursor = 'grab';
  fillOpacityTarget = 0;
});

function animateCube() {
  requestAnimationFrame(animateCube);
  if (!isDragging) {
    cube.rotation.y += 0.003;
    cube.rotation.x += 0.0015;
  }
  fillMaterial.opacity += (fillOpacityTarget - fillMaterial.opacity) * 0.15;
  cubeRenderer.render(cubeScene, cubeCamera);
}
animateCube();

window.addEventListener('resize', () => {
  cubeCamera.aspect = cubeContainer.clientWidth / cubeContainer.clientHeight;
  cubeCamera.updateProjectionMatrix();
  cubeRenderer.setSize(cubeContainer.clientWidth, cubeContainer.clientHeight);
});

// CURSOR GLOW
const cursorGlow = document.getElementById('cursor-glow');

window.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top = `${e.clientY}px`;
});

document.querySelectorAll('nav a').forEach((el) => {
  el.addEventListener('mouseenter', () => cursorGlow.classList.add('hidden'));
  el.addEventListener('mouseleave', () => cursorGlow.classList.remove('hidden'));
});

// PAGE FADE TRANSITION
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
