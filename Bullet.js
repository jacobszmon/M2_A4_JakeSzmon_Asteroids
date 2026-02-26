class Bullet extends GameObject {
    constructor (position, velocity) {
        super(position, 0);

        this.velocity = velocity;
        this.lifespan = 2;
        this.timeSinceBirth = this.lifespan;
    }

    Update() {
        this.Move();
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
        this.timeSinceBirth -= 1/frameRate;

        if (this.timeSinceBirth <= 0) {
            //DIE GOES HERE
        }
    }
}