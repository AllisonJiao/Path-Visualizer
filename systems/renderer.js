import * as THREE from 'three';

export function createRenderer() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    
    return renderer;
}