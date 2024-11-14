import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import gsap from 'gsap';

//create a scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(8, 6, 15);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
camera.position.set(20, 15, 30);  // Startpositie van de camera ver weg van het huis
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffd591, 0.8);
sunLight.position.set(10, 20, 10);
sunLight.castShadow = true;
scene.add(sunLight);

//OBJ
const objLoader = new OBJLoader();
objLoader.load('textures/houses.obj', (object) => {
    object.position.set(0, -4, 0);
    scene.add(object);});

// Texture Loader
const textureLoader = new THREE.TextureLoader();
const stoneTexture = textureLoader.load('textures/stone.jpg');   // Use a stone texture for walls
const woodTexture = textureLoader.load('textures/wood.jpg');     // Use a wood texture for roof
const grassTexture = textureLoader.load('textures/grass.jpg');   // Grass texture for the ground

// Grass platform
const grassGeometry = new THREE.PlaneGeometry(40, 40);
const grassMaterial = new THREE.MeshStandardMaterial({ map: grassTexture });
grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(8, 8);
const grass = new THREE.Mesh(grassGeometry, grassMaterial);
grass.rotation.x = -Math.PI / 2;
grass.position.y = -1;
grass.receiveShadow = true;
scene.add(grass);

// House walls
const wallGeometry = new THREE.BoxGeometry(6, 4, 6);
const wallMaterial = new THREE.MeshStandardMaterial({ map: stoneTexture, side: THREE.DoubleSide });
const walls = new THREE.Mesh(wallGeometry, wallMaterial);
walls.position.y = 1;
walls.castShadow = true;
scene.add(walls);

// Roof
const roofGeometry = new THREE.ConeGeometry(4.5, 3, 4);
const roofMaterial = new THREE.MeshStandardMaterial({ map: woodTexture });
const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.position.y = 4.5;
roof.rotation.y = Math.PI / 4;
roof.castShadow = true;
scene.add(roof);

// Door
const doorGeometry = new THREE.BoxGeometry(1.2, 2, 0.1);
const doorMaterial = new THREE.MeshStandardMaterial({ map: woodTexture });
const door = new THREE.Mesh(doorGeometry, doorMaterial);
door.position.set(0, 0, 3.05);
door.castShadow = true;
scene.add(door);

//windows   
const windowGeometry = new THREE.BoxGeometry(1, 1, 0.05);
const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x87CEEB, opacity: 0.5, transparent: true });
const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
window1.position.set(2, 0.8, 3);
window1.castShadow = true;
scene.add(window1);


// Chimney
const chimneyGeometry = new THREE.BoxGeometry(0.5, 2, 0.5);
const chimneyMaterial = new THREE.MeshStandardMaterial({ map: stoneTexture });
const chimney = new THREE.Mesh(chimneyGeometry, chimneyMaterial);
chimney.position.set(-1, 4.5, -1.5);
chimney.castShadow = true;
scene.add(chimney);

// Small fence
function createFence(x, z) {
    const fenceGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.1);
    const fenceMaterial = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
    const fencePost = new THREE.Mesh(fenceGeometry, fenceMaterial);
    fencePost.position.set(x, -0.75, z);
    fencePost.castShadow = true;
    scene.add(fencePost);
}

// Binnenvloer
const floorGeometry = new THREE.PlaneGeometry(6, 6);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.5;
scene.add(floor);

//picture
const paintingTexture = textureLoader.load('textures/image.jpg');
const paintingGeometry = new THREE.BoxGeometry(2.5, 3, 0);
const paintingMaterial = new THREE.MeshStandardMaterial({ map: paintingTexture });
const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);
painting.position.set(0, 1.5, 0);
painting.castShadow = true;
scene.add(painting);

// Place fence posts around the house
for (let i = -3; i <= 3; i += 0.6) {
    createFence(i, 5);
    createFence(i, -5);
}
for (let j = -5; j <= 5; j += 0.6) {
    createFence(-3.5, j);
    createFence(3.5, j);
}

// Tree
const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 2, 8);
const trunkMaterial = new THREE.MeshStandardMaterial({ map: woodTexture });
const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
trunk.position.set(5, 0, -5);
trunk.castShadow = true;
scene.add(trunk);

const leavesGeometry = new THREE.SphereGeometry(1.5, 16, 16);
const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
leaves.position.set(5, 2.5, -5);
leaves.castShadow = true;
scene.add(leaves);

// Animate the camera to move inside the house
gsap.to(camera.position, {
    duration: 10,  
    x: 0,
    y: 2,  
    z: 3, 
    ease: 'power2.inOut',  
    onUpdate: () => {
        controls.update();  
    }
});

// Animate and Render
function animate() {
    controls.update();
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
