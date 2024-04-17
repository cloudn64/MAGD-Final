/*

    TitleState

    The title screen.

*/

var title;

class TitleState {
    constructor() {
        this.testString = "Title Screen Test String";
    }
}

function titleScreenInit(state) {
    print("Title Screen Initialize!");
    state.stateObject = new TitleState();
    title = state.stateObject;
}

// This function runs before Draw
function titleScreenUpdate(state) {
    
}

// This function runs after Update
function titleScreenDraw(state) {
    fill(2255, 255, 255);
    textAlign(CENTER);
    textSize(20);
    text("placeholder title screen", width / 2, height / 2);
}
