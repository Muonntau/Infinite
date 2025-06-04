import * as THREE from 'https://cdn.skypack.dev/three@0.160.0';
import { PointerLockControls } from 'https://cdn.skypack.dev/three@0.160.0/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new PointerLockControls(camera, document.body);

document.body.addEventListener('click', () => {
  controls.lock();
});

const onKeyDown = (event) => {
  if (event.code === 'KeyE') interact();
};

document.addEventListener('keydown', onKeyDown);

const floorGeometry = new THREE.PlaneGeometry(200, 200);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x228822 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 2);
scene.add(dirLight);

// Generate simple buildings
const buildingMaterial = new THREE.MeshStandardMaterial({ color: 0x777777 });
for (let i = -20; i <= 20; i += 10) {
  for (let j = -20; j <= 20; j += 10) {
    const height = Math.random() * 5 + 2;
    const geo = new THREE.BoxGeometry(4, height, 4);
    const mesh = new THREE.Mesh(geo, buildingMaterial);
    mesh.position.set(i, height / 2, j);
    scene.add(mesh);
  }
}

camera.position.set(0, 2, 5);

const npcJokes = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "I told my computer I needed a break, and it said 'No problem, I'll go to sleep.'",
  "Parallel lines have so much in common. It's a shame they'll never meet.",
  "Why did the developer go broke? Because they used up all their cache!"
];

const npcGroup = new THREE.Group();
scene.add(npcGroup);

const loader = new GLTFLoader();
const npcUrls = [
  'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/CesiumMan/glTF/CesiumMan.gltf'
];

function spawnNPC(pos) {
  loader.load(npcUrls[0], gltf => {
    const npc = gltf.scene;
    npc.scale.set(0.5, 0.5, 0.5);
    npc.position.copy(pos);
    npc.userData.joke = npcJokes[Math.floor(Math.random() * npcJokes.length)];
    npcGroup.add(npc);
  });
}

for (let i = 0; i < 10; i++) {
  const pos = new THREE.Vector3(Math.random()*40 - 20, 0, Math.random()*40 - 20);
  spawnNPC(pos);
}

function interact() {
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  const intersects = raycaster.intersectObjects(npcGroup.children, true);
  if (intersects.length > 0) {
    const npc = intersects[0].object;
    alert(npc.userData.joke || 'Hello!');
  }
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
