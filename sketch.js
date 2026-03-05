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

let deathSound;
let laserSound;
let thrusterSound;
let teleportSound;
let alarmSound;
let gameMusic;

function preload() {
  deathSound = loadSound("sounds/SpaceExplosion.wav");
  laserSound = loadSound("sounds/Laser1.wav");
  alarmSound = loadSound("sounds/SaucerAlarm.wav");

  thrusterSound = loadSound("sounds/ShipThruster.wav");
  teleportSound = loadSound("sounds/Teleport.wav");

  gameMusic = loadSound("sounds/MainGameMusic.mp3");
}

function setup() {
  createCanvas(800, 800);

  gameInstance = new GameInstance();
  
}

function draw() {
  background(0);
  gameInstance.GameUpdate();
}

function mouseClicked() {
  gameMusic.loop();
  gameMusic.setVolume(0.5);
}
