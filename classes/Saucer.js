class Saucer extends GameObject {
    constructor(manager, players, position, rotation, velocity = createVector(0, 0)) {
        super(manager, position, rotation, velocity);

        this.maxVelocity = 100;

        this.moveDirection = createVector(0, 1);

        this.timeActive = 0;
        this.switchFrequency = 2;
        this.timeBetweenShots = 2;
        this.lastTimeShot = 0;

        this.pointValue = 200;

        this.collisionRad = 20;

        this.tag = "Saucer";

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
                vertex(0, -20);
                vertex(-19, -6);
                vertex(-12, 16);
                vertex(12, 16);
                vertex(19, -6);
            endShape();
        pop();
    }



    RunShotTimer() {
        if (this.timeActive - this.lastTimeShot >= this.timeBetweenShots){
            this.lastTimeShot += this.timeBetweenShots;
            this.Shoot();
        }
    }


    AimAtAPlayer() {
        let player = random(this.players);

        let shotDirection = p5.Vector.sub(player.position, this.position).limit(1);

        return shotDirection;
    }

    Shoot() {
        let shotDir = this.AimAtAPlayer();

        let bulletOrigin = this.position.copy();

        this.manager.InstantiateObject(OBJECT_TYPE.EVIL_BULLET, bulletOrigin, 0, shotDir);
    }


    RunActiveTimer() {
        this.timeActive += deltaTime/1000;
    }

    DestroySelf() {
        this.manager.gameInstance.UpdateScore(this.pointValue);
        this.isAlive = false;
    }
}