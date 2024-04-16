/*
    Controller class for the game's various states to streamline function switching and whatnot.
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
    constructor(isActive, stateId) {
        this.isActive = isActive;

        // Set up function pointers
        this.initFunc = sGameStateFuncs[stateId].init; // initial function pointer
        this.drawFunc = sGameStateFuncs[stateId].draw; // draw function pointer
        this.updateFunc = sGameStateFuncs[stateId].update; // update function pointer

        // This object will be used by the gamestate, its type will be the appropriate gamestate class.
        // Gamestates have a pointer to this with a name that's easier to use.
        this.stateObject = null;

        // Call the gamestate's init function (appropriate function has null check)
        // Gamestate init functions will set the stateObject to the appropriate GameState object.
        this.init();
    }

    // Invoke non-null gamestate initialization function pointer
    init() {
        if (this.initFunc != null) {
            this.initFunc(this); // call function pointer
        }
    }

    // Invoke non-null gamestate update function pointer if the gamestate is active
    update() {
        if (this.isActive && this.updateFunc != null) {
            this.updateFunc(this); // call function pointer
        }
    }

    // Invoke non-null gamestate draw function pointer if the gamestate is active
    draw() {
        if (this.isActive && this.drawFunc != null) {
            this.drawFunc(this); // call function pointer
        }
    }

    // swap gamestates
    change(nextState) {
        constructor(true, nextState);
    }

}

/*

    Example/Debug GameState below here

*/

var debug;

class DebugState { 
    // nothing
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
    print("test draw!!");
}