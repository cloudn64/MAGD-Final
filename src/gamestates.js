/*
    GameState

    State controller class for the game's various game states (Title/Battle) to streamline function switching and whatnot.
    Design is based on C language, which is why inheritance is not used for this.
*/

// Not using an enum today! These are 'macros' for the gamestate IDs, because remembering numbers is lame
const DEBUG_STATE = 0;
const BATTLE_STATE = 1;
const TITLE_STATE = 2;

// Function pointers to be used according to corresponding gamestate ID
const sGameStateFuncs = [ 
    { init: debugInit, update: debugUpdate, draw: debugDraw }, // Debug gamestate functions (defined below)
    { init: battleInit, update: battleUpdate, draw: battleDraw }, // Battle gamestate functions (defined in battle.js)
    { init: titleScreenInit, update: titleScreenUpdate, draw: titleScreenDraw } // Battle gamestate functions (defined in battle.js)
 ];

// Base gamestate class
class GameState {
    // Using an invalid value for stateId is UNSAFE-- but you won't do that, right? Why would you?
    constructor(stateId) {
        this.isInitialized; // does not run the draw or update when this is false. Is set to false by changed gamestates, true by init
        this.initFunc; // function pointer to gamestate initialization (more details in change function)
        this.drawFunc; // function pointer to gamestate drawing (more details in change function)
        this.updateFunc; // function pointer to gamestate updating (more details in change function)
        this.stateObject; // state dependent object (more details in change function)

        this.change(stateId);
    }

    // Invoke non-null gamestate initialization function pointer
    init() {
        if (!this.isInitialized && this.initFunc != null) {
            this.initFunc(this); // call function pointer
            this.isInitialized = true;
        }
    }

    // Invoke non-null gamestate update function pointer if the gamestate is active
    update() {
        if (this.isInitialized && this.updateFunc != null) {
            this.updateFunc(this); // call function pointer
        }
    }

    // Invoke non-null gamestate draw function pointer if the gamestate is active
    draw() {
        if (this.isInitialized && this.drawFunc != null) {
            this.drawFunc(this); // call function pointer
        }
    }

    // swap gamestates
    change(stateId) {
        // Set to false by change of gamestate.
        // This is so a gamestate changed in the update function does not call the next state's draw function 
        // before it is updated once. Set to true at the start of a frame, then runs init.
        this.isInitialized = false;

        // Set up function pointers
        this.initFunc = sGameStateFuncs[stateId].init; // initial function pointer
        this.drawFunc = sGameStateFuncs[stateId].draw; // draw function pointer
        this.updateFunc = sGameStateFuncs[stateId].update; // update function pointer

        // This object will be used by the gamestate, its type will be the appropriate gamestate class.
        // Gamestates have a pointer to this with a name that's easier to use.
        this.stateObject = null;
    }

}

/*
    Example/Debug GameState below here
*/

var debug;

class DebugState { 
    constructor() {
        this.testString = "Debug Test String";
    }
}

function debugInit(state) {
    print("test init!!");
    state.StateObject = new DebugState(); // has no reason to exist other than as an example
    debug = state.StateObject;
}

function debugUpdate(state) {
    print("test update!!");
}

function debugDraw(state) {
    fill(2255, 255, 255);
    text(debug.testString, 20, 20);
}