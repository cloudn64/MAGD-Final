var gamestate;

function setup() {
  createCanvas(400, 400);

  gamestate = new GameState(TITLE_STATE);
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
}
