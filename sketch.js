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
  attackishNoise3 = loadSound("assets/sounds/attackishNoise3.wav");

  // Fonts
  gameFont = loadFont("assets/font/PressStart2P-vaV7.ttf");

  // Music
  battleTheme = loadSound("assets/music/battleTheme.wav");
  gameOverTheme = loadSound("assets/music/gameOverTheme.wav");
  victoryTheme = loadSound("assets/music/victoryTheme.wav");

}

function setup() {
  createCanvas(640, 480);

  gamestate = new GameState(PRELOAD_STATE);
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
      gamestate.change(gamestate.transitionTarget);
    }
  } else { // Transition is not active
    gamestate.transitionAlpha = constrain(gamestate.transitionAlpha - gamestate.transitionSpeed, 0, 255);
  }

  // Draw the transition (I think background is a screen fill so this is okay)
  colorMode(RGB);
  background(gamestate.transitionColor[0], gamestate.transitionColor[1], gamestate.transitionColor[2], gamestate.transitionAlpha);
  
}
