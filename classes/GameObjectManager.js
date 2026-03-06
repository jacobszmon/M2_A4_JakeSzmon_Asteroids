class GameObjectManager {
    
    constructor(gameInstance) {
        this.gameInstance = gameInstance;

        this.players = [];
        this.asteroids = [];
        this.bullets = [];
        this.saucers = [];

        this.gameObjects = [];
    }

    InstantiateObject(type, position, rotation, velocity = createVector(0,0)) {
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
        }
    }

    ClearDestroyedObjects() {
        this.gameObjects = this.gameObjects.filter(gameObject => gameObject.isAlive);
    } 

    ClearAllObjects() {
        this.gameObjects = [];
    }

    CheckIfLevelFinished() {
        if (this.gameObjects.length <= this.players.length && this.players.length > 0) {
            this.gameInstance.LevelUp();
        }
    }

    UpdateObjects() { 
        this.gameObjects.forEach(gameObject => gameObject.Update());
    }

    DrawObjects() {
        this.gameObjects.forEach(gameObject => gameObject.Draw());
    }


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



    AreObjectsColliding(object1, object2) {
        let collisionIsValid = true;

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

        let pos1 = object1.position;
        let pos2 = object2.position;

        let dist = pos1.dist(pos2);

        if (dist <= object1.collisionRad + object2.collisionRad)
            return true;

        return false;
    }
}