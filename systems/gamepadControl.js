import * as THREE from 'three';
import { createSphere } from '../components/sphere';

const DEADZONE = 0.1;

function applyDeadzone(value, threshold = DEADZONE) {
    return Math.abs(value) < threshold ? 0 : value;
}

class GamepadControl {
    constructor(scene, camera, drone, controls) {
        this.scene = scene;
        this.camera = camera;
        this.drone = drone;
        this.controls = controls;
        this.speed = 0.05;
        this.rotationSpeed = 0.02;

        // Track previous button state for square button (index 1)
        this.prevSquarePressed = false;
    }

    tick() {
        const gamepads = navigator.getGamepads();
        const gp = gamepads[0];
        if (!gp) return;

        const rawLeftX = gp.axes[0];
        const rawLeftY = gp.axes[1];
        const rawRightX = gp.axes[2];
        const rawRightY = gp.axes[3];

        const leftX = applyDeadzone(rawLeftX);
        const leftY = applyDeadzone(rawLeftY);
        const rightX = applyDeadzone(rawRightX);
        const rightY = applyDeadzone(rawRightY);

        // Movement relative to camera
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(direction, this.camera.up).normalize();

        const moveVector = new THREE.Vector3();
        moveVector
            .addScaledVector(direction, -leftY)
            .addScaledVector(right, leftX);

        if (gp.buttons[3].pressed) { moveVector.y += 1; }  // Triangle = up
        if (gp.buttons[0].pressed) { moveVector.y -= 1; }  // Cross = down

        moveVector.normalize().multiplyScalar(this.speed);
        this.drone.position.add(moveVector);

        // Camera follow rotation
        const offset = new THREE.Vector3().subVectors(this.camera.position, this.drone.position);
        const spherical = new THREE.Spherical().setFromVector3(offset);

        spherical.theta -= rightX * this.rotationSpeed;
        spherical.phi -= rightY * this.rotationSpeed;
        spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

        offset.setFromSpherical(spherical);
        this.camera.position.copy(this.drone.position.clone().add(offset));
        this.controls.target.copy(this.drone.position);
        this.controls.update();

        // Add sphere on square button press (index 1)
        const squarePressed = gp.buttons[2].pressed;
        if (squarePressed && !this.prevSquarePressed) {
            const sphere = createSphere();
            sphere.position.copy(this.drone.position);
            this.scene.add(sphere);
        }
        this.prevSquarePressed = squarePressed;
    }
}

export { GamepadControl };