import * as THREE from 'three';

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

// two wireframe squares, offset along z so the depth separation reads as you rotate
const squareGeometry = new THREE.PlaneGeometry(6, 6);
const squareEdges = new THREE.EdgesGeometry(squareGeometry);
const SQUARE_IDLE_COLOR = 0x000000;
const SQUARE_BACK_ACTIVE_COLOR = 0xe0662e;
const SQUARE_FRONT_ACTIVE_COLOR = 0xf4a261;
const SQUARE_FILL_OPACITY = 0.55;

const squareBackMaterial = new THREE.LineBasicMaterial({ color: SQUARE_IDLE_COLOR });
const squareBack = new THREE.LineSegments(squareEdges, squareBackMaterial);
squareBack.position.z = 2;
pictureGroup.add(squareBack);

const squareBackFillMaterial = new THREE.MeshBasicMaterial({
  color: SQUARE_BACK_ACTIVE_COLOR,
  transparent: true,
  opacity: 0,
  side: THREE.DoubleSide,
  depthWrite: true,
});
const squareBackFill = new THREE.Mesh(squareGeometry, squareBackFillMaterial);
squareBackFill.position.z = 2;
pictureGroup.add(squareBackFill);

const squareFrontMaterial = new THREE.LineBasicMaterial({ color: SQUARE_IDLE_COLOR });
const squareFront = new THREE.LineSegments(squareEdges, squareFrontMaterial);
squareFront.position.z = 5;
squareFront.rotation.z = THREE.MathUtils.degToRad(18);
pictureGroup.add(squareFront);

const squareFrontFillMaterial = new THREE.MeshBasicMaterial({
  color: SQUARE_FRONT_ACTIVE_COLOR,
  transparent: true,
  opacity: 0,
  side: THREE.DoubleSide,
  depthWrite: true,
});
const squareFrontFill = new THREE.Mesh(squareGeometry, squareFrontFillMaterial);
squareFrontFill.position.z = 5;
squareFrontFill.rotation.z = THREE.MathUtils.degToRad(18);
pictureGroup.add(squareFrontFill);

const logoTexture = new THREE.TextureLoader().load('./images/querri-logo.jpeg');
const logoGeometry = new THREE.PlaneGeometry(4, 4);
const logoMaterial = new THREE.MeshBasicMaterial({ map: logoTexture, transparent: true });
const logoPlane = new THREE.Mesh(logoGeometry, logoMaterial);
logoPlane.position.z = 7;
pictureGroup.add(logoPlane);

let isDragging = false;
let lastPointerX = 0;
let lastPointerY = 0;
let idleTime = 0;
let fillOpacityTarget = 0;

// keep the rotation within a range where the logo is always still facing the camera
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
  squareFrontFillMaterial.opacity += (fillOpacityTarget - squareFrontFillMaterial.opacity) * 0.15;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

// GOALS SECTION DECORATIVE SHAPE
const traitContainer = document.querySelector('#trait-header-3d');
const traitScene = new THREE.Scene();
const traitCamera = new THREE.PerspectiveCamera(75, traitContainer.clientWidth / traitContainer.clientHeight, 0.1, 1000);
traitCamera.position.z = 7;

const traitRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
traitRenderer.setSize(traitContainer.clientWidth, traitContainer.clientHeight);
traitContainer.appendChild(traitRenderer.domElement);

const traitGeometry = new THREE.IcosahedronGeometry(4, 5);
const traitMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
  },
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    uniform float time;
    void main() {
      vec3 colorA = vec3(0.94, 0.78, 0.55); // peach
      vec3 colorB = vec3(0.88, 0.4, 0.18);  // orange
      vec3 colorC = vec3(0.93, 0.55, 0.3);  // warm coral
      vec3 color = colorA * (0.5 + 0.5 * sin(vNormal.x + time)) + colorB * (0.5 + 0.5 * sin(vNormal.y + time)) + colorC * (0.5 + 0.5 * sin(vNormal.z + time));
      gl_FragColor = vec4(color, 1.0);
    }
  `,
});

const traitOrb = new THREE.Mesh(traitGeometry, traitMaterial);
traitScene.add(traitOrb);

const traitLight = new THREE.DirectionalLight(0xffffff, 2);
traitLight.position.set(5, 3, 2);
traitScene.add(traitLight);
traitScene.add(new THREE.AmbientLight(0xffffff, 0.4));

let traitTime = 0;
function animateTrait() {
  requestAnimationFrame(animateTrait);
  traitTime += 0.003;
  traitMaterial.uniforms.time.value = traitTime;
  traitOrb.rotation.y += 0.002;
  traitOrb.rotation.x = Math.sin(traitTime * 0.5) * 0.1;
  traitRenderer.render(traitScene, traitCamera);
}
animateTrait();

window.addEventListener('resize', () => {
  traitCamera.aspect = traitContainer.clientWidth / traitContainer.clientHeight;
  traitCamera.updateProjectionMatrix();
  traitRenderer.setSize(traitContainer.clientWidth, traitContainer.clientHeight);
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
