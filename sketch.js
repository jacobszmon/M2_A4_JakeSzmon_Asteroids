// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let player;
let asteroids = [];
function setup() {
  createCanvas(800, 800);
  player = new Player(createVector(400, 400), 0);
  
  push();
  for (let i = 0; i < 10; i++) {
    angleMode(DEGREES);
    let randX = random(0, width);
    let randY = random(0, height);
    let randAngle = random(0, 360);
    let randVelocity = p5.Vector.random2D().mult(1);
    asteroids.push(new Asteroid(createVector(randX, randY), randAngle, randVelocity));
  }
  pop();

}

function draw() {
  background(220);
  player.Update();
  player.Draw();

  asteroids.forEach(asteroid => {
    asteroid.Update();
    asteroid.Draw();
  });
}
