class GameInstance {
    
    constructor() {

        // Player Lives
        this.maxLives = 3;
        this.currentLives = 3;

        // Score + Level
        this.score = 0;
        this.currentLevel = 1;
        this.lifeThresholdAchieved = 0;
        this.saucerThresholdAchieved = 0;

        // Game is Over?
        this.gameIsOver = false;

        // Objects to Manage:
        this.gameObjectManager = new GameObjectManager(this);
        this.gameHUD = new HUD(this);
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
            // Set origin to the centre of the screen.
            translate(width/2, height/2);

            // ORDER OF OPERATIONS: Update -> Draw -> Check Collisions -> Clear Dead Things.
            this.camera.Update();
            this.gameObjectManager.UpdateObjects();
            this.gameObjectManager.DrawObjects();
            this.gameObjectManager.CheckCollisions();
            this.gameObjectManager.ClearDestroyedObjects();

            
            // Reset origin before drawing HUD, this keeps it anchored in place.
            resetMatrix();
            this.gameHUD.Draw();

            // If the game isn't over, run checks.
            if (!this.gameIsOver){
                this.CheckScoreThresholds();
                this.CheckLives();
                this.gameObjectManager.CheckIfLevelFinished();  
            }
            
        pop();
    }



    // ------ GAME MANAGER ACTIONS ------
    // Spawns a wave of asteroids appropriate for the current level.
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
    // Updates the current score, increased by some Game Objects when they die.
    UpdateScore(delta) {
        this.score += delta;
        //console.log(this.score);
    }

    // ------ CHECK GAME METRICS ------
    // Checks the current score to see if the player has earned enough points to spawn a Saucer, or gain an extra life.
    CheckScoreThresholds() {
        // HAS THE PLAYER EARNED AN EXTRA LIFE?
        if (this.score - this.lifeThresholdAchieved >= 10000) {
            this.lifeThresholdAchieved += 10000;
            this.currentLives++;
            console.log("THRESHOLD PASSED");
        }

        // IS THE PLAYER DUE FOR A CHALLENGE?
        if (this.score - this.saucerThresholdAchieved >= 750) {
            this.saucerThresholdAchieved += 750;

            let bigChance = 0.75;

            let randAngle = random(0, 360);
            let randy = random(-height/2, height/2);

            if (random(0, 1) <= bigChance) {
                this.gameObjectManager.InstantiateObject(OBJECT_TYPE.SAUCER_BIG, createVector(width/2, randy), randAngle);
            }
            else {
                this.gameObjectManager.InstantiateObject(OBJECT_TYPE.SAUCER_SML, createVector(width/2, randy), 0);
            }
            
            alarmSound.play();
        }
    }
    // Checks to see if the player has lost all of their lives.
    CheckLives() {
        if (this.currentLives <= 0) {
            this.gameObjectManager.players[0].isAlive = false;
            this.GameOver();
        }
    }


    // ------ GAME EVENTS ------
    PlayerDied() {
        this.currentLives--;
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