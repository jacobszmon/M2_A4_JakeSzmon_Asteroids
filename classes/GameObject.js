class GameObject {

    constructor(manager, position, rotation, velocity) {
        // Object Transform
        this.position = position;
        this.rotation = rotation;

        // Object Velocity
        this.velocity = velocity;

        // Am I Dead?
        this.isAlive = true;

        // Who is managing me?
        this.manager = manager;

        // Collision & Screen Wrap
        this.screenWrapOffset = 50;
        this.collisionEnabled = true;
        this.tag;
    }

    Update() {

    }

    Draw() {

    }
    
    // Base Object Functions
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
        this.DestroySelf();
    }

    DestroySelf() {
        this.isAlive = false;
    }
}