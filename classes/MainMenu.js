class MainMenu {
    constructor() {
        this.visible = true;

        this.startGameButton = createButton("Commence Simulation");
        this.startGameButton.position(width/2 - this.startGameButton.width/2, height/2 + 100);
        this.startGameButton.mousePressed(() => this.StartGame());

        
        this.Start();
    }

    Start() {
        
    }


    Draw() {
        push();
            if (this.visible) {
                textAlign(CENTER);
                fill("white");
                textSize(100);
                text("Asteroids", width/2, height/2);
            }
        pop();
    }

    StartGame() {
        this.ToggleVisibility();


        gameInstance = new GameInstance();
        gameActive = true;
    }


    ToggleVisibility() {
        if (this.visible){
            this.startGameButton.hide();
            this.visible = false;
        }
        else {
            this.startGameButton.show();
            this.visible = true;
        }
    }
}