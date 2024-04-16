var title;

class TitleState {
    constructor() {
        this.testString = "Wow, we did it!";
    }
}

function titleScreenInit(state) {
    print("Title Screen Initialize!");

    state.stateObject = new TitleState();
    title = state.stateObject;
}

function titleScreenUpdate(state) {

}

function titleScreenDraw(state) {
    fill(2255, 255, 255);
    text(title.testString, 20, 20);
}
