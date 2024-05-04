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

        this.uiCharacter = -1; // if not -1, this is the ID of the character who is displaying the UI right now
        this.uiEnemy = -1; // If not -1, this is the ID of the character being targeted by the UI right now (enemy is slightly misleading)
        this.uiPage = 0; // page 0 is the basic commands, page 1 is the skill menu, page 2 is the target menu
        this.statusMenu = new BattleStatus(210, height - 159, width - 211, 158, this);
        this.targetMenu = new BattleStatus(210, height - 159, width - 211, 158, this);

        this.attackButton = newButton("Attack", 5, height - 155, 200, 30, 15, LEFT, LEFT);
        this.skillButton = newButton("Magic", 5, height - 115, 200, 30, 15, LEFT, LEFT);
        this.defendButton = newButton("Defend", 5, height - 75, 200, 30, 15, LEFT, LEFT);
        this.buttonFour = newButton("Return", 5, height - 35, 200, 30, 15, LEFT, LEFT);

        this.chosenSkill = -1; // if -1, this is the "Attack" command.

        this.battleActionQueue = new Array(); // Queue for battle actions from players
        this.particleQueue = new Array();

    }

    setupBattle0() { // test battle
        this.characters.push(new Character(true,  this.characterTotal++, "Hero", 130, 60, 9999, 999, 1, 1, 399, 1)); // add player
        this.characters.push(new Character(true,  this.characterTotal++, "Hero2", 180, 120, 0, 999, 1, 1, 140, 1)); // add player
        this.characters.push(new Character(true,  this.characterTotal++, "Hero3", 150, 210, 9999, 999, 1, 1, 1, 1)); // add player
        this.characters.push(new Character(false, this.characterTotal++, "Enemy", 480, 150, 2222, 128, 1000, 1, 199, 1)); // add enemy
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

        if (curCharacter != null && !curCharacter.dead) {
            if (curCharacter.isPlayer && targetPlayers) {
               // print("add player to targetList");
                targetList.push(curCharacter);
            } else if (!curCharacter.isPlayer && targetEnemies) {
               // print("add enemy to targetList");
                targetList.push(curCharacter);
            }
        } else {
           // print("character " + character + " is null and can't be targeted");
        }
    }

    if (targetList.length > 0) {
        return random(targetList); // random() can take an array as a parameter according to the reference. Neat!
    } else { // no targets at all
        return null; // returning null is okay provided you bother to check if the thing you got back was null
    }
}

function updateTargetingMode() {
    if (battle.uiCharacter != -1) {
        if (battle.chosenSkill != -1) { // magic
            //print("MAGIC");
            var curSkill = battle.characters[battle.uiCharacter].skills[battle.chosenSkill];
            battle.targetMenu.setupTargetingMode(!curSkill.targetAllies, curSkill.targetDead);
        } else {
            battle.targetMenu.setupTargetingMode(true, false);
        }
    } else {
        battle.targetMenu.setupTargetingMode(true, false);
    }
}

// This function runs before Draw
function battleUpdate(state) {
    // battle is running.

    // update particles
    // unlike the meaningless loop for the battle actions, this loop actually has a reason to exist
    for (var particleIndex = 0; particleIndex < battle.particleQueue.length; particleIndex++) {
        var particle = battle.particleQueue[particleIndex];
        if (particle.update()) {
            battle.particleQueue.splice(particleIndex, 1);
        }
    }
    
    // check all characters to update battle information/flags before updating the characters
    battle.allPlayersDead = true;
    battle.allEnemiesDead = true;
    for (var character = 0; character < battle.characters.length; character++) {
        var curCharacter = battle.characters[character];

        if (curCharacter == null) {
            print("ERR null character " + character + " existing in pool");
        } else {
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
        } /*else if (curCharacter.dead == true) {
            //print("character " + character + " is dead");
        } */else {
            curCharacter.update(battle.atbWait);
        }
    }

    // UI
    var statusChosen = battle.statusMenu.getChosen();
    if (statusChosen == -1 || battle.allPlayersDead || battle.allEnemiesDead) {
        battle.uiPage = 0;
        battle.uiCharacter = -1;
        battle.attackButton.disabled = true;
        battle.skillButton.disabled = true;
        battle.defendButton.disabled = true;
    } else {
        battle.uiCharacter = battle.statusMenu.optCharacterIndex[statusChosen];
        battle.attackButton.disabled = false;
        battle.skillButton.disabled = false;
        battle.defendButton.disabled = false;
    }

    var enemyChosen = battle.targetMenu.getChosen();
    if (enemyChosen == -1) {
        battle.uiEnemy = -1;
    } else {
        battle.uiEnemy = battle.targetMenu.optCharacterIndex[enemyChosen];
    }

    battle.attackButton.update();
    battle.skillButton.update();
    battle.defendButton.update();
    battle.buttonFour.update();

    updateTargetingMode(); // I am aware that this function is called twice

    switch (battle.uiPage) {
        case 0: // command menu
            battle.buttonFour.disabled = true;
            if (battle.uiCharacter != -1) {
                battle.characters[battle.uiCharacter].skillMenu.menu.highlightedOption = -1;
                if (battle.defendButton.click) {
                    activateDefend(battle.characters[battle.uiCharacter]);
                    battle.uiPage = 0;
                    battle.chosenSkill = -1;
                    battle.targetMenu.selectedOption = -1;
                } else if (battle.skillButton.click || battle.skillButton.hold) {
                    battle.uiPage = 1;
                    battle.targetMenu.selectedOption = -1;
                } else if (battle.attackButton.click || battle.attackButton.hold) {
                    battle.chosenSkill = -1;
                    battle.uiPage = 2;
                    battle.targetMenu.selectedOption = -1;
                }
            }
            break;
        case 1: // skill (magic) menu
            battle.buttonFour.disabled = false;
            if (battle.uiCharacter != -1) {
                var selection = battle.characters[battle.uiCharacter].skillMenu.getChosen();
                if (selection != null && selection != -1) {
                    print("select " + selection);
                    battle.chosenSkill = selection;
                    battle.uiPage = 2;
                    battle.targetMenu.selectedOption = -1;
                }
                if (battle.defendButton.click) {
                    activateDefend(battle.characters[battle.uiCharacter]);
                    battle.uiPage = 0;
                    battle.chosenSkill = -1;
                    battle.targetMenu.selectedOption = -1;
                } else if (battle.attackButton.click || battle.attackButton.hold) {
                    battle.chosenSkill = -1;
                    battle.uiPage = 2;
                    battle.targetMenu.selectedOption = -1;
                } else if (battle.buttonFour.click) {
                    battle.chosenSkill = -1;
                    battle.uiPage = 0;
                    battle.targetMenu.selectedOption = -1;
                }
            }
            break;
        case 2: // target menu
            battle.buttonFour.disabled = false;
            if (battle.uiCharacter != -1) {
                battle.characters[battle.uiCharacter].skillMenu.menu.highlightedOption = -1;
                if (battle.uiEnemy != -1) {
                    activateSkill(battle.characters[battle.uiCharacter], battle.characters[battle.uiEnemy], battle.chosenSkill);
                    battle.chosenSkill = -1;
                    battle.uiPage = 0;
                    battle.targetMenu.selectedOption = -1;
                } else if (battle.defendButton.click) {
                    activateDefend(battle.characters[battle.uiCharacter]);
                    battle.uiPage = 0;
                    battle.chosenSkill = -1;
                    battle.targetMenu.selectedOption = -1;
                } else if (battle.skillButton.click || battle.skillButton.hold) {
                    battle.uiPage = 1;
                    battle.targetMenu.selectedOption = -1;
                } else if (battle.attackButton.click || battle.attackButton.hold) {
                    battle.chosenSkill = -1;
                    battle.uiPage = 2;
                    battle.targetMenu.selectedOption = -1;
                } else if (battle.buttonFour.click) {
                    if (battle.chosenSkill != -1) {
                        battle.uiPage = 1;
                    } else {
                        battle.uiPage = 0;
                    }
                    battle.chosenSkill = -1;
                    battle.targetMenu.selectedOption = -1;
                }
            }
            break;
    }

    // Update Battle Actions - This loop won't happen if there aren't any in the queue.
    // // it technically doesn't make sense for this to be a loop at all since it only updates index 0,
    // then deletes it, moving index 1 down to index 0.
    // However, this way it's convenient if I decide they can happen simultaneously.
    battle.atbWait = false;
    for (var actionIndex = 0; actionIndex < battle.battleActionQueue.length; actionIndex++) {
        var battleAction = battle.battleActionQueue[actionIndex];
        if (battleAction == null) { // this should be impossible
            print("null battle action destroyed (how did that happen?)");
            battle.battleActionQueue.shift();
        } else if (battleAction.isDone) {
            print("battle action finished");
            battle.battleActionQueue.shift();
        } else {
            //print("update battle action " + actionIndex);
            battle.atbWait = true;
            battleAction.update(battleAction); // I don't know why I have to pass battleAction to this function, actually. Getting tired of JavaScript today
            break;
        }
    }

    if (battle.allPlayersDead || battle.allEnemiesDead) {
        battle.atbWait = true;
    }

}

function addBattleAction(id, source, target, skillIndex) {
    if (source.hpTarget > 0) {
        battle.battleActionQueue.push(new BattleAction(id, source, target, skillIndex));
    }
}

function addParticle(x, y, xVel, yVel, life, type, text) {
    battle.particleQueue.push(new Particle(x, y, xVel, yVel, life, type, text));
}

// Or attack
function activateSkill(source, target, skillIndex) {
    source.atbTimer = 0; // Spend the ATB
    if (skillIndex == -1) {
        addBattleAction(0, source, target, -1);
        print(source.name + " ATTACKING " + target.name);

    } else {
        var skill = source.skills[skillIndex];
        addBattleAction(skill.actionId, source, target, skillIndex);
        print(source.name + " CASTING " + skill.name + " ON " + target.name);
    }
}

function activateDefend(source) {
    source.atbTimer = 0; // Spend the ATB
    source.defending = true;
}

// This function runs after Update
function battleDraw(state) {
    // Draw Battle Actions
    // Still doesn't need to be a loop, check update loop for explanation
    for (var actionIndex = 0; actionIndex < battle.battleActionQueue.length; actionIndex++) {
        var battleAction = battle.battleActionQueue[actionIndex];
        if (battleAction == null) { // this should still be just as impossible as before
            print("null battle action destroyed (how did that happen?)");
            battle.battleActionQueue.shift();
        } else {
            //print("draw battle action " + actionIndex);
            battleAction.draw(battleAction); // I don't know why I have to pass battleAction to this function, actually. Getting tired of JavaScript today
            break;
        }
    }
    
    // draw all characters
    for (var character = 0; character < battle.characters.length; character++) {
        var curCharacter = battle.characters[character];

        if (curCharacter == null) {
            print("ERR null character " + character + " existing in pool");
        } else {
            curCharacter.draw();
        }
    }

    // draw particles
    // unlike the meaningless loop for the battle actions, this loop actually has a reason to exist
    for (var particleIndex = 0; particleIndex < battle.particleQueue.length; particleIndex++) {
        var particle = battle.particleQueue[particleIndex];
        particle.draw();
    }


    // draw the battle menu
    updateTargetingMode(); // I am aware this function appears twice, but that's fine

    // Tooltip
    noStroke();
    textAlign(LEFT, BOTTOM);
    textSize(15);
    fill('#FFFFFFFF');
    if (battle.uiCharacter != -1) {
        var thisCharacter = battle.characters[battle.uiCharacter];
        if (battle.attackButton.highlight) {
            text("Attack with " + thisCharacter.name + "\'s weapon", 5, height - 160);
        } else if (battle.skillButton.highlight) {
            text("Use " + thisCharacter.name + "\'s magic", 5, height - 160);
        } else if (battle.defendButton.highlight) {
            text("Have " + thisCharacter.name + " defend", 5, height - 160);
        } else if (battle.buttonFour.highlight) {
            if (battle.buttonFour.disabled) {
                fill('#444444FF');
            }
            text("Return to previous menu", 5, height - 160);
        }
    }

    switch (battle.uiPage) {
        case 0: // command menu
            battle.statusMenu.draw();
            break;
        case 1: // skill (magic) menu
            if (battle.uiCharacter != -1) { // it should be impossible, but the more random checks, the less testing I have to do at the end
                var thisCharacter = battle.characters[battle.uiCharacter];
                var highlightedSpell = battle.characters[battle.uiCharacter].skillMenu.menu.highlightedOption;
                var available = (highlightedSpell != -1) ? battle.characters[battle.uiCharacter].skillMenu.menu.options[highlightedSpell].available : false;
                fill('#FFFFFFFF');
                if (highlightedSpell == -1) {
                    text("Choose a magic ability", 220, height - 160);
                } else {
                    var spell = battle.characters[battle.uiCharacter].skills[highlightedSpell];
                    if (!available) {
                        fill('#444444FF');
                    }
                    text(spell.description, 220, height - 160);
                }
                textSize(8);
                fill('#FFFFFFFF');
                textAlign(RIGHT, BOTTOM);
                text("Scroll wheel if there's more spells", width - 5, height - 160);
            } else {
                battle.uiPage = 0;
            }
            battle.characters[battle.uiCharacter].drawSkillMenu();
            break;
        case 2: // target menu
            if (battle.uiCharacter != -1) { // it should be impossible, but the more random checks, the less testing I have to do at the end
                var thisCharacter = battle.characters[battle.uiCharacter];
                var battleHighlight = battle.targetMenu.highlightedOption;
                var battleTargetCharacter = (battleHighlight != -1) ? battle.targetMenu.optCharacterIndex[battleHighlight] : -1;
                fill('#FFFFFFFF');
                if (battleTargetCharacter == -1) {
                    text("Choose a target", 220, height - 160);
                } else {
                    var targetCharacter = battle.characters[battleTargetCharacter];
                    var targetSpell = (battle.chosenSkill != -1) ? thisCharacter.skills[battle.chosenSkill] : null;
                    if (targetSpell != null) {
                        text("Cast \"" + targetSpell.name + "\" on \"" + targetCharacter.name + "\"", 220, height - 160);
                    } else {
                        text("Attack \"" + targetCharacter.name + "\"", 220, height - 160);
                    }
                }
                battle.targetMenu.draw();
            } else {
                battle.uiPage = 0;
            }
            break;
    }

    battle.attackButton.draw();
    battle.skillButton.draw();
    battle.defendButton.draw();
    battle.buttonFour.draw();
}
