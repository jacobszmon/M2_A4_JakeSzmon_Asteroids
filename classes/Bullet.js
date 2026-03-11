class Bullet extends GameObject {
    constructor (manager, position, direction, speed, tag) {
        super(manager, position, 0, createVector(0, 0));

        this.lifespan = 1.5;
        this.timeSinceBirth = 0;

        this.bulletSpeed = speed;

        this.velocity = p5.Vector.mult(direction ,this.bulletSpeed);

        this.collisionRad = 5;

        this.shape = [
        ];
        this.vertexCount = 8;
        push();
            angleMode(DEGREES);
            for (let i = 0; i < this.vertexCount; i++){
                
                let radius = this.collisionRad;

                let x = radius * cos( i/this.vertexCount * 360);
                let y = radius * sin( i/this.vertexCount * 360);
                this.shape.push([x, y]);
            }
        pop();


        this.tag = tag;
    }

    Update() {
        this.Move();
        this.RunLifespanTimer();
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

    RunLifespanTimer() {
        this.timeSinceBirth += (deltaTime/1000);

        if (this.timeSinceBirth >= this.lifespan) {
            
            this.DestroySelf();
            console.log(this.isAlive);
        }
    }
}