import * as THREE from 'three';
import {FontLoader,TextGeometry} from 'three/examples/jsm/Addons.js';

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
      size: 1.2,
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
        textMesh.rotation.y = 0.1 + Math.sin(time) * 0.1; // rocks left and right
        textMesh.rotation.x = Math.sin(time) * 0.1; // fixed upward tilt
        renderer.render(scene, camera);
    }
    animate();
  }
);