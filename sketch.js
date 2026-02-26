// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let player;
function setup() {
  createCanvas(800, 800);
  player = new Player(createVector(400, 400), 0);
}

function draw() {
  background(220);
  player.Update();
  player.Draw();
}
