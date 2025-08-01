import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

class ColorGUIHelper {
    constructor(object, prop) {
        this.object = object;
        this.prop = prop;
    }
    get value() {
        return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
        this.object[this.prop].set(hexString);
    }
}

export function createHemisphereLight() {
    const skyColor = 0xFFFFFF; // white at default
    const groundColor = 0xFFFFFF; // white at default
    const intensity = 2;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    
    // Create GUI controls
    const gui = new GUI();
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('skyColor');
    gui.addColor(new ColorGUIHelper(light, 'groundColor'), 'value').name('groundColor');
    gui.add(light, 'intensity', 0, 5, 0.01);
    
    return light;
}

export function createDirectionalLight() {
    const color = 0xFFFFFF;
    const intensity = 3.0;
    
    // First directional light
    const light1 = new THREE.DirectionalLight(color, intensity);
    light1.position.set(50, 50, 50);
    light1.target.position.set(0, 0, 0);
    
    // Second directional light
    const light2 = new THREE.DirectionalLight(color, 1.5);
    light2.position.set(-50, 30, -50);
    light2.target.position.set(0, 0, 0);
    
    return {
        light1: light1,
        light2: light2
    };
}