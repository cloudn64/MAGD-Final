var gamestate;
var highscores;

function preload() {
  // Sound effects. I'm not sure if it's just smart, but I noticed I didn't actually have to create variables for these using 'let' or 'var', which is strange.
  optCycleNoise = loadSound("assets/sounds/cycleNoise.wav");
  optChooseNoise = loadSound("assets/sounds/selectNoise.wav");
  optNoNoise = loadSound("assets/sounds/noNoise.wav");
  optNoNoise2 = loadSound("assets/sounds/noNoise2.wav");
  attackishNoise = loadSound("assets/sounds/attackishNoise.wav");
  dashNoise = loadSound("assets/sounds/dash.wav");
  blockNoise = loadSound("assets/sounds/blockSound.wav");
  attackishNoise3 = loadSound("assets/sounds/attackishNoise3.wav");
  attackishNoise5 = loadSound("assets/sounds/attackishNoise5.wav");
  magicishNoise = loadSound("assets/sounds/magicishNoise.wav");
  magicishNoise2 = loadSound("assets/sounds/magicishNoise2.wav");
  magicishNoise3 = loadSound("assets/sounds/magicishNoise3.wav");
  magicishNoise4 = loadSound("assets/sounds/magicishNoise4.wav");
  magicishNoise5 = loadSound("assets/sounds/magicishNoise5.wav");
  magicishNoise6 = loadSound("assets/sounds/magicishNoise6.wav");
  magicishNoise7 = loadSound("assets/sounds/magicishNoise7.wav");
  magicishNoise8 = loadSound("assets/sounds/magicishNoise8.wav");
  magicishNoise9 = loadSound("assets/sounds/magicishNoise9.wav");
  magicishNoise10 = loadSound("assets/sounds/magicishNoise10.wav");
  magicishNoise11 = loadSound("assets/sounds/magicishNoise11.wav");
  magicishNoise12 = loadSound("assets/sounds/magicishNoise12.wav");
  scanNoise = loadSound("assets/sounds/scanNoise.wav");
  horribleNoise = loadSound("assets/sounds/interestingSound.wav");

  // Fonts
  gameFont = loadFont("assets/font/PressStart2P-vaV7.ttf");

  // Music
  battleTheme = createAudio("assets/music/battleTheme.wav");
  ultimanTheme = createAudio("assets/music/ultimanTheme.wav");
  gameOverTheme = loadSound("assets/music/gameOverTheme.wav");
  victoryTheme = loadSound("assets/music/victoryTheme.wav");

  // Backgrounds/Images
  waterFightImg  = loadImage('assets/backgrounds/waterbottlefight.png');
  waterFightEndImg = loadImage('assets/backgrounds/waterbottlefightend.png');
  titleScreenImg = loadImage('assets/backgrounds/titlescreenbackground.png');
  battleFieldImg = loadImage('assets/backgrounds/battlefieldbackground.png');

}

function setup() {
  createCanvas(640, 480);

  gamestate = new GameState(PRELOAD_STATE, 0);
  highscores = new HighscoreList("highscore.txt");

}

function draw() {
  background(0);

  // The game's current state is initialized if necessary
  gamestate.init();

  // The game's current state is updated
  gamestate.update();

  // The game's current state is drawn
  gamestate.draw();

  // Transition color
  if (gamestate.transitionTarget != -1) { // Transition is active
    gamestate.transitionAlpha = constrain(gamestate.transitionAlpha + gamestate.transitionSpeed, 0, 255);
    if (gamestate.transitionAlpha >= 255) {
      gamestate.change(gamestate.transitionTarget, gamestate.transitionInitArgs);
    }
  } else { // Transition is not active
    gamestate.transitionAlpha = constrain(gamestate.transitionAlpha - gamestate.transitionSpeed, 0, 255);
  }

  // Draw the transition (I think background is a screen fill so this is okay)
  colorMode(RGB);
  background(gamestate.transitionColor[0], gamestate.transitionColor[1], gamestate.transitionColor[2], gamestate.transitionAlpha);
  
}
