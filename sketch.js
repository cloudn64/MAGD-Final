var gamestate;

function setup() {
  createCanvas(640, 480);

  gamestate = new GameState(PRELOAD_STATE);
}

function draw() {
  background(0);

  if (keyIsDown(70)) {
    gamestate.change(BATTLE_STATE);
  }

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
