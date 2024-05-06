/*

    PreBattleState

    The screen before you begin battle. I'm not sure what happens here yet.

*/

var preBattle;

class PreBattleState {
    constructor() {
        this.testBattleButton = newButton("Test", width / 2, 100, 200, 60, 45, CENTER, LEFT);
        this.waterBattleButton = newButton("Water", width / 2, 210, 250, 60, 45, CENTER, LEFT);
        this.partySelect1Button = newButton("1", 170, 280, 60, 60, 45, CENTER, LEFT);
        this.partySelect2Button = newButton("2", 270, 280, 60, 60, 45, CENTER, LEFT);
        this.partySelect3Button = newButton("3", 370, 280, 60, 60, 45, CENTER, LEFT);
        this.partySelect4Button = newButton("4", 470, 280, 60, 60, 45, CENTER, LEFT);

        this.myParty = [ 0, 1, 2, 3 ];
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
    // the party select buttons do nothing for now
    preBattle.partySelect1Button.update();
    preBattle.partySelect2Button.update();
    preBattle.partySelect3Button.update();
    preBattle.partySelect4Button.update();

    if (preBattle.testBattleButton.click == true) {
        state.transition(BATTLE_STATE, 5, 255, 255, 255, new BattleInit(0, preBattle.myParty));
        preBattle.testBattleButton.ignore = true;
        preBattle.waterBattleButton.ignore = true;
    } else if (preBattle.waterBattleButton.click == true) {
        state.transition(BATTLE_STATE, 5, 255, 255, 255, new BattleInit(1, preBattle.myParty));
        preBattle.testBattleButton.ignore = true;
        preBattle.waterBattleButton.ignore = true;
    }

   /* if (preBattle.partySelect1Button.click == true){
      //  myParty.next
    }
    */

}

// This function runs after Update
function preBattleDraw(state) {
    image(selectScreenImg, 0,0, width, height)
    fill(2255, 255, 255);
    textAlign(CENTER);
    textSize(20);
    text("Select a Fight", width / 2, 60);
    text("Party" + "\n" + "Select", 70, 310)

    preBattle.testBattleButton.draw();
    preBattle.waterBattleButton.draw();
    preBattle.partySelect1Button.draw();
    preBattle.partySelect2Button.draw();
    preBattle.partySelect3Button.draw();
    preBattle.partySelect4Button.draw();

}
