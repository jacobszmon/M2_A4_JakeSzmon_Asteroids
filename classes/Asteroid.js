class Asteroid extends GameObject {
    constructor(manager, position, rotation, velocity, size) {
        super(manager, position, rotation, velocity);

        this.collisionRad;
        this.tag = "Asteroid";

        this.size = size;

        this.pointValue;

        this.shape = [
        ];
        

        let vertexCount = 20;
        let noiseScale = 5;
        let scaleMin = 1;
        switch(this.size){
            case OBJECT_TYPE.ASTEROID_BIG:
                vertexCount = 25;
                scaleMin= 40;
                noiseScale = 25;
                
                this.pointValue = 20; 
                this.collisionRad = 50; break;
            case OBJECT_TYPE.ASTEROID_MED:
                vertexCount = 16;
                scaleMin = 20;
                noiseScale = 20;
                this.pointValue = 50;
                this.collisionRad = 25; break;
            case OBJECT_TYPE.ASTEROID_SML:
                vertexCount = 8;
                scaleMin = 10;
                noiseScale = 15;
                this.pointValue = 100;
                this.collisionRad = 12; break;
        }

        push();
            angleMode(DEGREES);
            for (let i = 0; i < vertexCount; i++){
                

                let radialNoise = noise(ceil(random(0, 10))+i/10);

                let radius = scaleMin + (noiseScale * radialNoise);

                let x = radius * cos( i/vertexCount * 360);
                let y = radius * sin( i/vertexCount * 360);
                this.shape.push([x, y]);
            }
        pop();

        
        
    }
    
    Update() {
        this.Move();
    }

    Draw() {
        push();
            angleMode(DEGREES);
            translate(this.position);
            rotate(this.rotation);

            noFill();
            stroke("white");
            strokeWeight(2.5);
            
            beginShape();
                this.shape.forEach(point => {
                    vertex(...point);
                });
                vertex(...this.shape[0]);
            endShape();
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