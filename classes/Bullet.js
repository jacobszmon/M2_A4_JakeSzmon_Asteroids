class Bullet extends GameObject {
    constructor (manager, position, velocity, tag) {
        super(manager, position, 0, velocity);

        this.lifespan = 1;
        this.timeSinceBirth = 0;

        this.bulletSpeed = 5;

        this.velocity = p5.Vector.mult(velocity ,this.bulletSpeed);

        this.collisionRad = 5;

        this.tag = tag;
    }

    Update() {
        this.Move();
        this.RunLifespanTimer();
    }

    Draw() {
        push();
            angleMode(DEGREES);
            translate(this.position);
            rotate(this.rotation);

            circle(0, 0, 10);
        pop();
    }

    Move() {
        push();
            this.position.add(this.velocity);
            this.ScreenWrap(this.collisionRad);
        pop();
    }

    RunLifespanTimer() {
        this.timeSinceBirth += (deltaTime/1000);

        if (this.timeSinceBirth >= this.lifespan) {
            
            this.DestroySelf();
            console.log(this.isAlive);
        }
    }
}