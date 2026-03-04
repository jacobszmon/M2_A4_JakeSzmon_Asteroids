class HUD {
    constructor(gameInstance) {
        this.gameInstance = gameInstance;

        this.scorePrefix = "Score: ";
        this.scoreColor = "white";
        this.scoreSize = 20;

        this.lifeColor = "white";
        this.emptyColor = "grey"
        this.lifeSize = 30;

        this.margins = 20;
    }

    Draw() {
        push();
            textAlign(LEFT, TOP);

            fill(this.scoreColor);
            textSize(this.scoreSize);
            let scoreText = this.scorePrefix + this.gameInstance.score;
            text(scoreText, this.margins, this.margins);

            fill(this.lifeColor);
            for (let i = 0; i < this.gameInstance.maxLives; i++) {
                let drawColor = (i < this.gameInstance.currentLives)? this.lifeColor : this.emptyColor;
                let circlePosX = width - this.margins - (this.lifeSize/2) - (i * (this.lifeSize + this.margins));
                let circlePosY = this.margins + (this.lifeSize/2);

                fill(drawColor);
                circle(circlePosX, circlePosY, this.lifeSize);
            }
            

        pop();
    }
}