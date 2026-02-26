class GameObjectManager {
    
    constructor() {
        this.players = [];
        this.asteroids = [];
        this.bullets = [];

        this.gameObjectLists = [
            this.players,
            this.asteroids,
            this.bullets,
        ];
    }

    InstantiateObject(type, position, rotation, velocity = createVector(0,0)) {
        switch (type) {
            case OBJECT_TYPE.PLAYER:
                this.players.push( new Player(position, rotation, this)); break;
            case OBJECT_TYPE.ASTEROID:
                this.asteroids.push( new Asteroid(position, rotation, velocity) ); break;
            case OBJECT_TYPE.BULLET:
                this.bullets.push( new Bullet(position, velocity) ); break;
        }
    }

    ClearDestroyedObjects() {
        console.log(this.bullets);
        this.players = this.players.filter(player => player.isAlive);
        this.asteroids = this.asteroids.filter(asteroid => asteroid.isAlive);
        this.bullets = this.bullets.filter(bullet => bullet.isAlive);
    } 

    UpdateObjects() { 
        this.players.forEach(player => player.Update());
        this.asteroids.forEach(asteroid => asteroid.Update());
        this.bullets.forEach(bullet => bullet.Update());
    }

    DrawObjects() {
        this.players.forEach(player => player.Draw());
        this.asteroids.forEach(asteroid => asteroid.Draw());
        this.bullets.forEach(bullet => bullet.Draw());
    }


    CheckCollisions() {
        this.players.forEach(player => {
            this.asteroids.forEach(asteroid => {
                if (this.AreObjectsColliding(player, asteroid)) {
                    player.CollisionDetected();
                    asteroid.CollisionDetected();
                }
            })
        });
        this.asteroids.forEach(asteroid => {
            this.bullets.forEach(bullet => {
                if (this.AreObjectsColliding(asteroid, bullet)) {
                    asteroid.CollisionDetected();
                    bullet.CollisionDetected();
                }
            })
        });
    }



    AreObjectsColliding(object1, object2) {
        let pos1 = object1.position;
        let pos2 = object2.position;

        let dist = pos1.dist(pos2);

        if (dist <= object1.collisionRad + object2.collisionRad)
            return true;

        return false;
    }
}