

class Player extends GameObject {
    constructor(position, rotation) {
        super(position, rotation);
        // ------ MOVEMENT ------
        this.engineActive = false;
        this.moveForceMag = 0.1;
        this.mass = 10;
        this.acceleration = createVector(0, 0);
        this.velocity = createVector(0, 0);
        this.maxVelocity = 5;
        // ------ ROTATION ------
        this.rotationDir = 0;
        this.rotationSpeed = 0.2;
        this.angularVelocity = 0;

        this.Start();
    }

    Start() {

    }

    Update() {
        this.ParseInputs();
        this.Move();
        this.Rotate();
    }

    Draw() {
        push();
            angleMode(DEGREES);
            translate(this.position);
            rotate(this.rotation);
            quad(20, 0, -20, -15, -10, 0, -20, 15);
        pop();
    }

    ParseInputs() {
        push();
        // ------ ROTATION INPUTS ------
            this.rotationDir = 0;
            if (keyIsDown(LEFT_ARROW)) {
                this.rotationDir = -1;
            } 
            else if (keyIsDown(RIGHT_ARROW)) {
                this.rotationDir = 1;
            }
        // ------ MOVE INPUTS ------
            this.engineActive = false;
            if (keyIsDown(UP_ARROW)) {
                this.engineActive = true;
            }
        push();
    }

    Move() {
        push();
            angleMode(DEGREES);
            if (this.engineActive) {

                let force = createVector( cos(this.rotation), sin(this.rotation) ).mult(this.moveForce);
                this.acceleration = p5.Vector.div(force, this.mass);

                this.velocity.add(this.acceleration.mult(deltaTime));
                this.velocity.limit(this.maxVelocity);
            }

            this.position.add(this.velocity);
        pop();
    }

    Rotate() {
        push();            
            this.angularVelocity = this.rotationSpeed * this.rotationDir;
            
            this.rotation += this.angularVelocity * deltaTime;
        pop();
    }
}