class GameObjectManager {
    
    constructor(gameInstance) {
        this.gameInstance = gameInstance;

        this.players = [];
        this.asteroids = [];
        this.bullets = [];
        this.saucers = [];

        this.gameObjects = [];
    }

    InstantiateObject(type, position, rotation, velocity = createVector(0,0), rate = 0) {
        switch (type) {
            case OBJECT_TYPE.PLAYER:
                let player = new Player(this, position, rotation)
                this.gameObjects.push( player ); 
                this.players.push( player ); break;
            case OBJECT_TYPE.ASTEROID_BIG:
                this.gameObjects.push( new Asteroid(this, position, rotation, velocity, OBJECT_TYPE.ASTEROID_BIG) ); break;
            case OBJECT_TYPE.ASTEROID_MED:
                this.gameObjects.push( new Asteroid(this, position, rotation, velocity, OBJECT_TYPE.ASTEROID_MED) ); break;
            case OBJECT_TYPE.ASTEROID_SML:
                this.gameObjects.push( new Asteroid(this, position, rotation, velocity, OBJECT_TYPE.ASTEROID_SML) ); break;
            case OBJECT_TYPE.BULLET:
                this.gameObjects.push( new Bullet(this, position, velocity, 5, "Good") ); break;
            case OBJECT_TYPE.EVIL_BULLET:
                this.gameObjects.push( new Bullet(this, position, velocity, 5, "Evil") ); break;
            case OBJECT_TYPE.SAUCER_BIG:
                this.gameObjects.push( new Saucer(this, this.players, position, rotation, OBJECT_TYPE.SAUCER_BIG)); break;
            case OBJECT_TYPE.SAUCER_SML:
                this.gameObjects.push( new Saucer(this, this.players, position, rotation, OBJECT_TYPE.SAUCER_SML)); break;
            case OBJECT_TYPE.PARTICLE_B:
                this.gameObjects.push( new ParticleSystem(this, position, 0, ParticleSystem.EMITTER_MODE.BURST, rate)); break;
        }
    }

    ClearDestroyedObjects() {
        this.players = this.players.filter(player => player.isAlive);
        this.gameObjects = this.gameObjects.filter(gameObject => gameObject.isAlive);
    } 

    ClearAllObjects() {
        this.gameObjects = [];
    }

    CheckIfLevelFinished() {
        if (this.gameInstance.gameIsOver){
            return;
        }
        if (this.gameObjects.length <= 1) {
            this.gameInstance.LevelUp();
        }
    }

    UpdateObjects() { 
        this.gameObjects.forEach(gameObject => gameObject.Update());
    }

    DrawObjects() {
        this.gameObjects.forEach(gameObject => gameObject.Draw());
    }

    // ------ COLLISIONS ------
    // Check collisions compares each gameObject against the other game objects, and alerts them if they're colliding with each other.
    CheckCollisions() {
        let collisionObjects = new Array(...this.gameObjects);


        this.gameObjects.forEach(gameObject => {
            collisionObjects.splice(0, 1);

            if (gameObject.tag === "Player" && gameObject.invincible) {

            }
            else {
               collisionObjects.forEach(collisionObject => {

                    if (this.AreObjectsColliding(gameObject, collisionObject)) {
                        gameObject.CollisionDetected();
                        collisionObject.CollisionDetected();
                        deathSound.play();
                    }
                });
            }
        });
    }
    // AreObjectsColliding compares the tags of two objects to find if they can collide, and then checks if they are colliding.
    AreObjectsColliding(object1, object2) {
        let collisionIsValid = true;

        if (object1.collisionEnabled === false || object2.collisionEnabled === false){
            return false;
        }

        switch (object1.tag) {
            case "Player":
                if (object2.tag === "Player" || object2.tag === "Good") collisionIsValid = false; break;
            case "Asteroid":
                if (object2.tag === "Asteroid") collisionIsValid = false; break;
            case "Saucer":
                if (object2.tag === "Saucer" || object2.tag === "Evil") collisionIsValid = false; break;
            case "Good":
                if (object2.tag === "Good" || object2.tag === "Evil") collisionIsValid = false; break;
            case "Evil":
                if (object2.tag === "Good" || object2.tag === "Evil") collisionIsValid = false; break;
        }

        if (!collisionIsValid) {
            return false;
        }

        //return this.CircleToCircle(object1, object2);

        if (this.CheckPolyCollisions(object1, object2)) {
            return true;
        }
        return false;
    }
    // Converts two objects into shapes that can be fed to PolyToPoly(), then returns its return value.
    CheckPolyCollisions(object1, object2) {
        let shapeAtPos1 = [];
        
        
        object1.shape.forEach(point => {
            let rotatedPoint = p5.Vector.rotate(point, object1.rotation);
            shapeAtPos1.push(p5.Vector.add(rotatedPoint, object1.position));
        });
        
        let shapeAtPos2 = [];
        object2.shape.forEach(point => {
            let rotatedPoint = p5.Vector.rotate(point, object2.rotation);
            shapeAtPos2.push(p5.Vector.add(rotatedPoint, object2.position));
        });
        
        if (this.PolyToPoly(shapeAtPos1, shapeAtPos2)) {
            return true;
        }
        
        if (this.PointToPoly(object1.position, shapeAtPos2) || this.PointToPoly(object2.position, shapeAtPos1)) {
            return true;
        }
        
        return false;
    }
    // Evaluates Polygon to Polygon Collisions.
    PolyToPoly(shape1, shape2) {
        for (let current = 0; current < shape1.length; current++) {
            let next = (current+1 === shape1.length)? 0: current+1;
            
            let currLine = {
                p1: shape1[current],
                p2: shape1[next]
            };
            
            if (this.LineToPoly(shape2, currLine)) {
                return true; 
            }
        }
  
        return false
    }
    // Evaluates Line to Polygon Collisions (Used to check edge collisions).
    LineToPoly(shape, line1) {
        for (let current = 0; current < shape.length; current++) {
            let next = (current+1 === shape.length)? 0: current+1;
            
            let currLine = {
            p1: shape[current],
            p2: shape[next]
            };
            
            if (this.LineToLine(line1, currLine)) {
            
            return true;
            }
        }
        return false;
    }
    // Evaluates Point to Polygon Collisions (Used to check if an object is inside another object's shape.)
    PointToPoly(point ,shape) {
        let collision = false;
        
        for (let current = 0; current < shape.length; current++) {
        let next = (current+1 === shape.length)? 0: current+1;
        
        let currX = shape[current].x;
        let currY = shape[current].y;
        let nextX = shape[next].x;
        let nextY = shape[next].y;
        
        if (   ( (currY > point.y) != (nextY > point.y) ) 
            && (point.x < ((nextX - currX) * (point.y - currY) / (nextY - currY) + currX)) )  
        {
            collision = !collision;
        }
        }
    
        return collision;
    }
    // Evaluates whether two lines are intersecting.
    LineToLine(line1, line2) {
        let x1 = line1.p1.x;
        let y1 = line1.p1.y;
        let x2 = line1.p2.x;
        let y2 = line1.p2.y;
        
        let x3 = line2.p1.x;
        let y3 = line2.p1.y;
        let x4 = line2.p2.x;
        let y4 = line2.p2.y;
        

        let ux = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
        
        let uy = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
        
        
        if (ux >= 0 && ux <= 1 && uy >= 0 && uy <= 1) {
            //let x = x1 + (ux * (x2-x1));
            //let y = y1 + (ux * (y2-y1));
            //circle(x, y, 20);
            
            return true;
        }
        return false;
    }
    // Used for circle based collisions.
    CircleToCircle(object1, object2) {
        let pos1 = object1.position;
        let pos2 = object2.position;

        let dist = pos1.dist(pos2);

        if (dist <= object1.collisionRad + object2.collisionRad)
            return true;

        return false;
    }






}