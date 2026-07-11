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
cubeCamera.position.z = 7;

const cubeRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
cubeRenderer.setSize(cubeContainer.clientWidth, cubeContainer.clientHeight);
cubeContainer.appendChild(cubeRenderer.domElement);

const boxGeometry = new THREE.BoxGeometry(5, 5, 5);
const edges = new THREE.EdgesGeometry(boxGeometry);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
const cube = new THREE.LineSegments(edges, lineMaterial);
cubeScene.add(cube);

function animateCube() {
  requestAnimationFrame(animateCube);
  cube.rotation.y += 0.003;
  cube.rotation.x += 0.0015;
  cubeRenderer.render(cubeScene, cubeCamera);
}
animateCube();

window.addEventListener('resize', () => {
  cubeCamera.aspect = cubeContainer.clientWidth / cubeContainer.clientHeight;
  cubeCamera.updateProjectionMatrix();
  cubeRenderer.setSize(cubeContainer.clientWidth, cubeContainer.clientHeight);
});
