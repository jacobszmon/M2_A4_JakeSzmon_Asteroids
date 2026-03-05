

class Player extends GameObject {
    constructor(manager, position, rotation, velocity = createVector(0, 0)) {
        super(manager, position, rotation, velocity);
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
        this.shootingStopGap = true; 
        // ------ COLLISION ------
        this.collisionRad = 20;
        this.tag = "Player";
        this.invincible = false;
        this.iDuration = 2;
        this.iElapsed = 0;

        // ------ SOUNDS ------
        this.thrusterVolume = 0;
        this.fadeInSpeed = 1;
        
        this.Start();
    }

    Start() {
        thrusterSound.setVolume(1);
        thrusterSound.loop();
        console.log(this.thrusterVolume);
    }

    Update() {
        this.ParseInputs();
        this.Move();
        this.Rotate();
        this.ThrusterVolume();

        if (this.invincible) {
            this.RunInvincibilityTimer();
        }
    }

    Draw() {
        push();
        // Set angle mode, apply position and rotation.
            angleMode(DEGREES);
            translate(this.position);
            rotate(this.rotation);
            
            let fillColor = color(255, 255, 255, 255);
            if ( (this.invincible) && (this.iElapsed % 0.6 >= 0.3) ) {
                fillColor = color(255, 255, 255, 0);
            }
            fill(fillColor);
        // Draw ship
            if (this.engineActive)
                triangle(-25, 0, 0,  10, 0, -10);
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

                this.velocity.add(p5.Vector.mult(this.acceleration, deltaTime));
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
        teleportSound.play();
    }

    Shoot() {
        

        let bulletVelocity = createVector( cos(this.rotation), sin(this.rotation) );

        let bulletOrigin = this.position.copy();


        let randPitch = random(0.8, 1.2);
        laserSound.playbackRate = randPitch;
        let randVolume = random(0.5, 0.7);
        laserSound.setVolume(randVolume);

        laserSound.play();
        
        this.manager.InstantiateObject(OBJECT_TYPE.BULLET, bulletOrigin, 0, bulletVelocity);
    }

    DestroySelf() {
        this.position = createVector(width/2, height/2);
        this.velocity = createVector(0, 0);
        this.rotation = -90;
        this.invincible = true;
        this.thrusterVolume = 0;
        thrusterSound.setVolume(0);
        this.manager.gameInstance.PlayerDied();
    }

    RunInvincibilityTimer() {
        this.iElapsed += deltaTime/1000;

        if (this.iElapsed >= this.iDuration){
            this.invincible = false;
            this.iElapsed = 0;
        }
    }

    ThrusterVolume() {
        if (this.engineActive){
            if (this.thrusterVolume < 0.3){
                this.thrusterVolume += this.fadeInSpeed * (deltaTime/1000);
            }
        }
        else {
            if (this.thrusterVolume > 0){
                this.thrusterVolume -= this.fadeInSpeed * (deltaTime/1000);
            }
        }

        thrusterSound.setVolume(this.thrusterVolume);
    }
}