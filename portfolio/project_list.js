import * as THREE from 'three';
import {FontLoader,TextGeometry} from 'three/examples/jsm/Addons.js';

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
  color: 0xffffff,
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

const container = document.getElementById('title-container'); //grabbing the space where the h1 is so we can make a scene thats the width and height of this container
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

//font loader

const fontLoader = new FontLoader();

fontLoader.load(
  'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
  (font) => {
    const textGeometry = new TextGeometry('PROJECTS', {
      font: font,
      size: 3,
      depth: 0.1,
    });
    textGeometry.computeBoundingBox();
    textGeometry.center();
    const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    scene.add(textMesh);

    camera.position.z = 5;
    textMesh.position.x = 0;

    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(5, 3, 2);
    scene.add(light);

   let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.003;
        textMesh.rotation.y = 0.1 + Math.sin(time) * 0.03; // rocks left and right
        textMesh.rotation.x = Math.sin(time) * 0.1; // fixed upward tilt
        renderer.render(scene, camera);
    }
    animate();
  }
);

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