class GameObject {

    constructor(position, rotation, velocity) {

        this.position = position;
        this.rotation = rotation;
        this.velocity = velocity;
        this.isAlive = true;

        this.Start();
    }

    Start() {

    }

    Update() {

    }

    Draw() {

    }

    ScreenWrap(offset) {
        if (this.position.x < -offset){
            this.position.x = width + offset;
        }
        else if (this.position.x > width + offset){
            this.position.x = -offset;
        }
        if (this.position.y < -offset){
            this.position.y = height + offset;
        }
        else if (this.position.y > height + offset){
            this.position.y = -offset;
        }
    }

    DestroySelf() {
        this.isAlive = false;
    }
}