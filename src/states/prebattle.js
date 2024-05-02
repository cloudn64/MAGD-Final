/*

    PreBattleState

    The screen before you begin battle. I'm not sure what happens here yet.

*/

var preBattle;

class PreBattleState {
    constructor() {
        // nothing at the moment
    }
}

function preBattleInit(state) {
    state.stateObject = new PreBattleState();
    preBattle = state.stateObject;
}

// This function runs before Draw
function preBattleUpdate(state) {
    
}

// This function runs after Update
function preBattleDraw(state) {
    fill(2255, 255, 255);
    textAlign(CENTER);
    textSize(50);
    text("This is the prebattle screen", width / 2, height / 2);


}
