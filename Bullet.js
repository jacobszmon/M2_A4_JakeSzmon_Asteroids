class Bullet extends GameObject {
    constructor (position, velocity) {
        super(position, 0, velocity);

        this.lifespan = 1;
        this.timeSinceBirth = 0;
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
            this.ScreenWrap(5);
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