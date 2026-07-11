import * as THREE from 'three';

const container = document.querySelector('#header-3d');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 12;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const geometry = new THREE.IcosahedronGeometry(7, 6);
const material = new THREE.MeshStandardMaterial({
  color: 0xe0662e,
  roughness: 0.4,
  metalness: 0.1,
});

const orb = new THREE.Mesh(geometry, material);
scene.add(orb);

const logoTexture = new THREE.TextureLoader().load('./images/querri-logo.jpeg');
const logoGeometry = new THREE.PlaneGeometry(5, 5);
const logoMaterial = new THREE.MeshBasicMaterial({ map: logoTexture, transparent: true });
const logoPlane = new THREE.Mesh(logoGeometry, logoMaterial);
logoPlane.position.z = 7.1;
scene.add(logoPlane);

const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 3, 2);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

// how much of the orb's rotation the logo follows (keeps it near face-on so it doesn't foreshorten/look chunky)
const logoFollowAmount = 0.15;

let time = 0;
function animate() {
  requestAnimationFrame(animate);
  time += 0.003;
  orb.rotation.y += 0.002;
  orb.rotation.x = Math.sin(time * 0.5) * 0.1;

  logoPlane.rotation.y = orb.rotation.y * logoFollowAmount;
  logoPlane.rotation.x = orb.rotation.x * logoFollowAmount;

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
