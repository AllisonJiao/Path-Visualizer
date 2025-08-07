import * as THREE from 'three';

function createSphere() {
    // create a geometry
    const geometry = new THREE.SphereGeometry(0.1, 32, 16);

    // create a default (white) Basic material
  const material = new THREE.MeshBasicMaterial();

  // create a Mesh containing the geometry and material
  const sphere = new THREE.Mesh(geometry, material);

  return sphere;
}

export { createSphere };