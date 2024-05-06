/*

    PreBattleState

    The screen before you begin battle. I'm not sure what happens here yet.

*/

var preBattle;

class PreBattleState {
    constructor() {
        this.testBattleButton = newButton("Normal Battle", width / 2, 100, 340, 60, 15, CENTER, LEFT);
        this.waterBattleButton = newButton("Water Battle", width / 2, 190, 340, 60, 15, CENTER, LEFT);
        this.basketballBattleButton = newButton("Basketball Battle", width / 2, 280, 340, 60, 15, CENTER, LEFT);
        this.ultimanBattleButton = newButton("Ultiman Battle", width / 2, 370, 340, 60, 15, CENTER, LEFT);

        this.normalPartyButton = newButton("Normal\nParty", 70, 100, 110, 60, 15, CENTER, LEFT);
        this.bonusPartyButton = newButton("BONUS\nParty", 70, 190, 110, 60, 15, CENTER, LEFT);

        this.myParty = [ 0, 2, 7, 8 ];
    }
}

function preBattleInit(state) {
    state.stateObject = new PreBattleState();
    preBattle = state.stateObject;
}

// This function runs before Draw
function preBattleUpdate(state) {
    preBattle.testBattleButton.update();
    preBattle.waterBattleButton.update();
    preBattle.ultimanBattleButton.update();
    preBattle.basketballBattleButton.update();
    preBattle.normalPartyButton.update();
    preBattle.bonusPartyButton.update();

    if (preBattle.testBattleButton.click) {
        state.transition(BATTLE_STATE, 5, 255, 255, 255, new BattleInit(0, preBattle.myParty));
    } else if (preBattle.waterBattleButton.click) {
        state.transition(BATTLE_STATE, 5, 255, 255, 255, new BattleInit(1, preBattle.myParty));
    } else if (preBattle.ultimanBattleButton.click) {
        state.transition(BATTLE_STATE, 5, 255, 255, 255, new BattleInit(2, preBattle.myParty));
    } else if (preBattle.basketballBattleButton.click) {
        state.transition(BATTLE_STATE, 5, 255, 255, 255, new BattleInit(3, preBattle.myParty));
    } else if (preBattle.normalPartyButton.click) {
        preBattle.myParty = [ 0, 2, 7, 8 ];
    } else if (preBattle.bonusPartyButton.click) {
        preBattle.myParty = [ 1, 5, 6, 3 ];
    }

    if (state.transitionTarget != -1) {
        preBattle.testBattleButton.ignore = true;
        preBattle.waterBattleButton.ignore = true;
        preBattle.ultimanBattleButton.ignore = true;
        preBattle.basketballBattleButton.ignore = true;
        preBattle.normalPartyButton.ignore = true;
        preBattle.bonusPartyButton.ignore = true;
    }

}

// This function runs after Update
function preBattleDraw(state) {
    image(selectScreenImg, 0,0, width, height)
    fill(2255, 255, 255);
    textAlign(CENTER);
    textSize(20);
    text("Select a Fight", width / 2, 60);
    text("Party" + "\n" + "Select", 70, 60)

    preBattle.testBattleButton.draw();
    preBattle.waterBattleButton.draw();
    preBattle.ultimanBattleButton.draw();
    preBattle.basketballBattleButton.draw();
    preBattle.normalPartyButton.draw();
    preBattle.bonusPartyButton.draw();

}
