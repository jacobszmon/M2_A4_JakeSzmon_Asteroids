class HUD {

    constructor(gameInstance) {
        // Where we get our values from
        this.gameInstance = gameInstance;

        // GENERAL VALUES
        this.margins = 20;

        // SCORE DISPLAY VALUES
        this.scorePrefix = "Score: ";
        this.scoreColor = "white";
        this.scoreSize = 25;

        
        // LIFE DISPLAY VALUES
        this.lifeColor = "white";
        this.emptyColor = "grey"
        this.lifeSize = 30;

        this.lifeShape = [
            createVector(0, 0),
            createVector(10, -10),
            createVector(20, 0),
            createVector(0, 20),
            createVector(-20, 0),
            createVector(-10, -10),
        ]
    }

    Draw() {
        push();
            textAlign(LEFT, TOP);


            // SCORE
            fill(this.scoreColor);
            textSize(this.scoreSize);
            textFont(bodyFont);
            let scoreText = this.scorePrefix + this.gameInstance.score;
            text(scoreText, this.margins, this.margins);


            // LIVES
            for (let i = 0; i < this.gameInstance.maxLives; i++) {
                // Set drawColor to gray if the player has the current life being drawn.
                let drawColor = (i < this.gameInstance.currentLives)? this.lifeColor : this.emptyColor;

                // Find the position of the life currently being drawn.
                let lifePosX = width - this.margins - (this.lifeSize/2) - (i * (this.lifeSize + this.margins));
                let lifePosY = this.margins + (this.lifeSize/2);

                // DRAW HEARTS
                push();
                    translate(lifePosX, lifePosY);
                    noFill();
                    strokeWeight(2.5);
                    stroke(drawColor);

                    beginShape();
                        this.lifeShape.forEach(point => {
                            vertex(point.x, point.y);
                        });
                        vertex(this.lifeShape[0].x, this.lifeShape[0].y);
                    endShape();
                    
                    // Fill hearts with diagonal lines if you have them.
                    if (i < this.gameInstance.currentLives) {
                        line(0, 0, -10, 10);
                        line(-5, -5, -15, 5);
                        line(15, -5, -5, 15);
                    }
                pop();
            }
        pop();
    }
}