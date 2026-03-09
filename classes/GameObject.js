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
        if (this.position.x < (-width/2)-offset){
            this.position.x = (width/2) + offset;
        }
        else if (this.position.x > (width/2) + offset){
            this.position.x = (-width/2)-offset;
        }
        if (this.position.y < (-height/2)-offset){
            this.position.y = (height/2) + offset;
        }
        else if (this.position.y > (height/2) + offset){
            this.position.y = (-height/2)-offset;
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