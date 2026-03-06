class GameObject {

    constructor(manager, position, rotation, velocity) {

        this.position = position;
        this.rotation = rotation;
        this.velocity = velocity;
        this.isAlive = true;

        this.manager = manager;

        this.tag;
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

    CollisionDetected() {
        // console.log("collision detected");
        this.DestroySelf();
    }

    DestroySelf() {
        this.isAlive = false;
    }
}