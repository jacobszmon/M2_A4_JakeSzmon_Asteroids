

class Player extends GameObject {
    constructor(position, rotation) {
        super(position, rotation);
        // ------ MOVEMENT ------
        this.velocity = createVector(0,0);
        // ------ ROTATION ------
        this.rotationSpeed = 1;
        this.rotationDir = 0;
        this.angularVelocity = 0;

        this.Start();
    }

    Start() {

    }

    Update() {
        this.ParseInputs();
        this.Rotate();
    }

    Draw() {
        push();
        angleMode(DEGREES);
        translate(this.position);
        rotate(this.rotation);
        quad(0, -20, -15, 20, 0, 10, 15, 20);
        pop();
    }

    ParseInputs() {
        push();
            this.rotationDir = 0;
            if (keyIsDown(LEFT_ARROW)) {
                this.rotationDir = -1;
            } 
            else if (keyIsDown(RIGHT_ARROW)) {
                this.rotationDir = 1;
            }
        push();
    }

    Rotate() {
        push();            
            this.angularVelocity = this.rotationSpeed * this.rotationDir;
            
            this.rotation += this.angularVelocity;
        pop();
    }
}