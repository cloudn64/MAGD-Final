/*

    BattleState

    The battle gameplay.

*/

var battle;

class BattleState {
    constructor() {
        this.testString = "Battle Test String";
    }
}

function battleInit(state) {
    state.stateObject = new BattleState();
    battle = state.stateObject;
}

// This function runs before Draw
function battleUpdate(state) {
    
}

// This function runs after Update
function battleDraw(state) {
    fill(2255, 255, 255);
    textAlign(LEFT);
    textSize(20);
    text(battle.testString, 20, 20);
}
