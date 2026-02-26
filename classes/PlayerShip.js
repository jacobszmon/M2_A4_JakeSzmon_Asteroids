

class Player extends GameObject {
    constructor(position, rotation, manager, velocity = createVector(0, 0)) {
        super(position, rotation, velocity);
        // ------ MOVEMENT ------
        this.engineActive = false;
        this.moveForceMag = 0.1;
        this.mass = 250;
        this.acceleration = createVector(0, 0);
        this.maxVelocity = 5;
        // ------ ROTATION ------
        this.rotationDir = 0;
        this.rotationSpeed = 0.2;
        this.angularVelocity = 0;
        // ------ TELEPORTATION ------
        this.teleportStopGap = true;
        // ------ SHOOTING ------
        this.manager = manager;
        this.bulletSpeed = 5;
        this.shootingStopGap = true; 
        this.Start();

        this.collisionRad = 20;
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
        // Set angle mode, apply position and rotation.
            angleMode(DEGREES);
            translate(this.position);
            rotate(this.rotation);

        // Draw ship
            quad(20, 0, -20, -15, -10, 0, -20, 15);
        pop();
    }

    // ---------- INPUTS ----------
    ParseInputs() {
        push();
        // ROTATION INPUTS
            this.rotationDir = 0;
            if (keyIsDown(LEFT_ARROW)) {
                this.rotationDir = -1;
            } 
            else if (keyIsDown(RIGHT_ARROW)) {
                this.rotationDir = 1;
            }
        // MOVE INPUTS
            this.engineActive = false;
            if (keyIsDown(UP_ARROW)) {
                this.engineActive = true;
            }

        // TELEPORT INPUTS (ONLY FIRST FRAME IS NEEDED)
            if (keyIsDown(DOWN_ARROW)) {
                if (this.teleportStopGap) {
                    this.Teleport();
                }
                this.teleportStopGap = false;
            }
            else {
                this.teleportStopGap = true;
            }
        // SHOOTING INPUTS (1 FRAME ONLY)
            if (keyIsDown(32)) {
                if (this.shootingStopGap) {
                    this.Shoot();
                }
                this.shootingStopGap = false;
            }
            else {
                this.shootingStopGap = true;
            }
        push();
    }



    // ---------- ACTIONS ----------
    Move() {
        push();
            // Set Angle mode for calculation
            angleMode(DEGREES);

            // When engine is active, apply move force in the direction the ship is facing.
            if (this.engineActive) {
                let force = createVector( cos(this.rotation), sin(this.rotation) ).mult(this.moveForce);
                this.acceleration = p5.Vector.div(force, this.mass);

                this.velocity.add(this.acceleration.mult(deltaTime));
                this.velocity.limit(this.maxVelocity);
            }
            // Otherwise, slow the ship down and stop moving when it gets slow enough.
            else {
                this.velocity.mult(0.98);
                if (this.velocity.mag() < 0.1) {
                    this.velocity.limit(0);
                }
            }

            // Apply velocity to position.
            this.position.add(this.velocity);
            this.ScreenWrap(20);
        pop();
    }

    Rotate() {
        push();
        // Get angular velocity.
            this.angularVelocity = this.rotationSpeed * this.rotationDir;
        // Apply Angular Velocity to rotation (frame rate independent!).
            this.rotation += this.angularVelocity * deltaTime;
        pop();
    }

    Teleport() {
        let randX = random(0, width);
        let randY = random(0, height);
        this.position = createVector(randX, randY);
    }

    Shoot() {
        

        let bulletVelocity = createVector( cos(this.rotation), sin(this.rotation) ).mult(this.bulletSpeed);

        let bulletOrigin = this.position.copy();
        
        this.manager.InstantiateObject(OBJECT_TYPE.BULLET, bulletOrigin, 0, bulletVelocity);
    }
}