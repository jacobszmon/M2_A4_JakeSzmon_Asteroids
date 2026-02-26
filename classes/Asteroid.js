class Asteroid extends GameObject {
    constructor(manager, position, rotation, velocity, pointValue) {
        super(manager, position, rotation, velocity);

        this.collisionRad = 50;

        this.pointValue = pointValue;
    }
    
    Update() {
        this.Move();
    }

    Draw() {
        push();
            angleMode(DEGREES);
            translate(this.position);
            rotate(this.rotation);

            circle(0, 0, this.collisionRad * 2);
        pop();
    }

    Move() {
        push();
            this.position.add(this.velocity);
            this.ScreenWrap(50);
        pop();
    }

    DestroySelf() {
        this.ApplyPointValue();
        this.isAlive = false;
    }

    ApplyPointValue() {
        this.manager.gameInstance.UpdateScore(this.pointValue);
    }
}