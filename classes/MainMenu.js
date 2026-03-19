class MainMenu {
    
    static MODES = Object.freeze({
        MENU: 0,        // Main Menu
        LEADERBOARD: 1, // Leaderboard
        SAVE: 2,        // Game Over Save Screen
        INVISIBLE: 3,   // Nothing (In game)
    });
    
    constructor() {
        // History acts as temporary storage for names and scores.
        this.history;
        this.GetHistory();

        // Mode determines which mode this menu should display.
        this.mode = MainMenu.MODES.MENU;

        this.visible = true;

        // HTML ELEMENTS
        // COMMENCE SIMULATION (Start Game)
        this.startGameButton = createButton("Commence Simulation.");
        this.startGameButton.addClass('mybutton');
        this.startGameButton.addClass('startGame');
        this.startGameButton.position(width/2 - 150, height/2 + 100);
        this.startGameButton.mousePressed(() => this.StartGame());
        
        // ANALYZE STATISTICS (Show Leaderboard)
        this.displayLeaderButton = createButton("Analyze Statistics.");
        this.displayLeaderButton.addClass('mybutton');
        this.displayLeaderButton.addClass('leaderboard');
        this.displayLeaderButton.position(width/2 - 150, height/2 + 200);
        this.displayLeaderButton.mousePressed(() => this.SetMode(MainMenu.MODES.LEADERBOARD));

        // RETURN (to Main Menu)
        this.returnToMain = createButton("Return.");
        this.returnToMain.addClass('mybutton');
        this.returnToMain.addClass('return');
        this.returnToMain.position(width/2 - 100, height - 100);
        this.returnToMain.mousePressed(() => this.SetMode(MainMenu.MODES.MENU));

        // NAME INPUT FIELD
        this.nameInput = createInput();
        this.nameInput.addClass('myinput');
        this.nameInput.addClass('inputZone');
        this.nameInput.position(width/2 - 200, height/2 + 90);

        // SUBMIT (Submit Name + Score)
        this.submitName = createButton("Submit.");
        this.submitName.addClass('mybutton');
        this.submitName.addClass('submit');
        this.submitName.position(width/2 - 110, height/2 + 150);
        this.submitName.mousePressed(() => this.SubmitNewScore());

        // OMIT (Do not submit Name + Score)
        this.omitName = createButton("Omit.");
        this.omitName.addClass('mybutton');
        this.omitName.addClass('omit');
        this.omitName.position(width/2 + 10, height/2 + 150);
        this.omitName.mousePressed(() => this.SetMode(MainMenu.MODES.MENU));


        // RUN START FUNCTION
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
                        this.DrawMainMenu();
                        break;

                    case MainMenu.MODES.LEADERBOARD:
                        this.DrawLeaderboard();
                        break;

                    case MainMenu.MODES.SAVE:
                        this.DrawGameOver();
                        break;
                }
                
            }
        pop();
    }

    // ------ START A NEW GAME ------
    StartGame() {
        // Turn off menus.
        this.SetMode(MainMenu.MODES.INVISIBLE);

        // Set Sketch's game instance and let it know to run the game.
        gameInstance = new GameInstance();
        gameActive = true;
    }

    // ------ GAME HISTORY (Leaderboard) ------
    SubmitNewScore() {
        this.AddNewHistory();
        this.SetMode(MainMenu.MODES.MENU);
    }

    GetHistory() {
        // Get Leaderboard from local storage. If there is no leaderboard, create a new empty one.
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
        // Add current name and score to our temporary history value, then sort them by score
        this.history.push({name: this.nameInput.value(), score: gameInstance.score});
        this.history.sort((a, b) => b.score - a.score);
        // Stringify the temporary history, then commit it to local storage.
        localStorage.setItem("History", JSON.stringify(this.history));
        // Reset nameInput's value so it is blank the next time we see it.
        this.nameInput.value("");
    }


    // ------ MENU MODES (HTML VISUAL ELEMENTS) ------
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

    // ------ MENU MODES (NON HTML VISUAL ELEMENTS) ------
    DrawMainMenu() {
        textAlign(CENTER);
        fill("white");
        textSize(100);
        textFont(titleFont);
        text("Asteroids.", width/2, height/2);
    }
    
    DrawLeaderboard() {
        textAlign(CENTER);
        fill("white");
        textSize(75);
        push();
            textFont(titleFont);
            text("leadeRboaRd.", width/2, 100);
        pop();


        push();
            textFont(bodyFont);
            textSize(22);

            let nameWidth = this.GetLongestNameWidth();
            let placeWidth = textWidth("12.   ");
            let scoreWidth = textWidth("888888");
            let displayWidth = nameWidth + placeWidth + scoreWidth;
            print(displayWidth);

            for (let i = 0; i < Math.min(this.history.length, 12); i++) {
                if (i === 0) fill("#FFC107");
                else if (i === 1) fill("#9E9E9E");
                else if (i === 2) fill("#BF6042");
                else fill("white");
                
                    textAlign(LEFT);
                    text(i+1+".", width/2-((displayWidth)/2), 170+(45*i));
                    text(this.history[i].name, width/2-((displayWidth)/2)+placeWidth, 170+(45*i));
                    textAlign(RIGHT);
                    text(this.history[i].score, width/2+((displayWidth)/2), 170+(45*i));

                    
                
            };
        pop();
    }


    GetLongestNameWidth() {
        let width = 0;

        for (let i = 0; i < Math.min(this.history.length, 12); i++) {
            width = Math.max(textWidth(this.history[i].name), width);
        }
        return width;
    }

    DrawGameOver() {
        textAlign(CENTER);
        fill("white");
        textSize(85);
        push();
            textFont(titleFont);
            text("siMulAtion", width/2, height/2 - 110);
            text("coMplete.", width/2, height/2 - 10);
        pop();
        

        textSize(20);
        push();
            textFont(bodyFont);
            text("Enter Name and Submit to Save Score to Leaderboard.", width/2, height/2 + 50);
        pop();
        
    }
}