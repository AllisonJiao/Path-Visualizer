import * as THREE from 'three';

function createCube() {
  // create a geometry
  const geometry = new THREE.BoxGeometry(2, 2, 2);

  // create a default (white) Basic material
  const material = new THREE.MeshBasicMaterial();

  // create a Mesh containing the geometry and material
  const cube = new THREE.Mesh(geometry, material);

  cube.tick = () => {
    // increase the cube's rotation each frame
    cube.rotation.z += 0.01;
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  };

  return cube;
}

export { createCube };