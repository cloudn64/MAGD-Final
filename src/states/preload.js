/*

    PreloadState

    This screen appears once, when you first open the game.
    It just asks you to interact with the page before loading the title screen,
    because Google Chrome doesn't play audio until you interact with the page.

*/

var preload;

class PreloadState {
    constructor() {
        this.testString = "Preload Test String";
    }
}

function preloadInit(state) {
    print("Preload Screen Initialized!!");
    state.stateObject = new PreloadState();
    prelod = state.stateObject;
}

// This function runs before Draw
function preloadUpdate(state) {
    if (gamestate.transitionTarget == -1 && mouseIsPressed) {
        state.transition(TITLE_STATE, 5, 255, 255, 255);
    }
}

// This function runs after Update
function preloadDraw(state) {
    fill(255, 255, 255);
    textAlign(CENTER);
    textSize(15);
    text("placeholder screen\ntap the screen to start the game\n\nhere are some swear words to make sure this doesn't stay in the game\nfuck fuck fuck fuck fuck fuck fuck fuck fuck fuck fuck", width / 2, height / 2);
}
