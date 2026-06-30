import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight); // reads current window size
document.body.appendChild(renderer.domElement)

//creating mesh 
const geometry = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 6); //a haxagon
const material = new THREE.MeshStandardMaterial({ color: 0x6699ff });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// add light (required for MeshStandardMaterial)
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

camera.position.z = 3;

// animate
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x -= 0.0002;
  cube.rotation.y -= 0.0002;
  cube.rotation.z += 0.0007;
  
  const h1 = document.querySelector('h1');
  h1.style.transform = `rotateY(${cube.rotation.y}rad) rotateX(${cube.rotation.x}rad)`;

  renderer.render(scene, camera);
}
cube.rotation.x = Math.PI / 2;
animate();
