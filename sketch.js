// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let gameInstance;

const OBJECT_TYPE = Object.freeze({
  PLAYER: 0,
  ASTEROID_BIG: 1,
  ASTEROID_MED: 2,
  ASTEROID_SML: 3,
  BULLET: 4,
});

function setup() {
  createCanvas(800, 800);

  gameInstance = new GameInstance();
}

function draw() {
  background(220);
  
  gameInstance.GameUpdate();
}
