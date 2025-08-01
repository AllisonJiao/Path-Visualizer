class Resizer {
    constructor(container, camera, renderer) {
        this.container = container;
        this.camera = camera;
        this.renderer = renderer;
        
        this.setSize();
        
        // Listen for resize events
        window.addEventListener('resize', () => {
            this.setSize();
        });
    }
    
    setSize() {
        // Get the container's size
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        // Set the renderer size
        this.renderer.setSize(width, height, false);
        
        // Update the camera's aspect ratio
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }
}

export { Resizer }; 