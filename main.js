import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { createCamera } from './components/camera.js';
import { createScene } from './components/scene.js';
import { createCube } from './components/cube.js';
import { loadObj } from './components/obj.js';
import { createHemisphereLight, createDirectionalLight } from './components/light.js';

import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/resizer.js';
import { Loop } from './systems/loop.js';
import { KeyboardControl } from './systems/keyboardControl.js';


let camera;
let scene;
let cube;

let hemisphereLight;
let directionalLight1, directionalLight2;

let renderer;
let resizer;
let loop;
let keyboardControl;

let controls;

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

// Initialize the world
const container = document.querySelector('#c');
const world = new World(container);

// Create the cube
cube = createCube();
scene.add(cube);
cube.position.set(0, 0, 0);

// Function to adjust model based on model type
function adjustModel(model, modelType) {
    switch(modelType) {
        case 'scene_mesh_textured':
            // Adjustments for scene_mesh_textured model
            model.position.set(0, 0, 0);
            model.rotation.set(- Math.PI / 2, 0, 0);
            break;
        case 'drone_e58':
            // Adjustments for drone model
            model.scale.set(0.05, 0.05, 0.05);
            model.position.set(0, -5, 0);
            model.rotation.set(0, 0, 0); 
            break;
        default:
            // Default orientation
            model.rotation.set(0, 0, 0);
    }
}

loadObj('resources/models/Drone E58.obj', 'resources/models/Drone E58.mtl', scene, (model) => {
    adjustModel(model, 'drone_e58');

    // Compute bounding box center of drone
    const box = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // Setup OrbitControls
    controls = new OrbitControls(camera, container);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.target.copy(center);
    controls.update();

    // Position camera behind and above drone
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const fitDistance = maxDim * 1.5;

    camera.position.copy(center.clone().add(new THREE.Vector3(0, maxDim * 0.5, fitDistance)));
    camera.lookAt(center);
    controls.update();

    // Initialize keyboard control
    keyboardControl = new KeyboardControl(camera, model, controls, document);
    loop.updatables.push(keyboardControl);
}, false);


loop.updatables.push(cube);

// Load the geometry model
loadObj('resources/models/scene_mesh_textured.obj', 'resources/models/scene_mesh_textured.mtl', scene, (model) => {
    adjustModel(model, 'scene_mesh_textured');
});

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