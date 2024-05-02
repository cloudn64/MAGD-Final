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

        this.commandMenu = new Menu(0, height / 2, width, height / 2);
    }

    setupBattle0() { // test battle
        append(this.characters, new Character(true,  this.characterTotal++, 9999, 999, 1, 1, 20, 1)); // add player
        append(this.characters, new Character(false, this.characterTotal++, 2222, 128, 1, 1, 90, 1)); // add enemy
    }
}

function battleInit(state) {
    state.stateObject = new BattleState();
    battle = state.stateObject;

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
                append(targetList, curCharacter);
            } else if (!curCharacter.isPlayer && targetEnemies) {
                print("add enemy to targetList");
                append(targetList, curCharacter);
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

    battle.commandMenu.draw();
}
