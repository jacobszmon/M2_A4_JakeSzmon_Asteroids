class Camera {

    constructor(position = createVector(0, 0), rotation = 0) {
        this.position = position;
        this.rotation = rotation;

        this.normalPos = position;
        this.normalRot = rotation;

        this.trauma = 0;
        this.maxTraumaLasts = 1;

        this.maxOffset = 5;
        this.maxAngle = 5;
    }

    Update() {
        this.TraumaFallOff();
        this.ApplyTrauma();
        this.SetCameraTransform();
    }

    SetCameraTransform() {
        translate(this.position);
        rotate(this.rotation);
    }

    TraumaFallOff() {
        if (this.trauma != 0){
            this.trauma -= (deltaTime/1000) * (1/this.maxTraumaLasts);
        }
        
        // This should clamp trauma between 0 and 1
        this.trauma = Math.min(Math.max(this.trauma, 0), 1);
    }

    ApplyTrauma() {
        let shakeAngle = this.maxAngle * Math.pow(this.trauma, 2) * random(-1, 1);
        let offsetX = this.maxOffset * Math.pow(this.trauma, 2) * random(-1, 1);
        let offsetY = this.maxOffset * Math.pow(this.trauma, 2) * random(-1, 1);

        this.rotation = this.normalRot + shakeAngle;
        this.position = p5.Vector.add(this.position, createVector(offsetX, offsetY));
    }

    AddCameraTrauma(amount) {
        this.trauma += amount;
        this.trauma = Math.min(Math.max(this.trauma, 0), 1);
    }
}