import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

function loadObj(objPath, mtlPath, scene, onLoad, autoScale = true) {
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    mtlLoader.load(mtlPath, (mtl) => {
      console.log('MTL loaded successfully:', mtl);
      console.log('Materials in MTL:', Object.keys(mtl.materials));
      mtl.preload();
      objLoader.setMaterials(mtl);
      objLoader.load(objPath, (root) => {
        console.log('OBJ loaded successfully:', root);
        console.log('Number of children:', root.children.length);
        
        // Calculate bounding box
        const box = new THREE.Box3().setFromObject(root);
        console.log('Bounding box:', box);
        console.log('Model size:', box.getSize(new THREE.Vector3()));
        console.log('Model center:', box.getCenter(new THREE.Vector3()));
        
        // Scale the model if it's too large (only if autoScale is true)
        if (autoScale) {
            const size = box.getSize(new THREE.Vector3());
            const maxDimension = Math.max(size.x, size.y, size.z);
            if (maxDimension > 50) {
                const scale = 50 / maxDimension;
                root.scale.set(scale, scale, scale);
                console.log('Model auto-scaled by:', scale);
            }
        }
        
        // Center the model AFTER scaling
        const newBox = new THREE.Box3().setFromObject(root);
        const center = newBox.getCenter(new THREE.Vector3());
        root.position.sub(center);
        console.log('Model centered at:', center);
        
        // Final bounding box after scaling and centering
        const finalBox = new THREE.Box3().setFromObject(root);
        console.log('Final bounding box:', finalBox);
        console.log('Final box size:', finalBox.getSize(new THREE.Vector3()));
        console.log('Final box center:', finalBox.getCenter(new THREE.Vector3()));
        
        scene.add(root);
        
        // Call the onLoad callback with the root object
        if (onLoad) {
            onLoad(root);
        }
        
        // Debug: Check the model's children and materials
        console.log('Model children details:');
        root.traverse((child) => {
            if (child.isMesh) {
                console.log('Mesh found:', child.name || 'unnamed');
                console.log('Geometry vertices:', child.geometry.attributes.position.count);
                console.log('Material:', child.material);
                console.log('Visible:', child.visible);
                console.log('Position:', child.position);
                
                // Try to restore original materials with better settings
                if (child.material && child.material.length > 0) {
                    console.log('Restoring original materials with better settings');
                    child.material.forEach(mat => {
                        if (mat) {
                            mat.side = THREE.DoubleSide; // Show both sides of faces
                            mat.transparent = false;
                            mat.opacity = 1.0;
                            mat.needsUpdate = true;
                        }
                    });
                }
            }
        });
        

      }, 
      // Progress callback
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
      },
      // Error callback
      (error) => {
        console.error('Error loading OBJ:', error);
      });
    },
    // Progress callback for MTL
    (progress) => {
      console.log('MTL loading progress:', (progress.loaded / progress.total * 100) + '%');
    },
    // Error callback for MTL
    (error) => {
      console.error('Error loading MTL:', error);
    });
}

export { loadObj };