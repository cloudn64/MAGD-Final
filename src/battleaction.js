
const sBattleActionFuncs = [ 
    { init: attackActionInit, update: attackActionUpdate, draw: attackActionDraw, finish: attackActionFinish }, // Attack
    { init: rangedAttackActionInit, update: rangedAttackActionUpdate, draw: rangedAttackActionDraw, finish: rangedAttackActionFinish }, // Ranged Attack
    { init: fireActionInit, update: fireActionUpdate, draw: fireActionDraw, finish: fireActionFinish }, // Fire Magic Attack
 ];

class BattleAction {
    constructor(actionID, sourceCharacter, targetCharacter, skillIndex) {
        // action stuff
        this.actionID = actionID;
        this.isDone = false;
        this.isInit = false;
        this.timer = 0;

        // character stuff
        this.sourceCharacter = sourceCharacter;
        this.targetCharacter = targetCharacter;
        this.skillIndex = skillIndex; // sourceCharacter's skillIndex, mostly just used to get the stats and name

        // functions
        this.init = sBattleActionFuncs[this.actionID].init;
        this.update = sBattleActionFuncs[this.actionID].update;
        this.draw = sBattleActionFuncs[this.actionID].draw;
        this.finish = sBattleActionFuncs[this.actionID].finish;
    }

    init(action) {
        this.init(this);
    }

    draw(action) {
        this.draw(this);
    }

    update(action) {
        this.update(this);
    }

    finish(action) {
        this.finish(this);
    }
}

function magicActionGetPotency(action) {
    if (action.skillIndex == -1) {
        return 0;
    }
    var skill = action.sourceCharacter.skills[action.skillIndex];
    return skill.potency;
}

function magicActionGetMPCost(action) {
    if (action.skillIndex == -1) {
        return 0;
    }
    var skill = action.sourceCharacter.skills[action.skillIndex];
    return skill.mpCost;
}

/* ATTACK */

function attackActionInit(action) {
    dashNoise.play();
    action.sourceStartPosX = action.sourceCharacter.x;
    action.sourceStartPosY = action.sourceCharacter.y;
    action.targetStartPosX = action.targetCharacter.x;
    action.targetStartPosY = action.targetCharacter.y;

    action.sourceCharacter.x = action.targetCharacter.x;
    action.sourceCharacter.y = action.targetCharacter.y;
    if (action.targetCharacter.isPlayer) {
        action.sourceCharacter.x += 40;
    } else {
        action.sourceCharacter.x -= 40;
    }

    if (action.skillIndex == -1) {
        addParticle(width / 2, 20, 0, 0, 80, PARTICLE_SKILL_TEXT, "Attack", '#FFFFFFFF');
    } else {
        addParticle(width / 2, 20, 0, 0, 80, PARTICLE_SKILL_TEXT, action.sourceCharacter.skills[action.skillIndex].name, '#FFFFFFFF');
    }
    action.sourceCharacter.animation.changeAnim(1, 6, 0.22, false);
}

function attackActionUpdate(action) {
    if (!action.isInit) {
        if (action.sourceCharacter.hpTarget <= 0 || action.targetCharacter.hpTarget <= 0) {
            action.isDone = true;
            return;
        }
        action.isInit = true;
        action.init(action);
    }
    action.timer++;
    if (action.timer == 20) {
        attackishNoise.play();
        var damage = action.targetCharacter.applyDamage(70, action.sourceCharacter.strength);
        action.targetCharacter.animation.changeAnim(2, 1, 0.32, true);
        addParticle(action.targetCharacter.x + 30 + random(-16, 16), action.targetCharacter.y, 0, -1.9, 45, PARTICLE_TEXT, damage, '#FFFFFFFF');
    }
    if (action.timer >= 20) {
        action.targetCharacter.x = action.targetStartPosX + random(-9, 9);
        action.targetCharacter.y = action.targetStartPosY + random(-9, 9);
    }

    if (action.timer >= 60) {
        action.sourceCharacter.x = action.sourceStartPosX;
        action.sourceCharacter.y = action.sourceStartPosY;
    }

    if (action.timer >= 80 && action.targetCharacter.animation != 2) {
        action.finish(action);
    }
}

function attackActionDraw(action) {

}

function attackActionFinish(action) {
    action.sourceCharacter.x = action.sourceStartPosX;
    action.sourceCharacter.y = action.sourceStartPosY;
    action.targetCharacter.x = action.targetStartPosX;
    action.targetCharacter.y = action.targetStartPosY;
    action.targetCharacter.defaultAnim();
    action.sourceCharacter.defaultAnim();
    action.isDone = true;
}

/* RANGED ATTACK */

function rangedAttackActionInit(action) {
    action.sourceStartPosX = action.sourceCharacter.x;
    action.sourceStartPosY = action.sourceCharacter.y;
    action.targetStartPosX = action.targetCharacter.x;
    action.targetStartPosY = action.targetCharacter.y;

    if (action.skillIndex == -1) {
        addParticle(width / 2, 20, 0, 0, 80, PARTICLE_SKILL_TEXT, "Attack", '#FFFFFFFF');
    } else {
        addParticle(width / 2, 20, 0, 0, 80, PARTICLE_SKILL_TEXT, action.sourceCharacter.skills[action.skillIndex].name, '#FFFFFFFF');
    }
    action.sourceCharacter.animation.changeAnim(1, 6, 0.22, false);
}

function rangedAttackActionUpdate(action) {
    if (!action.isInit) {
        if (action.sourceCharacter.hpTarget <= 0 || action.targetCharacter.hpTarget <= 0) {
            action.isDone = true;
            return;
        }
        action.isInit = true;
        action.init(action);
    }
    action.timer++;
    if (action.timer == 20) {
        attackishNoise.play();
        var damage = action.targetCharacter.applyDamage(70, action.sourceCharacter.strength);
        action.targetCharacter.animation.changeAnim(2, 1, 0.32, true);
        addParticle(action.targetCharacter.x + 30 + random(-16, 16), action.targetCharacter.y, 0, -1.9, 45, PARTICLE_TEXT, damage, '#FFFFFFFF');
    }
    if (action.timer >= 20) {
        action.targetCharacter.x = action.targetStartPosX + random(-9, 9);
        action.targetCharacter.y = action.targetStartPosY + random(-9, 9);
    }

    if (action.timer >= 60) {
        action.sourceCharacter.x = action.sourceStartPosX;
        action.sourceCharacter.y = action.sourceStartPosY;
    }

    if (action.timer >= 80 && action.targetCharacter.animation != 2) {
        action.finish(action);
    }
}

function rangedAttackActionDraw(action) {

}

function rangedAttackActionFinish(action) {
    action.sourceCharacter.x = action.sourceStartPosX;
    action.sourceCharacter.y = action.sourceStartPosY;
    action.targetCharacter.x = action.targetStartPosX;
    action.targetCharacter.y = action.targetStartPosY;
    action.targetCharacter.defaultAnim();
    action.sourceCharacter.defaultAnim();
    action.isDone = true;
}

/* GENERIC MAGIC ATTACK */

function fireActionInit(action) {
    action.sourceStartPosX = action.sourceCharacter.x;
    action.sourceStartPosY = action.sourceCharacter.y;
    action.targetStartPosX = action.targetCharacter.x;
    action.targetStartPosY = action.targetCharacter.y;

    if (action.skillIndex == -1) {
        addParticle(width / 2, 20, 0, 0, 80, PARTICLE_SKILL_TEXT, "Attack");
    } else {
        addParticle(width / 2, 20, 0, 0, 80, PARTICLE_SKILL_TEXT, action.sourceCharacter.skills[action.skillIndex].name, '#FFFFFFFF');
    }
    addParticle(action.sourceCharacter.x, action.sourceCharacter.y, 0, 0, 80, PARTICLE_MAGIC, "", '#FF0000FF');
    action.sourceCharacter.animation.changeAnim(4, 1, 0.12, true);
    action.sourceCharacter.applyMagic(-magicActionGetMPCost(action));
    magicishNoise10.play();
}

function fireActionUpdate(action) {
    if (!action.isInit) {
        if (action.sourceCharacter.hpTarget <= 0 || action.targetCharacter.hpTarget <= 0) {
            action.isDone = true;
            return;
        }
        action.isInit = true;
        action.init(action);
    }
    action.timer++;
    if (action.timer == 20) {
        attackishNoise.play();
        var damage = action.targetCharacter.applyDamage(magicActionGetPotency(action), action.sourceCharacter.magic);
        action.targetCharacter.animation.changeAnim(2, 1, 0.32, true);
        addParticle(action.targetCharacter.x + 30 + random(-16, 16), action.targetCharacter.y, 0, -1.9, 45, PARTICLE_TEXT, damage, '#FFFFFFFF');
    }
    if (action.timer >= 20) {
        if (action.timer % 20) {
            attackishNoise3.play();
            addParticle(action.targetCharacter.x, action.targetCharacter.y, random(-5, 5), random(-8, 1), 80, PARTICLE_SMALL_FIRE, "", '#FFFFFFFF');
        }
        action.targetCharacter.x = action.targetStartPosX + random(-9, 9);
        action.targetCharacter.y = action.targetStartPosY + random(-9, 9);
    }

    if (action.timer >= 60) {
        action.sourceCharacter.x = action.sourceStartPosX;
        action.sourceCharacter.y = action.sourceStartPosY;
    }

    if (action.timer >= 80 && action.targetCharacter.animation != 2) {
        action.finish(action);
    }
}

function fireActionDraw(action) {

}

function fireActionFinish(action) {
    action.sourceCharacter.x = action.sourceStartPosX;
    action.sourceCharacter.y = action.sourceStartPosY;
    action.targetCharacter.x = action.targetStartPosX;
    action.targetCharacter.y = action.targetStartPosY;
    action.targetCharacter.defaultAnim();
    action.sourceCharacter.defaultAnim();
    action.isDone = true;
}