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
        this.startGameButton.position(width/2 - this.startGameButton.width/2, height/2 + 100);
        this.startGameButton.mousePressed(() => this.StartGame());

        this.displayLeaderButton = createButton("Analyze Statistics");
        this.displayLeaderButton.position(width/2 - this.displayLeaderButton.width/2, height/2 + 200);
        this.displayLeaderButton.mousePressed(() => this.SetMode(MainMenu.MODES.LEADERBOARD));


        this.returnToMain = createButton("Return");
        this.returnToMain.position(width/2 - this.returnToMain.width/2, height - 50);
        this.returnToMain.mousePressed(() => this.SetMode(MainMenu.MODES.MENU));


        this.nameInput = createInput();
        this.submitName = createButton("Submit");

        this.nameInput.position(width/2 - (this.nameInput.width + this.submitName.width)/2, height/2 + 100);
        this.submitName.position(width/2 - (this.nameInput.width + this.submitName.width)/2 + this.nameInput.width, height/2 + 100);
        this.submitName.mousePressed(() => this.SubmitNewScore());


        
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
                        text("Asteroids", width/2, height/2);
                        break;
                    case MainMenu.MODES.LEADERBOARD:
                        textAlign(CENTER);
                        fill("white");
                        textSize(75);
                        text("Leaderboard", width/2, 100);

                        textSize(20);
                        for (let i = 0; i < this.history.length; i++) {
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
                        text("Game Over.", width/2, height/2);

                        textSize(20);
                        text("Enter Name to Save Score to Leaderboard.", width/2, height/2 + 50);
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
                break;
            case MainMenu.MODES.LEADERBOARD:
                this.startGameButton.hide();
                this.displayLeaderButton.hide();
                this.returnToMain.show();
                this.nameInput.hide();
                this.submitName.hide();
                break;
            case MainMenu.MODES.SAVE:
                this.startGameButton.hide();
                this.displayLeaderButton.hide();
                this.returnToMain.hide();
                this.nameInput.show();
                this.submitName.show();
                break;
            case MainMenu.MODES.INVISIBLE:
                this.startGameButton.hide();
                this.displayLeaderButton.hide();
                this.returnToMain.hide();
                this.nameInput.hide();
                this.submitName.hide();
                break;
        }
    }

    GetHistory() {
        
        fetch('data/Scores.json').then(response => {
            if (!response.ok) {
                throw new Error('The JSON might be a tad fucked');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            this.history = data;
        })  
        .catch(error => console.error('Failed to fetch data:', error));
        
        /*
        const fs = require('fs');
        const path = require('path');

        const filePath = path.join(process.cwd(), 'data/Scores.json');

        fs.readFile(filePath, 'utf8', (err, contents) => {
            if (err) {
                console.log(err);
                return;
            }

            try {
                this.history = JSON.parse(contents);
                console.log(this.history);
            }
            catch (jsonError) {
                console.error('Error Parsing JSON');
            }
        });
        */
    }
    

    AddNewHistory() {
        this.history.push({name: this.nameInput.value(), score: gameInstance.score});
        this.nameInput.value("");

        /*
        const fs = require('fs');
        const path = require('path');

        const jsonString = JSON.stringify(this.history);

        const filePath = path.join(process.cwd(), 'data/Scores.json');

        fs.writeFile(filePath, jsonString, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log('File Was Written Successfully');
            }
        });
        */
    }

    
}