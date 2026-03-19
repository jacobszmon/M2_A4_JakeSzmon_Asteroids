class Camera {

    constructor(position = createVector(0, 0), rotation = 0) {
        // Current position and rotation.
        this.position = position;
        this.rotation = rotation;

        // Default position and rotation.
        this.normalPos = position;
        this.normalRot = rotation;

        // Current trauma, and maximum duration of trauma.
        this.trauma = 0;
        this.maxTraumaLasts = 1;

        // maximum shakeable areas for both position and rotation.
        this.maxOffset = 5;
        this.maxAngle = 5;
    }

    Update() {
        this.TraumaFallOff();
        this.ApplyTrauma();
        this.SetCameraTransform();
    }

    // CAMERA SHAKE CODE.
    // Adds trauma to the camera.
    AddCameraTrauma(amount) {
        this.trauma += amount;
        this.trauma = Math.min(Math.max(this.trauma, 0), 1);
    }

    // Applies trauma to camera position and rotation. (Non-linear, ^2)
    ApplyTrauma() {
        let shakeAngle = this.maxAngle * Math.pow(this.trauma, 2) * random(-1, 1);
        let offsetX = this.maxOffset * Math.pow(this.trauma, 2) * random(-1, 1);
        let offsetY = this.maxOffset * Math.pow(this.trauma, 2) * random(-1, 1);

        this.rotation = this.normalRot + shakeAngle;
        this.position = p5.Vector.add(this.normalPos, createVector(offsetX, offsetY));
    }

    // Moves camera trauma towards 0. When trauma starts at 1, it takes (maxTraumaLasts) seconds to fade completely.
    TraumaFallOff() {
        if (this.trauma != 0){
            this.trauma -= (deltaTime/1000) * (1/this.maxTraumaLasts);
        }
        
        // This should clamp trauma between 0 and 1
        this.trauma = Math.min(Math.max(this.trauma, 0), 1);
    }

    // Applies Camera transform. (Only changes during screen shake.)
    SetCameraTransform() {
        translate(this.position);
        rotate(this.rotation);
    }
}