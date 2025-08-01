import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { createCamera } from './components/camera.js';
import { createScene } from './components/scene.js';
import { loadObj } from './components/obj.js';
import { createHemisphereLight, createDirectionalLight } from './components/light.js';

import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/resizer.js';
import { Loop } from './systems/loop.js';


let camera;
let scene;

let hemisphereLight;
let directionalLight1, directionalLight2;

let renderer;
let resizer;
let loop;

class World {
    constructor(container) {
        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();
        
        // Create resizer to handle window resizing
        resizer = new Resizer(container, camera, renderer);

        loop = new Loop(camera, scene, renderer);
    }
}

function render() {
    renderer.render(scene, camera);
}

// Initialize the world
const container = document.querySelector('#c');
const world = new World(container);

// Load the model once
loadObj('resources/models/scene_mesh_textured.obj', 'resources/models/scene_mesh_textured.mtl', scene);

// Create and add lights
hemisphereLight = createHemisphereLight();
const directionalLights = createDirectionalLight();
directionalLight1 = directionalLights.light1;
directionalLight2 = directionalLights.light2;

console.log('Adding lights to scene...');
scene.add(hemisphereLight);
scene.add(directionalLight1);
scene.add(directionalLight1.target);
scene.add(directionalLight2);
scene.add(directionalLight2.target);
console.log('Lights added successfully');

// orbit control
const controls = new OrbitControls( camera, container );
controls.target.set(0, 0, 0);
controls.update();

renderer.setPixelRatio(window.devicePixelRatio);

// Start the render loop
function animate() {
    start();
    requestAnimationFrame(start);
}

function start() {
    loop.start();
}

function stop() {
    loop.stop();
}

animate();