import * as THREE from 'three';

// STARS BACKGROUND
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
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.3, 'rgba(255,255,255,0.5)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
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

// SPINNING WIREFRAME CUBE AROUND "PROJECTS"
const titleCubeContainer = document.getElementById('title-cube-container');
const titleCubeScene = new THREE.Scene();
const titleCubeCamera = new THREE.PerspectiveCamera(75, titleCubeContainer.clientWidth / titleCubeContainer.clientHeight, 0.1, 1000);
titleCubeCamera.position.z = 10;

const titleCubeRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
titleCubeRenderer.setSize(titleCubeContainer.clientWidth, titleCubeContainer.clientHeight);
titleCubeContainer.appendChild(titleCubeRenderer.domElement);

const titleBoxGeometry = new THREE.BoxGeometry(7, 7, 7);
const titleEdges = new THREE.EdgesGeometry(titleBoxGeometry);
const titleLineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
const titleCube = new THREE.LineSegments(titleEdges, titleLineMaterial);
titleCubeScene.add(titleCube);

function animateTitleCube() {
  requestAnimationFrame(animateTitleCube);
  titleCube.rotation.y += 0.003;
  titleCube.rotation.x += 0.0015;
  titleCubeRenderer.render(titleCubeScene, titleCubeCamera);
}
animateTitleCube();

window.addEventListener('resize', () => {
  titleCubeCamera.aspect = titleCubeContainer.clientWidth / titleCubeContainer.clientHeight;
  titleCubeCamera.updateProjectionMatrix();
  titleCubeRenderer.setSize(titleCubeContainer.clientWidth, titleCubeContainer.clientHeight);
});

// CURSOR GLOW
const cursorGlow = document.getElementById('cursor-glow');

window.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top = `${e.clientY}px`;
});

document.querySelectorAll('.project, .back-button').forEach((el) => {
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