class Asteroid extends GameObject {
    constructor(position, rotation, velocity) {
        super(position, rotation);
        this.velocity = velocity;
    }
    
    Update() {
        this.Move();
    }

    Draw() {
        push();
            angleMode(DEGREES);
            translate(this.position);
            rotate(this.rotation);

            circle(0, 0, 100);
        pop();
    }

    Move() {
        push();
            this.position.add(this.velocity);
            console.log(this.position);
        pop();
    }
}