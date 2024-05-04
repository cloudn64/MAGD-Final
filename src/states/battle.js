/*

    BattleState

    The battle gameplay.

*/

var battle;

class BattleState {
    constructor() {
        this.characters = new Array();
        this.characterTotal = 0; // likely unnecessary
        this.atbWait; // flag to pause everyone's ATB timers
        this.allPlayersDead = true;
        this.allEnemiesDead = true;

        this.uiCharacter = 0; // if not -1, this is the ID of the character who is displaying the UI right now
        this.uiPage = 0; // page 0 is the basic commands, page 1 is the skill menu, page 2 is the target menu
        this.statusMenu = new BattleStatus(210, height - 159, width - 211, 158, this);
        this.attackButton = newButton("Attack", 5, height - 155, 200, 30, LEFT, LEFT);
        this.skillButton = newButton("Magic", 5, height - 115, 200, 30, LEFT, LEFT);
        this.defendButton = newButton("Defend", 5, height - 75, 200, 30, LEFT, LEFT);
        this.buttonFour = newButton("Item", 5, height - 35, 200, 30, LEFT, LEFT);

    }

    setupBattle0() { // test battle
        this.characters.push(new Character(true,  this.characterTotal++, "Hero", 9999, 999, 1, 1, 20, 1)); // add player
        this.characters.push(new Character(false, this.characterTotal++, "Enemy", 2222, 128, 1, 1, 90, 1)); // add enemy
    }
}

function battleInit(state) {
    state.stateObject = new BattleState();
    battle = state.stateObject;

    populateGlobalSkillList();

    battle.setupBattle0();
}

// selects a random target
function getRandomTarget(targetPlayers, targetEnemies) {
    var targetList = new Array();

    print("create targetList. Max: " + battle.characters.length);

    for (var character = 0; character < battle.characters.length; character++) {
        var curCharacter = battle.characters[character];

        if (curCharacter != null) {
            if (curCharacter.isPlayer && targetPlayers) {
                print("add player to targetList");
                targetList.push(curCharacter);
            } else if (!curCharacter.isPlayer && targetEnemies) {
                print("add enemy to targetList");
                targetList.push(curCharacter);
            }
        } else {
            print("character " + character + " is null and can't be targeted");
        }
    }

    if (targetList.length > 0) {
        return random(targetList); // random() can take an array as a parameter according to the reference. Neat!
    } else { // no targets at all
        return null; // returning null is okay provided you bother to check if the thing you got back was null
    }
}

// This function runs before Draw
function battleUpdate(state) {
    // battle is running.
    
    // check all characters to update battle information/flags before updating the characters
    battle.atbWait = false;
    battle.allPlayersDead = true;
    battle.allEnemiesDead = true;
    for (var character = 0; character < battle.characters.length; character++) {
        var curCharacter = battle.characters[character];

        if (curCharacter == null) {
            print("ERR null character " + character + " existing in pool");
        } else {
            if (!curCharacter.dead && curCharacter.isActing == true) {
                battle.atbWait = true;
            }
            if (curCharacter.isPlayer && !curCharacter.dead) {
                battle.allPlayersDead = false;
            } else if (!curCharacter.isPlayer && !curCharacter.dead) {
                battle.allEnemiesDead = false;
            }
        }
    }

    // update all characters
    for (var character = 0; character < battle.characters.length; character++) {
        var curCharacter = battle.characters[character];

        if (curCharacter == null) {
            print("ERR null character " + character + " existing in pool");
        } else if (curCharacter.dead == true) {
            print("character " + character + " is dead");
        } else {
            curCharacter.update(battle.atbWait);
        }
    }

    // UI
    if (battle.uiCharacter != -1 && battle.characters[battle.uiCharacter] != null) {
        
        switch (battle.uiPage) {
            case 0: // command menu
                battle.attackButton.update();
                battle.skillButton.update();
                battle.defendButton.update();
                battle.buttonFour.update();
                break;
            case 1: // skill (magic) menu
                break;
            case 2: // target menu
                break;
        }
    }


}

// This function runs after Update
function battleDraw(state) {
    /*textSize(30);
    textAlign(LEFT, LEFT);
    
    battle.characters[0].debugString(20, 20);

    textAlign(RIGHT, RIGHT);

    battle.characters[1].debugString(width - 20, 20);

    textAlign(LEFT, LEFT);
    text("atbPaused: " + battle.atbWait + "\nplayersAreDead: " + battle.allPlayersDead + "\nenemiesAreDead: " + battle.allEnemiesDead, 20, height - 80);*/

    //battle.commandMenu.draw();

    //battle.characters[0].drawSkillMenu();

    // draw the battle menu
    if (battle.uiCharacter != -1 && battle.characters[battle.uiCharacter] != null) {
        
        switch (battle.uiPage) {
            case 0: // command menu
                battle.statusMenu.draw();
                //battle.characters[battle.uiCharacter].drawSkillMenu();
                battle.attackButton.draw();
                battle.skillButton.draw();
                battle.defendButton.draw();
                battle.buttonFour.draw();
                break;
            case 1: // skill (magic) menu
                battle.characters[battle.uiCharacter].drawSkillMenu();
                break;
            case 2: // target menu
                break;
        }
    }
}
