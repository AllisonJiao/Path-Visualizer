import * as THREE from 'three';

class KeyboardControl {
    constructor(camera, drone, controls, domElement) {
        this.camera = camera;
        this.drone = drone;
        this.controls = controls;
        this.domElement = domElement || document;

        this.droneSpeed = 0.02;

        this.droneLeft = false;
        this.droneRight = false;
        this.droneForward = false;
        this.droneBack = false;
        this.droneUp = false;
        this.droneDown = false;

        this._initListeners();
    }

    _initListeners() {
        this.domElement.addEventListener('keydown', (e) => {
            switch (e.code) {
                case 'KeyW': this.droneForward = true; break;
                case 'KeyS': this.droneBack = true; break;
                case 'KeyA': this.droneLeft = true; break;
                case 'KeyD': this.droneRight = true; break;
                case 'KeyQ': this.droneDown = true; break;
                case 'KeyE': this.droneUp = true; break;
            }
        });

        this.domElement.addEventListener('keyup', (e) => {
            switch (e.code) {
                case 'KeyW': this.droneForward = false; break;
                case 'KeyS': this.droneBack = false; break;
                case 'KeyA': this.droneLeft = false; break;
                case 'KeyD': this.droneRight = false; break;
                case 'KeyQ': this.droneDown = false; break;
                case 'KeyE': this.droneUp = false; break;
            }
        });
    }

    tick() {
        const moveDirection = new THREE.Vector3();
        const forward = new THREE.Vector3();
        const right = new THREE.Vector3();

        // Get camera's forward direction (XZ plane only)
        this.camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        right.crossVectors(forward, this.camera.up).normalize();

        // WASD movement
        if (this.droneForward)  moveDirection.add(forward);
        if (this.droneBack)     moveDirection.sub(forward);
        if (this.droneRight)    moveDirection.add(right);
        if (this.droneLeft)     moveDirection.sub(right);
        if (this.droneUp)       moveDirection.y += 1;
        if (this.droneDown)     moveDirection.y -= 1;

        moveDirection.normalize().multiplyScalar(this.droneSpeed);
        this.drone.position.add(moveDirection);

        // --- Smooth follow camera and orbit target ---
        const offset = new THREE.Vector3(0, 2, 5); // y = up, z = back
        const droneWorldPos = this.drone.position.clone();

        const cameraDir = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDir);
        cameraDir.y = 0;
        cameraDir.normalize();

        const camRight = new THREE.Vector3();
        camRight.crossVectors(this.camera.up, cameraDir).normalize();

        const up = new THREE.Vector3(0, 1, 0);

        const dynamicOffset = new THREE.Vector3()
            .addScaledVector(cameraDir, -offset.z)
            .addScaledVector(up, offset.y)
            .addScaledVector(camRight, offset.x);

        const desiredCameraPos = droneWorldPos.clone().add(dynamicOffset);
        this.camera.position.lerp(desiredCameraPos, 0.1);

        // Keep camera looking at the drone
        this.controls.target.copy(droneWorldPos);
        this.controls.update();
    }
}

export { KeyboardControl };
