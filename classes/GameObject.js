class GameObject {

    constructor(manager, position, rotation, velocity) {

        this.position = position;
        this.rotation = rotation;
        this.velocity = velocity;
        this.isAlive = true;

        this.manager = manager;

        this.screenWrapOffset = 50;

        this.tag;
    }

    Update() {

    }

    Draw() {

    }

    ScreenWrap() {
        if (this.position.x < (-width/2) - this.screenWrapOffset){
            this.position.x = (width/2) + this.screenWrapOffset;
        }
        else if (this.position.x > (width/2) + this.screenWrapOffset){
            this.position.x = (-width/2) - this.screenWrapOffset;
        }
        if (this.position.y < (-height/2) - this.screenWrapOffset){
            this.position.y = (height/2) + this.screenWrapOffset;
        }
        else if (this.position.y > (height/2) + this.screenWrapOffset){
            this.position.y = (-height/2) - this.screenWrapOffset;
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