import * as THREE from 'three';

class KeyboardControl {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement || document;

        this.speed = 0.1;
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        this._initListeners();
    }

    _initListeners() {
        this.domElement.addEventListener('keydown', (e) => {
            switch (e.code) {
                case 'KeyW': this.moveForward = true; break;
                case 'KeyS': this.moveBackward = true; break;
                case 'KeyA': this.moveLeft = true; break;
                case 'KeyD': this.moveRight = true; break;
            }
        });

        this.domElement.addEventListener('keyup', (e) => {
            switch (e.code) {
                case 'KeyW': this.moveForward = false; break;
                case 'KeyS': this.moveBackward = false; break;
                case 'KeyA': this.moveLeft = false; break;
                case 'KeyD': this.moveRight = false; break;
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
    }
}

export { KeyboardControl };