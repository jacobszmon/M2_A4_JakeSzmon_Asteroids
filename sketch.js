// M2 - A04 - Asteroids
// Jake Szmon
// Program Description: My Recreation of the classic game Asteroids, made using javascript with the p5.js library.


// ------ SOUNDS & FONTS ------
let deathSound;
let laserSound;
let thrusterSound;
let teleportSound;
let alarmSound;
let gameMusic;

let titleFont;
let bodyFont;

function preload() {
  // SOUNDS
  deathSound = loadSound("sounds/SpaceExplosion.wav");
  laserSound = loadSound("sounds/Laser1.wav");
  alarmSound = loadSound("sounds/SaucerAlarm.wav");

  thrusterSound = loadSound("sounds/ShipThruster.wav");
  teleportSound = loadSound("sounds/Teleport.wav");

  gameMusic = loadSound("sounds/MainGameMusic.mp3");

  // FONTS
  titleFont = loadFont('fonts/MajorMonoDisplay-Regular.ttf');
  bodyFont = loadFont('fonts/ChakraPetch-SemiBold.ttf');
}
// Start audio context and music on mouse click.
function mouseClicked() {
  userStartAudio();
  if (!gameMusic.isPlaying()) {
    gameMusic.loop();
    gameMusic.setVolume(0.5);
  }
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
  PARTICLE_B : 8,
  PARTICLE_C : 9
});

// ------ GLOBAL SKETCH FUNCS ------
function setup() {
  createCanvas(1000, 800);
  
  mainMenu = new MainMenu();
}

function draw() {
  background(0);
  if (gameActive){
    gameInstance.GameUpdate();
  }
  
  mainMenu.Draw();
}


