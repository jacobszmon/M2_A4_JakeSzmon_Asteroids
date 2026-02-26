// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let gameInstance;

const OBJECT_TYPE = Object.freeze({
  PLAYER: 0,
  ASTEROID: 1,
  BULLET: 2,
});

function setup() {
  createCanvas(800, 800);

  gameInstance = new GameInstance();
}

function draw() {
  background(220);
  
  gameInstance.GameUpdate();
}
