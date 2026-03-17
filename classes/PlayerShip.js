

class Player extends GameObject {
    constructor(manager, position, rotation, velocity = createVector(0, 0)) {
        super(manager, position, rotation, velocity);
        // ------ MOVEMENT ------
        this.engineActive = false;
        this.engineParticles = new ParticleSystem(this, this.position.copy(), 0, ParticleSystem.EMITTER_MODE.CONSTANT, 2, 30);
        this.moveForceMag = 1000;
        this.mass = 250;
        this.acceleration = createVector(0, 0);
        this.maxVelocity = 5;
        this.screenWrapOffset = 20;
        // ------ ROTATION ------
        this.rotationDir = 0;
        this.rotationSpeed = 200;
        this.angularVelocity = 0;
        // ------ TELEPORTATION ------
        this.teleportStopGap = true;
        // ------ SHOOTING ------
        this.shootingStopGap = true;
        this.recoilMag = 1000;
        // ------ COLLISION ------
        this.collisionRad = 20;
        this.tag = "Player";
        this.invincible = false;
        this.iDuration = 2;
        this.iElapsed = 0;

        // ------ SOUNDS ------
        this.thrusterVolume = 0;
        this.fadeInSpeed = 1;
        

        // ------ SHAPE ------
        this.shape = [
            createVector(20, 0),
            createVector(-20, -15),
            createVector(-10, 0),
            createVector(-20, 15),
        ];

        this.Start();
    }

    Start() {
        thrusterSound.setVolume(1);
        thrusterSound.loop();
        console.log(this.thrusterVolume);
    }

    Update() {
        angleMode(DEGREES);

        this.ResetAcceleration();

        this.ParseInputs();

        this.BlastOff();
        
        this.Move();

        this.Rotate();
        this.ThrusterVolume();

        if (this.invincible) {
            this.RunInvincibilityTimer();
        }


        let tailPos = p5.Vector.add(this.position, createVector(cos(this.rotation + 180), sin(this.rotation + 180)).mult(15));
        this.engineParticles.position = tailPos;
        this.engineParticles.angle = this.rotation + 180;
        this.engineParticles.running = this.engineActive;
        this.engineParticles.Update();
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
            noFill();
            strokeWeight(2.5);
            stroke(fillColor);
        // Draw ship
            
            beginShape();
                this.shape.forEach(point => {
                    vertex(point.x, point.y);
                });
                vertex(this.shape[0].x, this.shape[0].y);
            endShape();
        pop();

        this.engineParticles.Draw();
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
    BlastOff() {
        if (this.engineActive) {
            let force = createVector(cos(this.rotation), sin(this.rotation)).mult(this.moveForceMag);
            this.ApplyForce(force);
        }
    }

    ResetAcceleration() {
        this.acceleration = createVector(0,0);
    }

    ApplyForce(force, isImpulse = false) {
        let accel = p5.Vector.div(force, this.mass);
        if (isImpulse) {
            this.velocity.add(accel);
        }
        else {
            this.acceleration.add(accel);
        }
        
    }

    Move() {
        push();
            
            // ACCELERATE -- Add acceleration to velocity, then cap velocity.
            this.velocity.add(p5.Vector.mult(this.acceleration, deltaTime/1000));
            this.velocity.limit(this.maxVelocity);
            
            // APPLY DRAG -- Slow the ship down and stop moving when it gets slow enough.
            if (!this.engineActive){
               this.velocity.mult(0.98);

                if (this.velocity.mag() < 0.1) {
                    this.velocity.limit(0);
                } 
            }
            
            
            // MOVE THAT BOY -- Apply velocity to position.
            this.position.add(this.velocity);


            // WRAP ON SCREEN
            this.ScreenWrap(20);
        pop();
    }

    Rotate() {
        push();
        // Get angular velocity.
            this.angularVelocity = this.rotationSpeed * this.rotationDir;
        // Apply Angular Velocity to rotation (frame rate independent!).
            this.rotation += this.angularVelocity * deltaTime/1000;
        pop();
    }

    Teleport() {
        let randX = random(-width/2, width/2);
        let randY = random(-height/2, height/2);
        this.position = createVector(randX, randY);
        teleportSound.play();
    }

    Shoot() {
        // Get Bullet Direction and origin.
        let bulletDirection = createVector(cos(this.rotation), sin(this.rotation));
        let bulletOrigin = this.position.copy();

        // Play the laser sound at a random pitch and volume (for variation)
        let randPitch = random(0.8, 1.2);
        laserSound.playbackRate = randPitch;
        let randVolume = random(0.5, 0.7);
        laserSound.setVolume(randVolume);

        laserSound.play();
        
        // Make Bullet.
        this.manager.InstantiateObject(OBJECT_TYPE.BULLET, bulletOrigin, 0, bulletDirection);

        let recoilForce = p5.Vector.mult(bulletDirection, -this.recoilMag);
        
        this.ApplyForce(recoilForce, true);
    }

    DestroySelf() {
        this.manager.InstantiateObject(OBJECT_TYPE.PARTICLE_B, this.position.copy(), 0, createVector(0,0), 30);
        this.position = createVector(0, 0);
        this.velocity = createVector(0, 0);
        this.rotation = -90;
        this.invincible = true;
        this.thrusterVolume = 0;
        thrusterSound.setVolume(0);
        this.manager.gameInstance.camera.AddCameraTrauma(0.7);
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