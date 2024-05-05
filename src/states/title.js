/*

    TitleState

    The title screen.

*/

var title;

class TitleState {
    constructor() {
        this.temporaryButton = newButton("START", 20, 20, 200, 60, 45, LEFT, LEFT);
    }
}

function titleScreenInit(state) {
    print("Title Screen Initialize!");
    state.stateObject = new TitleState();
    title = state.stateObject;
}

// This function runs before Draw. Use this for logic that isn't drawing
function titleScreenUpdate(state) {
    title.temporaryButton.update();

    if (title.temporaryButton.click == true) {
        state.transition(BATTLE_STATE, 5, 255, 255, 255);
        title.temporaryButton.ignore = true;
    }
}

// This function runs after Update. Use this for drawing things
function titleScreenDraw(state) {
    fill(2255, 255, 255);
    textAlign(CENTER);
    textSize(20);
    text("The Big Quest", width / 2, height / 2);

    title.temporaryButton.draw();
}


/*

    Notes for Sam:

    The title screen needs a button that starts the Pre-Battle Screen
    And another button that displays the high scores

    Here is code that will transition to the Pre-Battle screen:

        state.transition(PREBATTLE_STATE, 5, 255, 255, 255);

    And here is EXAMPLE code that will display the high scores:

        fill(2255, 255, 255);
        textAlign(CENTER);
        textSize(30);
        text(highscores.toString(), width / 2, height / 2);

    There is also an EXAMPLE button already on the title screen.

    The button is very customizable, read the button class in menus.js to see what can be customized.

    Drawing stuff goes in the titleScreenDraw function
    Other stuff like reacting to button presses and stuff goes in the titleScreenUpdate function
    As it is in the EXAMPLE code.

    A nice title screen has sounds, fonts, graphics, and doesn't have things pop up instantly--
    but whatever you can do should be alright!

    Lab 8 has an example of loading fonts and images, I think.
    Lab 9 has an example of sound, I think.

    You are free to message me if you need help.

*/