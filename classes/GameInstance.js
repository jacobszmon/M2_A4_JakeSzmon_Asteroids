class GameInstance {
    constructor() {
        this.maxLives = 5;
        this.currentLives = 5;

        this.score = 0;
        this.lifeThresholdAchieved = 0;

        this.gameObjectManager = new GameObjectManager(this);

        this.Start();
    }

    Start() {
        this.gameObjectManager.InstantiateObject(OBJECT_TYPE.PLAYER, createVector(width/2, height/2), -90);

        push();
        for (let i = 0; i < 10; i++) {
            angleMode(DEGREES);
            let randX = random(0, width);
            let randY = random(0, height);
            let randAngle = random(0, 360);
            let randVelocity = p5.Vector.random2D().mult(1);
            this.gameObjectManager.InstantiateObject(OBJECT_TYPE.ASTEROID_BIG, createVector(randX, randY), randAngle, randVelocity)
        }
        pop();
    }


    GameUpdate() {
        this.gameObjectManager.UpdateObjects();
        this.gameObjectManager.DrawObjects();
        this.gameObjectManager.CheckCollisions();
        this.gameObjectManager.ClearDestroyedObjects();
        this.CheckScoreThresholds();
    }

    PlayerDied() {
        this.currentLives--;
        console.log(this.currentLives);
    }

    UpdateScore(delta) {
        this.score += delta;
        console.log(this.score);
    }

    CheckScoreThresholds() {
        if (this.score - this.lifeThresholdAchieved >= 10000) {
            this.lifeThresholdAchieved += 10000;
            this.currentLives++;
            console.log("THRESHOLD PASSED");
            console.log(this.currentLives);
        }
    }
}