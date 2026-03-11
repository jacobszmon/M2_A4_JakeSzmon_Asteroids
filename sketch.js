// M2 - A04 - Asteroids
// Jake Szmon



// ------ SOUNDS ------
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

function mouseClicked() {
  userStartAudio();
  gameMusic.loop();
  gameMusic.setVolume(0.5);
}

// ------ GLOBAL GAME VARIABLES ------
let mainMenu;
let gameInstance;
let gameActive = false;

const OBJECT_TYPE = Object.freeze({
  PLAYER: 0,
  ASTEROID_BIG: 1,
  ASTEROID_MED: 2,
  ASTEROID_SML: 3,
  BULLET: 4,
  EVIL_BULLET: 5,
  SAUCER_BIG: 6,
  SAUCER_SML: 7,
});

// ------ GLOBAL SKETCH FUNCS ------
function setup() {
  createCanvas(800, 800);
  
  mainMenu = new MainMenu();
  //gameInstance = new GameInstance();
}

function draw() {
  background(0);
  if (gameActive){
    gameInstance.GameUpdate();
  }
  
  mainMenu.Draw();
}


