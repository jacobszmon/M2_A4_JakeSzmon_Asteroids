class Asteroid extends GameObject {
    constructor(manager, position, rotation, velocity, size) {
        super(manager, position, rotation, velocity);

        this.collisionRad;
        this.tag = "Asteroid";

        this.size = size;

        this.pointValue;

        switch(this.size){
            case OBJECT_TYPE.ASTEROID_BIG:
                this.pointValue = 20; 
                this.collisionRad = 50; break;
            case OBJECT_TYPE.ASTEROID_MED:
                this.pointValue = 50;
                this.collisionRad = 25; break;
            case OBJECT_TYPE.ASTEROID_SML:
                this.pointValue = 100;
                this.collisionRad = 12; break;
        }
        
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
            this.ScreenWrap(this.collisionRad);
        pop();
    }

    DestroySelf() {
        this.ApplyPointValue();

        push();
        for (let i = 0; i < 2; i++) {
            angleMode(DEGREES);
            let randAngle = random(0, 360);
            let randVelocity = p5.Vector.random2D(); 
            let babyPos = this.position.copy();


            switch(this.size){
                case OBJECT_TYPE.ASTEROID_BIG:
                    randVelocity.mult(1.3);
                    this.manager.InstantiateObject(OBJECT_TYPE.ASTEROID_MED, babyPos, randAngle, randVelocity); break;
                case OBJECT_TYPE.ASTEROID_MED:
                    randVelocity.mult(1.6);
                    this.manager.InstantiateObject(OBJECT_TYPE.ASTEROID_SML, babyPos, randAngle, randVelocity); break;
            }

            
        }
        pop();

        this.manager.gameInstance.camera.AddCameraTrauma(0.5);

        this.isAlive = false;
    }

    ApplyPointValue() {
        this.manager.gameInstance.UpdateScore(this.pointValue);
    }
}