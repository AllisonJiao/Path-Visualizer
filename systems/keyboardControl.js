import * as THREE from 'three';

class KeyboardControl {
    constructor(camera, drone, domElement) {
        this.camera = camera;
        this.drone = drone;
        this.domElement = domElement || document;

        this.speed = 0.1;
        this.droneSpeed = 0.02;
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        this.droneLeft = false;
        this.droneRight = false;
        this.droneForward = false;
        this.droneBack = false;

        this._initListeners();
    }

    _initListeners() {
        this.domElement.addEventListener('keydown', (e) => {
            switch (e.code) {
                case 'KeyW': this.moveForward = true; break;
                case 'KeyS': this.moveBackward = true; break;
                case 'KeyA': this.moveLeft = true; break;
                case 'KeyD': this.moveRight = true; break;
                case 'KeyQ': this.moveDown = true; break;
                case 'KeyE': this.moveUp = true; break;
                case 'ArrowLeft': this.droneLeft = true; break;
                case 'ArrowRight': this.droneRight = true; break;
                case 'ArrowUp': this.droneForward = true; break;
                case 'ArrowDown': this.droneBack = true; break;
            }
        });

        this.domElement.addEventListener('keyup', (e) => {
            switch (e.code) {
                case 'KeyW': this.moveForward = false; break;
                case 'KeyS': this.moveBackward = false; break;
                case 'KeyA': this.moveLeft = false; break;
                case 'KeyD': this.moveRight = false; break;
                case 'KeyQ': this.moveDown = false; break;
                case 'KeyE': this.moveUp = false; break;
                case 'ArrowLeft': this.droneLeft = false; break;
                case 'ArrowRight': this.droneRight = false; break;
                case 'ArrowUp': this.droneForward = false; break;
                case 'ArrowDown': this.droneBack = false; break;
            }
        });
    }

    tick() {
        const dir = new THREE.Vector3();
        this.camera.getWorldDirection(dir);
        dir.y = 0;
        dir.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(this.camera.up, dir).normalize();

        if (this.moveForward) this.camera.position.addScaledVector(dir, this.speed);
        if (this.moveBackward) this.camera.position.addScaledVector(dir, -this.speed);
        if (this.moveLeft) this.camera.position.addScaledVector(right, this.speed);
        if (this.moveRight) this.camera.position.addScaledVector(right, -this.speed);
        if (this.moveDown) this.camera.position.y -= this.speed;
        if (this.moveUp) this.camera.position.y += this.speed;
        if (this.droneLeft) this.drone.position.x -= this.droneSpeed;
        if (this.droneRight) this.drone.position.x += this.droneSpeed;
        if (this.droneForward) this.drone.position.z -= this.droneSpeed;
        if (this.droneBack) this.drone.position.z += this.droneSpeed;        
    }
}

export { KeyboardControl };