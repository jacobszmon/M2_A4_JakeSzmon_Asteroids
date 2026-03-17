class Saucer extends GameObject {
    constructor(manager, players, position, rotation, size, velocity = createVector(0, 0)) {
        super(manager, position, rotation, velocity);

        this.staticVelocity = 100;
        this.maxVelocity = 3;
        this.acceleration = createVector(0, 0);
        this.mass = 200;
        this.thrustForce = 1250;

        this.moveDirection = createVector(0, 0);

        this.thrusters = {
            right: new ParticleSystem(this, this.position.copy(), 0, ParticleSystem.EMITTER_MODE.CONSTANT, 2, 30),
            up: new ParticleSystem(this, this.position.copy(), 0, ParticleSystem.EMITTER_MODE.CONSTANT, 2, 30),
            left: new ParticleSystem(this, this.position.copy(), 0, ParticleSystem.EMITTER_MODE.CONSTANT, 2, 30),
            down: new ParticleSystem(this, this.position.copy(), 0, ParticleSystem.EMITTER_MODE.CONSTANT, 2, 30),
        }
        this.thrusters.right.angle = 0 + this.rotation;
        this.thrusters.up.angle = 90 + this.rotation;
        this.thrusters.left.angle = 180 + this.rotation;
        this.thrusters.down.angle = 270 + this.rotation;
        
        

        this.timeActive = 0;
        this.switchFrequency = 2;
        this.timeBetweenShots = 3;
        this.lastTimeShot = 0;
        this.accuracy = 0;
        this.improvementEnabled = false;
        this.movementTracking = false;

        this.pointValue = 200;

        this.collisionRad = 20;

        this.aimRad = 250;
        this.chaseRad = 100;
        this.concernRad = 150;
        this.fleeRad = 50;

        this.tag = "Saucer";

        this.size = size;

        this.shape = [
            createVector(-10, -20),
            createVector(0, -15),
            createVector(10, -20),
            createVector(20, -10),
            createVector(15, 0),
            createVector(20, 10),
            createVector(10, 20),
            createVector(0, 15),
            createVector(-10, 20),
            createVector(-20, 10),
            createVector(-15, 0),
            createVector(-20, -10),
        ];

        this.scaleBoost = 1;
        switch (this.size) {
            case OBJECT_TYPE.SAUCER_BIG:
                this.scaleBoost = 1.5;
                this.shape.forEach(point => {
                    point.mult(this.scaleBoost);
                });
                this.accuracy = 45; 
                this.pointValue = 200;
                this.Move = this.MoveDumbly;
                break;
            case OBJECT_TYPE.SAUCER_SML:
                this.scaleBoost = 0.75;
                this.shape.forEach(point => {
                    point.mult(this.scaleBoost);
                });
                this.accuracy = 20;
                this.pointValue = 1000;
                this.improvementEnabled = true;
                if (this.manager.gameInstance.score >= 1500) {
                    this.movementTracking = true;
                };
                this.Move = this.MoveSmartly;
                break;
        }

        this.players = players;
    }

    Update() {
        this.Move();
        this.RunShotTimer();
        this.RunActiveTimer();
        this.ScreenWrap();


        this.thrusters.left.running = (this.moveDirection.x > 0);
        this.thrusters.right.running = (this.moveDirection.x < 0);
        this.thrusters.up.running = (this.moveDirection.y < 0);
        this.thrusters.down.running = (this.moveDirection.y > 0);
        for (let i = 0; i < 4; i++) {
            Object.values(this.thrusters)[i].position = p5.Vector.add(this.position, createVector(cos(this.rotation + (90*i)), sin(this.rotation + (90*i))).mult(20 * this.scaleBoost));
        }
        Object.values(this.thrusters).forEach(thruster => thruster.Update());
    }

    MoveDumbly() {
        if (frameCount % (60 * this.switchFrequency) === 1) {
            let randDir = Math.floor(random(1, 9));
            switch (randDir) {
                case 1:
                    this.moveDirection = createVector(0, 1); break;
                case 2:
                    this.moveDirection = createVector(1, 1); break;
                case 3:
                    this.moveDirection = createVector(1, 0); break;
                case 4:
                    this.moveDirection = createVector(1, -1); break;
                case 5:
                    this.moveDirection = createVector(0, -1); break;
                case 6:
                    this.moveDirection = createVector(-1, -1); break;
                case 7:
                    this.moveDirection = createVector(-1, 0); break;
                case 8:
                    this.moveDirection = createVector(-1, 1); break;
            }
        }
        angleMode(DEGREES);
        let worldMoveDir = p5.Vector.rotate(this.moveDirection, this.rotation);

        this.velocity = p5.Vector.mult(worldMoveDir, this.staticVelocity);

        this.position.add(p5.Vector.mult(this.velocity, deltaTime/1000));
    }

    MoveSmartly() {
        // STEP 1 DETERMINE MOVE MODE BASED ON ENEMY POSITIONS
        let enemies = new Array(...this.manager.gameObjects);
        // FILTER 1: FILTER OTHER SAUCERS AND EVIL BULLETS FROM THE ARRAY.
        enemies = enemies.filter(object => object.tag != "Saucer");
        enemies = enemies.filter(object => object.tag != "Evil");
        
        // FILTER 2: If an Enemy is not a concern, don't worry about them.
        enemies = enemies.filter(enemy => {
            let distance = this.position.dist(enemy.position);
            return (distance < this.concernRad);
        });


        this.acceleration = createVector(0, 0);

        // CALCULATE ACCELERATION BASED ON MOVE MODE.
        // If there are any enemies in the concern range, run from them.
        if (enemies.length != 0)
            this.AvoidEnemies(enemies);
        else if (this.manager.players.length > 0) {
            let playerPos = this.FindClosestPathToPlayer();
            let playerDist = this.position.dist(playerPos);

            if (playerDist > this.aimRad)
                this.MoveToPlayer(playerPos);
            else
                this.moveDirection = createVector(0, 0);
        }
        else
            this.moveDirection = createVector(0, 0);

        // ACTUALLY MOVE BASE ON ACCELERATION.

        this.velocity.add(p5.Vector.mult(this.acceleration, deltaTime/1000)).limit(this.maxVelocity);


        this.position.add(this.velocity);


        //if (this.moveDirection.mag() === 0) 
        this.velocity.mult(0.99);

        if (this.velocity.mag() < 0.1)
            this.velocity.limit(0);
    }

    Thruster(x, y) {
        this.moveDirection = createVector(x, y);

        let accel = p5.Vector.mult(this.moveDirection, this.thrustForce / this.mass);

        this.acceleration.add(accel);
    }


    Draw() {
        push();
            translate(this.position);
            rotate(this.rotation);

            noFill();
            stroke("white");
            strokeWeight(2.5);

            // RANGE TEST CIRCLES
            // circle(0, 0, this.aimRad*2);
            // circle(0, 0, this.concernRad*2);
            // circle(0, 0, this.chaseRad*2);
            
            beginShape();
                this.shape.forEach(point => {
                    vertex(point.x, point.y);
                });
                vertex(this.shape[0].x, this.shape[0].y);
            endShape();
        pop();

        Object.values(this.thrusters).forEach(thruster => thruster.Draw());
    }



    RunShotTimer() {
        if (this.timeActive - this.lastTimeShot >= this.timeBetweenShots){
            this.lastTimeShot += this.timeBetweenShots;
            this.Shoot();
        }
    }

    Shoot() {
        let shotDir = this.AimAtAPlayer();

        let bulletOrigin = this.position.copy();

        this.manager.InstantiateObject(OBJECT_TYPE.EVIL_BULLET, bulletOrigin, 0, shotDir);
    }

    AimAtAPlayer() {

        // Set Accuracy Level:
        let  finAccuracy = this.accuracy;
        // If the saucer can improve their aim, minimize the accuracy range with score, reaching 0 (perfect accuracy) at 10000 points.
        if (this.improvementEnabled) {
            finAccuracy = this.accuracy - (this.accuracy * this.manager.gameInstance.score / 10000);
        } 


        // Pick a random target from the list of players.
        let target = random(this.players)

        // Get their position.
        let playerPos = target.position;
        // FOR TESTING
        // console.log(playerPos);

        // If movement tracking is enabled, aim for where the player is going, not where they are.
        if (this.movementTracking) {
            playerPos = p5.Vector.add(playerPos, target.velocity);
        }
        // FOR TESTING
        // console.log(playerPos);


        // Get the angle from the saucer to the target
        let aimDir = p5.Vector.sub(playerPos, this.position);
        let shotAngle = atan2(aimDir.y, aimDir.x);

        
        // deviate the shot angle by the saucer's accuracy.
        shotAngle += random(-finAccuracy, finAccuracy);

        // create a unit vector for that angle, which we can give to the bullet that will spawn.
        let shotDir = createVector(cos(shotAngle), sin(shotAngle));
        return shotDir;
    }

    RunActiveTimer() {
        this.timeActive += deltaTime/1000;
    }

    DestroySelf() {
        this.manager.gameInstance.UpdateScore(this.pointValue);
        this.manager.gameInstance.camera.AddCameraTrauma(0.5);

        this.manager.InstantiateObject(OBJECT_TYPE.PARTICLE_B, this.position.copy(), 0, createVector(0,0), 30);
        this.isAlive = false;
    }



    // ------ MOVEMENT MODES ------

    // Avoids all collidable objects 
    AvoidEnemies(enemies) {
        // What Direction should I go? Away from the enemy, obviously!
        let enemyDirection = createVector(0, 0);
        enemies.forEach(enemy => {
            let x = (abs(enemy.position.x - this.position.x) > this.fleeRad)? enemy.position.x: this.position.x;
            let y = (abs(enemy.position.y - this.position.y) > this.fleeRad)? enemy.position.y: this.position.y;

            let dirToEnemy = p5.Vector.sub(createVector(x, y), this.position).limit(1);

            enemyDirection.add(dirToEnemy);
        });
        
        let xDir = 0;
        if (enemyDirection.x > 0) xDir = -1;
        else if (enemyDirection.x < 0) xDir = 1;

        let yDir = 0;
        if (enemyDirection.y > 0) yDir = -1;
        else if (enemyDirection.y < 0) yDir = 1;

        this.Thruster(xDir, yDir);
    }

    // Moves toward 
    MoveToPlayer(playerPos) {
        let dirToPlayer = createVector(0, 0);

        let x = (abs(playerPos.x - this.position.x) > this.chaseRad)? playerPos.x: this.position.x;
        let y = (abs(playerPos.y - this.position.y) > this.chaseRad)? playerPos.y: this.position.y;

        dirToPlayer = p5.Vector.sub(createVector(x, y), this.position).limit(1);

        let xDir = 0;
        if (dirToPlayer.x > 0) xDir = 1;
        else if (dirToPlayer.x < 0) xDir = -1;

        let yDir = 0;
        if (dirToPlayer.y > 0) yDir = 1;
        else if (dirToPlayer.y < 0) yDir = -1;

        this.Thruster(xDir, yDir);
    }

    // Finds out whether it would be faster to reach the player using screen wrap or without.
    FindClosestPathToPlayer() {
        let playerPos = this.manager.players[0].position.copy();

        // FIND CLOSEST WALLS
        let nearWallX = width/2 + this.screenWrapOffset;
        let nearWallY =  height/2 + this.screenWrapOffset;
        let xFactor = (this.position.x >= 0)? 1 : -1;
        let yFactor = (this.position.y >= 0)? 1 : -1;

        // DIRECT COORDINATE DISTANCES
        let directX = this.position.x - playerPos.x;
        let directY = this.position.y - playerPos.y;

        // INDIRECT COORD DISTANCES (Through Screen Wrap)
        let indirectX = (nearWallX * xFactor) - this.position.x + playerPos.x - (-1 * xFactor * nearWallX);
        let indirectY = (nearWallY * yFactor) - this.position.y + playerPos.y - (-1 * yFactor * nearWallY);
        
        
        let closestX = playerPos.x;
        let closestY = playerPos.y;

        
        if (Math.abs(indirectX) < Math.abs(directX))
            closestX = (this.position.x + indirectX);
        if (Math.abs(indirectY) < Math.abs(directY))
            closestY = (this.position.y + indirectY);

        push();
        stroke("white");
        strokeWeight(10);
        //line(playerPos.x, playerPos.y, this.position.x, this.position.y);
        //line(this.position.x + indirectX, this.position.y, this.position.x, this.position.y);
        //line(this.position.x, this.position.y + indirectY, this.position.x, this.position.y);
        pop();


        return createVector(closestX, closestY);
    }

}