import * as THREE from 'three';

export function createCamera() {
    const fov = 50;
    const aspect = 2;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 50);
    
    return camera;
}