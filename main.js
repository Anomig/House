import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import gsap from 'gsap';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(8, 6, 15);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


camera.position.set(20, 15, 30);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffd591, 1);
sunLight.position.set(10, 20, 10);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
scene.add(sunLight);

// Adding a Point Light inside the house
const pointLight = new THREE.PointLight(0xffa07a, 0.5, 10);
pointLight.position.set(0, 2, 2);
pointLight.castShadow = true;
scene.add(pointLight);

//OBJ
const objLoader = new OBJLoader();
objLoader.load('textures/houses.obj', (object) => {
    object.scale.set(0.05, 0.05, 0.05);
    object.position.set(0, 0, -10);
    scene.add(object);});

// Texture Loader
const textureLoader = new THREE.TextureLoader();
const stoneTexture = textureLoader.load('/stone.jpg'); 
const woodTexture = textureLoader.load('/wood.jpg');    
const grassTexture = textureLoader.load('/grass.jpg'); 

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

function createWindow(x, y, z) {
    const windowFrameGeometry = new THREE.BoxGeometry(1.2, 1.2, 0.1);
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const frame = new THREE.Mesh(windowFrameGeometry, frameMaterial);
    frame.position.set(x, y, z);
    scene.add(frame);

    const paneGeometry = new THREE.BoxGeometry(0.4, 1, 0.05);
    const paneMaterial = new THREE.MeshStandardMaterial({ color: 0x87CEEB, opacity: 0.5, transparent: true });
    const verticalPane = new THREE.Mesh(paneGeometry, paneMaterial);
    verticalPane.position.set(x, y, z + 0.01);

    const horizontalPane = verticalPane.clone();
    horizontalPane.rotation.z = Math.PI / 2;
    
    scene.add(verticalPane, horizontalPane);
}

createWindow(2, 0.8, 3);
createWindow(-2, 0.8, 3);

function createFlowerBox(x, y, z) {
    const boxGeometry = new THREE.BoxGeometry(1, 0.3, 0.3);
    const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const flowerBox = new THREE.Mesh(boxGeometry, boxMaterial);
    flowerBox.position.set(x, y, z);
    flowerBox.castShadow = true;
    scene.add(flowerBox);

    // flowers
    for (let i = -0.3; i <= 0.3; i += 0.3) {
        const flowerGeometry = new THREE.SphereGeometry(0.1, 7, 7);
        const flowerMaterial = new THREE.MeshStandardMaterial({ color: 0xff69b4 });
        const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
        flower.position.set(x + i, y + 0.2, z + 0.15);
        flower.castShadow = true;
        scene.add(flower);
    }
}

createFlowerBox(2, 0.5, 3.1);  
createFlowerBox(-2, 0.5, 3.1); 
function createGutter(x, y, z) {
    const gutterGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
    const gutterMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const gutter = new THREE.Mesh(gutterGeometry, gutterMaterial);
    gutter.position.set(x, y, z);
    gutter.castShadow = true;
    scene.add(gutter);
}

createGutter(3, 2, -2.5); 
createGutter(-3, 2, -2.5);

// Table
const tableGeometry = new THREE.BoxGeometry(1.5, 0.1, 1);
const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
const table = new THREE.Mesh(tableGeometry, tableMaterial);
table.position.set(0, -0.2, 1);
table.castShadow = true;
scene.add(table);

// Chairs
function createChair(x, z) {
    const chairSeatGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.5);
    const chairMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const seat = new THREE.Mesh(chairSeatGeometry, chairMaterial);
    seat.position.set(x, -0.35, z);
    seat.castShadow = true;
    
    const chairBackGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.1);
    const back = new THREE.Mesh(chairBackGeometry, chairMaterial);
    back.position.set(x, -0.05, z - 0.2);
    back.castShadow = true;

    scene.add(seat, back);
}

createChair(0.6, 1.5);  
createChair(-0.6, 1.5);

// Doorknob
const knobGeometry = new THREE.SphereGeometry(0.05, 8, 8);
const knobMaterial = new THREE.MeshStandardMaterial({ color: 0xDAA520 });
const knob = new THREE.Mesh(knobGeometry, knobMaterial);
knob.position.set(0.6, 0, 3.1);
knob.castShadow = true;
scene.add(knob);

const lanternGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 8);
const lanternMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
const lantern = new THREE.Mesh(lanternGeometry, lanternMaterial);
lantern.position.set(-0.8, 1.5, 3.1);

// light in latern
const lanternLight = new THREE.PointLight(0xffd700, 0.5, 5);
lanternLight.position.set(-0.8, 1.5, 3.1);
lanternLight.castShadow = true;

scene.add(lantern, lanternLight);

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
}
// Material for the fence (wood texture for realism)
const fenceWoodTexture = textureLoader.load('textures/wood.jpg');
fenceWoodTexture.wrapS = fenceWoodTexture.wrapT = THREE.RepeatWrapping;
fenceWoodTexture.repeat.set(1, 1);
const fenceMaterial = new THREE.MeshStandardMaterial({ map: fenceWoodTexture });

// Function to create a wooden fence post
function createFencePost(x, z) {
    const postGeometry = new THREE.BoxGeometry(0.2, 1.2, 0.2);
    const post = new THREE.Mesh(postGeometry, fenceMaterial);
    post.position.set(x, 0.6, z);
    post.castShadow = true;
    return post;
}

// Function to create horizontal connecting bars
function createFenceBar(x, z, width) {
    const barGeometry = new THREE.BoxGeometry(width, 0.1, 0.1);
    const bar = new THREE.Mesh(barGeometry, fenceMaterial);
    bar.position.set(x, 0.8, z);  // Set height to align with fence posts
    bar.castShadow = true;
    return bar;
}
// Function to create a fence segment with two posts and two connecting bars
function createFenceSegment(x1, z1, x2, z2) {
    // Bepaal het midden en de lengte van de horizontale verbinding
    const middleX = (x1 + x2) / 2;
    const middleZ = (z1 + z2) / 2;
    const distance = Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
    
    // Plaats de palen
    const post1 = createFencePost(x1, z1);
    const post2 = createFencePost(x2, z2);
    scene.add(post1, post2);

    // Voeg horizontale verbindingen toe tussen de palen
    const bar1 = createFenceBar(middleX, middleZ, distance);
    bar1.rotation.y = Math.atan2(z2 - z1, x2 - x1);  // Rotatie om de richting van de bar uit te lijnen
    const bar2 = bar1.clone();
    bar2.position.y = 0.4;  // Lagere bar op heuphoogte

    scene.add(bar1, bar2);
}

// Plaats de heksegmenten
createFenceSegment(-6, -6, 6, -6);
createFenceSegment(-6, 6, 6, 6);
createFenceSegment(-6, -6, -6, 6);
createFenceSegment(6, -6, 6, 6);

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

// Creating Extra Trees and Bushes
function createTree(x, z) {
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(x, 0, z);
    trunk.castShadow = true;

    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.set(x, 2.5, z);
    leaves.castShadow = true;

    scene.add(trunk, leaves);
}

createTree(10, 5);
createTree(-10, -7);
createTree(-7, 7);

// Function to create a shrub or bush
function createShrub(x, z) {
    const shrubGeometry = new THREE.SphereGeometry(0.6, 8, 8);
    const shrubMaterial = new THREE.MeshStandardMaterial({ color: 0x2E8B57 });
    const shrub = new THREE.Mesh(shrubGeometry, shrubMaterial);
    shrub.position.set(x, 0, z);
    shrub.castShadow = true;
    scene.add(shrub);
}

// Place shrubs around the scene
createShrub(6, -3);
createShrub(-6, -2);
createShrub(4, 4);

// Pond
const pondGeometry = new THREE.CircleGeometry(2, 32);
const waterMaterial = new THREE.MeshStandardMaterial({
    color: 0x1E90FF,
    opacity: 0.6,
    transparent: true,
    roughness: 0.3,
    metalness: 0.1
});
const pond = new THREE.Mesh(pondGeometry, waterMaterial);
pond.rotation.x = -Math.PI / 2;
pond.position.set(-10, -0.99, 5);  // Plaats de vijver naast het huis
pond.receiveShadow = true;
scene.add(pond);


// Mist Effect for a Dreamy Atmosphere
scene.fog = new THREE.FogExp2(0xd0e7ff, 0.02);

// Adding Sky Sphere for Cloudy or Starry Sky
const skyGeometry = new THREE.SphereGeometry(100, 32, 32);
const skyTexture = textureLoader.load('textures/sky.jpg'); 
const skyMaterial = new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.BackSide });
const sky = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(sky);



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
