// systems/gamepadControl.js
import * as THREE from 'three';

const DEADZONE = 0.1;

// Helper function to apply deadzone
function applyDeadzone(value, threshold = DEADZONE) {
    return Math.abs(value) < threshold ? 0 : value;
}

class GamepadControl {
    constructor(camera, drone, controls) {
        this.camera = camera;
        this.drone = drone;
        this.controls = controls;
        this.speed = 0.05;
        this.rotationSpeed = 0.02;
    }

    tick() {
        const gamepads = navigator.getGamepads();
        const gp = gamepads[0]; // Use first connected gamepad

        if (!gp) return;

        const rawLeftX = gp.axes[0];
        const rawLeftY = gp.axes[1];
        const rawRightX = gp.axes[2];
        const rawRightY = gp.axes[3];

        const leftX = applyDeadzone(rawLeftX);
        const leftY = applyDeadzone(rawLeftY);
        const rightX = applyDeadzone(rawRightX);
        const rightY = applyDeadzone(rawRightY);

        // console.log('LX:', gp.axes[0], 'LY:', gp.axes[1], 'RX:', gp.axes[2], 'RY:', gp.axes[3]);

        // Move relative to camera direction
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(direction, this.camera.up).normalize();

        const moveVector = new THREE.Vector3();
        moveVector
            .addScaledVector(direction, -leftY)
            .addScaledVector(right, leftX)
            .normalize()
            .multiplyScalar(this.speed);

        this.drone.position.add(moveVector);

        // Rotate camera around drone using right stick
        const offset = new THREE.Vector3().subVectors(this.camera.position, this.drone.position);
        const spherical = new THREE.Spherical().setFromVector3(offset);

        spherical.theta -= rightX * this.rotationSpeed;
        spherical.phi -= rightY * this.rotationSpeed;
        spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi)); // Clamp vertical angle

        offset.setFromSpherical(spherical);
        this.camera.position.copy(this.drone.position.clone().add(offset));
        this.controls.target.copy(this.drone.position);
        this.controls.update();
    }
}

export { GamepadControl };
