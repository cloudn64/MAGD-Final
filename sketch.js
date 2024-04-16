var gamestate;

function setup() {
  createCanvas(400, 400);

  gamestate = new GameState(true, TITLE_STATE);
}

function draw() {
  background(0);

  gamestate.update();
  gamestate.draw();
}
