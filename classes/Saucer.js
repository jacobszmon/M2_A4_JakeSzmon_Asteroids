class Saucer extends GameObject {
    constructor(manager, players, position, rotation, size, velocity = createVector(0, 0)) {
        super(manager, position, rotation, velocity);

        this.maxVelocity = 100;

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

        this.tag = "Saucer";

        this.size = size;

        this.shape = [
            [0, -20],
            [-19, -6],
            [-12, 16],
            [12, 16],
            [19, -6],
        ];

        let scaleBoost = 1;
        switch (this.size) {
            case OBJECT_TYPE.SAUCER_BIG:
                scaleBoost = 1.5;
                this.shape.forEach(point => {
                    point[0] = point[0] * scaleBoost;
                    point[1] = point [1] * scaleBoost;
                });
                this.accuracy = 45; 
                this.pointValue = 200;
                break;
            case OBJECT_TYPE.SAUCER_SML:
                scaleBoost = 0.75;
                this.shape.forEach(point => {
                    point[0] = point[0] * scaleBoost;
                    point[1] = point [1] * scaleBoost;
                });
                this.accuracy = 20;
                this.pointValue = 1000;
                this.improvementEnabled = true;
                if (this.manager.gameInstance.score >= 1500) {
                    this.movementTracking = true;
                }
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

    Move() {
        if (this.timeActive % (this.switchFrequency * 2) <= this.switchFrequency){
            this.moveDirection = createVector(cos(this.rotation), sin(this.rotation));
        }
        else {
            this.moveDirection = createVector(cos(this.rotation + 45), sin(this.rotation + 45));
        }

        this.velocity = p5.Vector.mult(this.moveDirection, this.maxVelocity);

        this.position.add(p5.Vector.mult(this.velocity, deltaTime/1000));
    }

    Draw() {
        push();
            translate(this.position);
            rotate(this.rotation);

            beginShape();
                this.shape.forEach(point => {
                    vertex(...point);
                });
            endShape();
        pop();
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
        this.isAlive = false;
    }
}