class Saucer extends GameObject {
    constructor(manager, players, position, rotation, size, velocity = createVector(0, 0)) {
        super(manager, position, rotation, velocity);

        this.maxVelocity = 100;
        this.acceleration = createVector(0, 0);
        this.mass = 150;
        this.thrustForce = 750;

        this.moveDirection = createVector(0, 1);

        this.timeActive = 0;
        this.switchFrequency = 2;
        this.timeBetweenShots = 2;
        this.lastTimeShot = 0;
        this.accuracy = 0;
        this.improvementEnabled = false;
        this.movementTracking = false;

        this.pointValue = 200;

        this.collisionRad = 20;

        this.concernRad = 150;
        this.chaseRad = 50;

        this.tag = "Saucer";

        this.size = size;

        this.shape = [
            createVector(-10, -20),
            createVector(10, -20),
            createVector(10, -10),
            createVector(20, -10),
            createVector(20, 10),
            createVector(10, 10),
            createVector(10, 20),
            createVector(-10, 20),
            createVector(-10, 10),
            createVector(-20, 10),
            createVector(-20, -10),
            createVector(-10, -10),
        ];

        let scaleBoost = 1;
        switch (this.size) {
            case OBJECT_TYPE.SAUCER_BIG:
                scaleBoost = 1.5;
                this.shape.forEach(point => {
                    point.mult(scaleBoost);
                });
                this.accuracy = 45; 
                this.pointValue = 200;
                this.Move = this.MoveDumbly;
                break;
            case OBJECT_TYPE.SAUCER_SML:
                scaleBoost = 0.75;
                this.shape.forEach(point => {
                    point.mult(scaleBoost);
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
        this.ScreenWrap(this.collisionRad);
    }

    MoveDumbly() {
        if (this.timeActive % (this.switchFrequency * 2) <= this.switchFrequency){
            this.moveDirection = createVector(cos(this.rotation), sin(this.rotation));
        }
        else {
            this.moveDirection = createVector(cos(this.rotation + 45), sin(this.rotation + 45));
        }

        this.velocity = p5.Vector.mult(this.moveDirection, this.maxVelocity);

        this.position.add(p5.Vector.mult(this.velocity, deltaTime/1000));
    }

    MoveSmartly() {
        let enemies = new Array(...this.manager.gameObjects);
        // FILTER 1: FILTER OTHER SAUCERS AND EVIL BULLETS FROM THE ARRAY.
        enemies = enemies.filter(object => object.tag != "Saucer");
        enemies = enemies.filter(object => object.tag != "Evil");
        
        
        // FILTER 2: If an Enemy is not a concern, don't worry about them.
        enemies = enemies.filter(enemy => {
            let distance = this.position.dist(enemy.position);
            return (distance < this.concernRad);
        });

        // What Direction should I go? Away from the enemy, obviously!
        let enemyDirection = createVector(0, 0);
        enemies.forEach(enemy => {
            let x = (abs(enemy.position.x - this.position.x) > this.chaseRad)? enemy.position.x: this.position.x;
            let y = (abs(enemy.position.y - this.position.y) > this.chaseRad)? enemy.position.y: this.position.y;

            let priority = this.concernRad - this.position.dist(enemy.position);

            let dirToEnemy = p5.Vector.sub(createVector(x, y), this.position).limit(1);

            enemyDirection.add(dirToEnemy);
        });
        

        this.acceleration = createVector(0, 0);

        let xDir = 0;
        if (enemyDirection.x > 0) xDir = -1;
        else if (enemyDirection.x < 0) xDir = 1;

        let yDir = 0;
        if (enemyDirection.y > 0) yDir = -1;
        else if (enemyDirection.y < 0) yDir = 1;

        this.Thruster(xDir, yDir);

        this.velocity.add(p5.Vector.mult(this.acceleration, deltaTime/1000));


        this.position.add(this.velocity);


        if (xDir === 0 && yDir === 0) 
            this.velocity.mult(0.98);

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

            if (this.moveDirection.x > 0)
                circle(0, 30, 20);
            else if (this.moveDirection < 0)
                circle(0, -30, 20);
            if (this.moveDirection.y > 0)
                circle(30, 0, 20);
            else if (this.moveDirection.y < 0)
                circle(-30, 0, 20);

            circle(0, 0, this.concernRad*2);
            circle(0, 0, this.chaseRad*2);
            
            beginShape();
                this.shape.forEach(point => {
                    vertex(point.x, point.y);
                });
                vertex(this.shape[0].x, this.shape[0].y);
            endShape();
        pop();
    }



    RunShotTimer() {
        if (this.timeActive - this.lastTimeShot >= this.timeBetweenShots){
            this.lastTimeShot += this.timeBetweenShots;
            //this.Shoot();
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
        this.isAlive = false;
    }
}