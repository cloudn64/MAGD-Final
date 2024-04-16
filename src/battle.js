var battle;

class BattleState {
    constructor() {
        this.testString = "Battle Test String";
    }
}

function battleInit(state) {
    print("battle init!!");
    state.stateObject = new BattleState();
    battle = state.stateObject;
}

// This function runs before Draw
function battleUpdate(state) {
    print("battle update!");
}

// This function runs after Update
function battleDraw(state) {
    fill(2255, 255, 255);
    text(battle.testString, 20, 20);
}
