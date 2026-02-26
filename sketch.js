// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let gameObjectManager;
let player;
let asteroids = [];

const OBJECT_TYPE = Object.freeze({
  PLAYER: 0,
  ASTEROID: 1,
  BULLET: 2,
});

function setup() {
  createCanvas(800, 800);

  gameObjectManager = new GameObjectManager();

  gameObjectManager.InstantiateObject(OBJECT_TYPE.PLAYER, createVector(width/2, height/2), 90);

  //player = new Player(createVector(400, 400), 0);
  
  push();
  for (let i = 0; i < 10; i++) {
    angleMode(DEGREES);
    let randX = random(0, width);
    let randY = random(0, height);
    let randAngle = random(0, 360);
    let randVelocity = p5.Vector.random2D().mult(1);
    //asteroids.push(new Asteroid(createVector(randX, randY), randAngle, randVelocity));
    gameObjectManager.InstantiateObject(OBJECT_TYPE.ASTEROID, createVector(randX, randY), randAngle, randVelocity)
  }
  pop();

}

function draw() {
  background(220);
  gameObjectManager.UpdateObjects();
  gameObjectManager.DrawObjects();
  gameObjectManager.CheckCollisions();
  gameObjectManager.ClearDestroyedObjects();
}
