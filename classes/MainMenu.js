class MainMenu {
    
    static MODES = Object.freeze({
        MENU: 0,
        LEADERBOARD: 1,
        SAVE: 2,
        INVISIBLE: 3,
    });
    
    constructor() {

        this.history;

        this.GetHistory();

        this.mode = MainMenu.MODES.MENU;

        this.visible = true;

        this.startGameButton = createButton("Commence Simulation");
        this.startGameButton.addClass('mybutton');
        this.startGameButton.addClass('startGame');
        this.startGameButton.position(width/2 - 150, height/2 + 100);
        this.startGameButton.mousePressed(() => this.StartGame());
        

        this.displayLeaderButton = createButton("Analyze Statistics");
        this.displayLeaderButton.addClass('mybutton');
        this.displayLeaderButton.addClass('leaderboard');
        this.displayLeaderButton.position(width/2 - 150, height/2 + 200);
        this.displayLeaderButton.mousePressed(() => this.SetMode(MainMenu.MODES.LEADERBOARD));


        this.returnToMain = createButton("Return");
        this.returnToMain.addClass('mybutton');
        this.returnToMain.addClass('return');
        this.returnToMain.position(width/2 - 100, height - 100);
        this.returnToMain.mousePressed(() => this.SetMode(MainMenu.MODES.MENU));


        this.nameInput = createInput();
        this.submitName = createButton("Submit");
        this.omitName = createButton("Omit");

        this.nameInput.addClass('myinput');
        this.nameInput.addClass('inputZone');

        this.submitName.addClass('mybutton');
        this.submitName.addClass('submit');

        this.omitName.addClass('mybutton');
        this.omitName.addClass('omit');

        this.nameInput.position(width/2 - 200, height/2 + 90);
        this.submitName.position(width/2 - 110, height/2 + 150);
        this.submitName.mousePressed(() => this.SubmitNewScore());
        this.omitName.position(width/2 + 10, height/2 + 150);
        this.omitName.mousePressed(() => this.SetMode(MainMenu.MODES.MENU));


        
        this.Start();
    }

    Start() {
        this.UpdateButtonDisplays();
    }


    Draw() {
        push();
            if (this.visible) {
                switch (this.mode){
                    case MainMenu.MODES.MENU:
                        textAlign(CENTER);
                        fill("white");
                        textSize(100);
                        text("Asteroids.", width/2, height/2);
                        break;
                    case MainMenu.MODES.LEADERBOARD:
                        textAlign(CENTER);
                        fill("white");
                        textSize(75);
                        text("Leaderboard.", width/2, 100);

                        textSize(20);
                        for (let i = 0; i < this.history.length; i++) {
                            if (i === 0) fill("#FFC107");
                            else if (i === 1) fill("#9E9E9E");
                            else if (i === 2) fill("#BF6042");
                            else fill("white");
                            textAlign(RIGHT);
                            text(this.history[i].name, width/2-10, 200+(40*i));
                            textAlign(LEFT);
                            text(this.history[i].score, width/2+10, 200+(40*i));
                        };

                        break;
                    case MainMenu.MODES.SAVE:
                        textAlign(CENTER);
                        fill("white");
                        textSize(75);
                        text("Simulation Complete.", width/2, height/2);

                        textSize(20);
                        text("Enter Name and Submit to Save Score to Leaderboard.", width/2, height/2 + 50);
                }
                
            }
        pop();
    }

    StartGame() {
        this.SetMode(MainMenu.MODES.INVISIBLE);


        gameInstance = new GameInstance();
        gameActive = true;
    }

    SubmitNewScore() {
        this.AddNewHistory();
        this.SetMode(MainMenu.MODES.MENU);
    }

    SetMode(mode) {
        this.mode = mode;
        this.UpdateButtonDisplays();
    }

    UpdateButtonDisplays() {
        switch (this.mode){
            case MainMenu.MODES.MENU:
                this.startGameButton.show();
                this.displayLeaderButton.show();
                this.returnToMain.hide();
                this.nameInput.hide();
                this.submitName.hide();
                this.omitName.hide();
                break;
            case MainMenu.MODES.LEADERBOARD:
                this.startGameButton.hide();
                this.displayLeaderButton.hide();
                this.returnToMain.show();
                this.nameInput.hide();
                this.submitName.hide();
                this.omitName.hide();
                break;
            case MainMenu.MODES.SAVE:
                this.startGameButton.hide();
                this.displayLeaderButton.hide();
                this.returnToMain.hide();
                this.nameInput.show();
                this.submitName.show();
                this.omitName.show();
                break;
            case MainMenu.MODES.INVISIBLE:
                this.startGameButton.hide();
                this.displayLeaderButton.hide();
                this.returnToMain.hide();
                this.nameInput.hide();
                this.submitName.hide();
                this.omitName.hide();
                break;
        }
    }

    GetHistory() {
        if (localStorage.getItem("History") != "") {
            this.history = JSON.parse(localStorage.getItem("History"));

            this.history.sort((a, b) => b.score - a.score);
        }
        else
        {
            this.history = [];
        }
    }
    

    AddNewHistory() {
        this.history.push({name: this.nameInput.value(), score: gameInstance.score});
        this.history.sort((a, b) => b.score - a.score);

        localStorage.setItem("History", JSON.stringify(this.history));
        this.nameInput.value("");
    }

    
}