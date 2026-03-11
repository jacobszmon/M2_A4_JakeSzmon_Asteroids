class GameInstance {
    constructor() {
        this.maxLives = 3;
        this.currentLives = 3;

        this.currentLevel = 1;

        this.score = 0;
        this.lifeThresholdAchieved = 0;
        this.saucerThresholdAchieved = 0;

        this.gameObjectManager = new GameObjectManager(this);

        this.gameHUD = new HUD(this);

        this.gameIsOver = false;

        this.camera = new Camera();

        this.Start();
    }

    Start() {
        push();
            translate(width/2, height/2);

            this.gameObjectManager.InstantiateObject(OBJECT_TYPE.PLAYER, createVector(0, 0), -90);

            this.SpawnEnemyWave();
        pop();
    }


    GameUpdate() {
        push();
            translate(width/2, height/2);

            this.camera.Update();
            //rect(0, 0, width, height);
            this.gameObjectManager.UpdateObjects();
            this.gameObjectManager.DrawObjects();
            this.gameObjectManager.CheckCollisions();
            this.gameObjectManager.ClearDestroyedObjects();

            

            resetMatrix();
            this.gameHUD.Draw();

            if (!this.gameIsOver){
                this.CheckScoreThresholds();
                this.CheckLives();
                this.gameObjectManager.CheckIfLevelFinished();  
            }
            
        pop();
    }

    PlayerDied() {
        this.currentLives--;
    }


    SpawnEnemyWave() {
        push();
        for (let i = 0; i < this.currentLevel; i++) {
            angleMode(DEGREES);
            let randX = random(-width/2, width/2);
            let randY = random(-height/2, height/2);
            let randAngle = random(0, 360);
            let randVelocity = p5.Vector.random2D().mult(1);
            this.gameObjectManager.InstantiateObject(OBJECT_TYPE.ASTEROID_BIG, createVector(randX, randY), randAngle, randVelocity)
        }
        pop();
    }

    UpdateScore(delta) {
        this.score += delta;
        //console.log(this.score);
    }

    CheckScoreThresholds() {
        if (this.score - this.lifeThresholdAchieved >= 10000) {
            this.lifeThresholdAchieved += 10000;
            this.currentLives++;
            console.log("THRESHOLD PASSED");
        }


        if (this.score - this.saucerThresholdAchieved >= 750) {
            this.saucerThresholdAchieved += 750;

            let bigChance = 0.75;

            let randAngle = random(0, 360);
            let randy = random(-height/2, height/2);

            if (random(0, 1) <= bigChance) {
                this.gameObjectManager.InstantiateObject(OBJECT_TYPE.SAUCER_BIG, createVector(0, randy), randAngle);
            }
            else {
                this.gameObjectManager.InstantiateObject(OBJECT_TYPE.SAUCER_SML, createVector(0, randy), randAngle);
            }
        }
    }

    CheckLives() {
        if (this.currentLives <= 0) {
            this.gameObjectManager.players[0].isAlive = false;
            this.GameOver();
        }
    }

    GameOver() {
        console.log("Game Over");
        // this.gameObjectManager.ClearAllObjects();
        mainMenu.SetMode(MainMenu.MODES.SAVE);
        this.gameIsOver = true;
        
    }

    LevelUp() {
        this.currentLevel++;
        this.SpawnEnemyWave();
    }


    EndGame() {
        gameInstance = undefined;
        gameActive = false;
    }
}