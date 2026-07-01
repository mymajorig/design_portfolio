import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('three-container').appendChild(renderer.domElement);

// stars
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
const positions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 200;
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.3,
  sizeAttenuation: true,
  transparent: true,
  map: createStarTexture(),
  depthWrite: false,
  depthTest: true,
});
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// cube setup 

//geometry and material
const geometry = new THREE.BoxGeometry(3, 3, 3);
const material = new THREE.MeshNormalMaterial();

// const material = new THREE.MeshStandardMaterial({
//   color: 0xF2F0EF,
//   metalness: 0.3,
//   roughness: 0.1,
//   envMapIntensity: 1,
// });

//making cube
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const edges = new THREE.EdgesGeometry(geometry);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
const wireframe = new THREE.LineSegments(edges, lineMaterial);
cube.add(wireframe);

// lights
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(5, 3, 2);
scene.add(light);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const light2 = new THREE.DirectionalLight(0xffffff, 1);
light2.position.set(-5, -3, -2);
scene.add(light2);


camera.position.z = 5;

// mouse
let mouseX = 0;
let mouseY = 0;
window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

let time = 0;
function animate() {
  requestAnimationFrame(animate);
  time += 0.005;

  cube.rotation.x = Math.sin(time) * 0.2;
  cube.rotation.y = Math.sin(time * 0.7) * 0.2;

  stars.rotation.y += (mouseX * 0.3 - stars.rotation.y) * 0.05;
  stars.rotation.x += (mouseY * 0.3 - stars.rotation.x) * 0.05;

  const h1 = document.querySelector('h1');
  h1.style.transform = `rotateY(${cube.rotation.y}rad) rotateX(${-cube.rotation.x}rad)`;

  renderer.render(scene, camera);
}
animate();

//fixing perspective 
const fov = 75;
const height = window.innerHeight;
const perspective = (height / 2) / Math.tan((fov / 2) * Math.PI / 180);

document.querySelector('.overlay').style.perspective = `${perspective}px`;
