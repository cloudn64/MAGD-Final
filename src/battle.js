var battle;

class BattleState {
    constructor() {
        
    }
}

function battleInit(state) {
    print("battle init!!");
    state.stateObject = new BattleState();
    battle = state.stateObject;
}

function battleUpdate(state) {
    print("battle update!");
}

function battleDraw(state) {
    print("battle draw!");
}
