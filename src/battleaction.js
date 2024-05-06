/*
    Battle Action
    These actions control the flow of battle kind of like a script, using the characters as puppets
    The Draw function is probably unused but would have, if time allowed, been for drawing screen effects (like waves)
*/

const BATTLEACTION_ATTACK = 0;
const BATTLEACTION_ATTACK2 = 1;
const BATTLEACTION_FIRE = 2;
const BATTLEACTION_LIFE = 3;
const BATTLEACTION_SCAN = 4;
const BATTLEACTION_CHARGE = 5;
const BATTLEACTION_ENRAGE = 6;
const BATTLEACTION_REGEN = 7;
const BATTLEACTION_MPDRAIN = 8;
const BATTLEACTION_REFLECT = 9;
const BATTLEACTION_SPEED = 10;
const BATTLEACTION_DOOM = 11;

const sBattleActionFuncs = [ 
    { init: attackActionInit, update: attackActionUpdate, draw: attackActionDraw, finish: attackActionFinish }, // Attack
    { init: rangedAttackActionInit, update: rangedAttackActionUpdate, draw: rangedAttackActionDraw, finish: rangedAttackActionFinish }, // Ranged Attack
    { init: fireActionInit, update: fireActionUpdate, draw: fireActionDraw, finish: fireActionFinish }, // Fire Magic
    { init: lifeActionInit, update: lifeActionUpdate, draw: lifeActionDraw, finish: lifeActionFinish }, // Life Magic
    { init: scanActionInit, update: scanActionUpdate, draw: scanActionDraw, finish: scanActionFinish }, // Scan Magic
    { init: chargeActionInit, update: chargeActionUpdate, draw: chargeActionDraw, finish: chargeActionFinish }, // Power Charge Magic
    { init: enrageActionInit, update: enrageActionUpdate, draw: enrageActionDraw, finish: enrageActionFinish }, // Enrage Magic
    { init: regenActionInit, update: regenActionUpdate, draw: regenActionDraw, finish: regenActionFinish }, // Regen Magic
    { init: mpDrainActionInit, update: mpDrainActionUpdate, draw: mpDrainActionDraw, finish: mpDrainActionFinish }, // MP Drain Magic
    { init: reflectActionInit, update: reflectActionUpdate, draw: reflectActionDraw, finish: reflectActionFinish }, // Reflect Magic
    { init: speedActionInit, update: speedActionUpdate, draw: speedActionDraw, finish: speedActionFinish }, // Speed Magic
    { init: doomActionInit, update: doomActionUpdate, draw: doomActionDraw, finish: doomActionFinish }, // Doom Magic
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

function actionApplyDamage(action, amount, power) {
    var dealAmount = amount;
    if (action.sourceCharacter.powerCharge) {
        action.sourceCharacter.powerCharge = false;
        dealAmount *= 1.5;
    }

    if (action.targetCharacter.defending) {
        blockNoise.play();
    }

    return action.targetCharacter.applyDamage(dealAmount, power);
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
    action.sourceCharacter.attackAnim();
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
        var damage = actionApplyDamage(action, 70, action.sourceCharacter.strength);
        action.targetCharacter.hurtAnim();
        var dmgX = action.targetCharacter.x + 30 + random(-16, 16);
        addParticle(dmgX, action.targetCharacter.y, 0, -1.9, 45, PARTICLE_TEXT, damage, '#FFFFFFEE');
        if (action.targetCharacter.hpTarget <= 0) {
            addParticle(dmgX, action.targetCharacter.y + 10, 0, -1.9, 45, PARTICLE_TEXT, "FATAL", '#FF0000EE');
        }
    }
    if (action.timer >= 20) {
        action.targetCharacter.x = action.targetStartPosX + random(-9, 9);
        action.targetCharacter.y = action.targetStartPosY + random(-9, 9);
    }

    if (action.timer >= 60) {
        action.sourceCharacter.x = action.sourceStartPosX;
        action.sourceCharacter.y = action.sourceStartPosY;
    }

    if (action.timer >= 80) {
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
    action.sourceCharacter.attackAnim();
}

function rangedAttackActionUpdate(action) {
    if (!action.isInit) {
        if (action.sourceCharacter.hpTarget <= 0 || action.targetCharacter.hpTarget <= 0 || action.sourceCharacter.enraged > 0) {
            action.isDone = true;
            return;
        }
        action.isInit = true;
        action.init(action);
    }
    action.timer++;
    if (action.timer == 20) {
        attackishNoise.play();
        var damage = actionApplyDamage(action, 70, action.sourceCharacter.strength);
        action.targetCharacter.hurtAnim();
        var dmgX = action.targetCharacter.x + 30 + random(-16, 16);
        addParticle(dmgX, action.targetCharacter.y, 0, -1.9, 45, PARTICLE_TEXT, damage, '#FFFFFFEE');
        if (action.targetCharacter.hpTarget <= 0) {
            addParticle(dmgX, action.targetCharacter.y + 10, 0, -1.9, 45, PARTICLE_TEXT, "FATAL", '#FF0000EE');
        }
    }
    if (action.timer >= 20) {
        action.targetCharacter.x = action.targetStartPosX + random(-9, 9);
        action.targetCharacter.y = action.targetStartPosY + random(-9, 9);
    }

    if (action.timer >= 60) {
        action.sourceCharacter.x = action.sourceStartPosX;
        action.sourceCharacter.y = action.sourceStartPosY;
    }

    if (action.timer >= 80) {
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

/* FIRE MAGIC ATTACK */

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
    action.sourceCharacter.spellcastAnim();
    action.sourceCharacter.applyMagic(-magicActionGetMPCost(action));
    magicishNoise10.play();
}

function fireActionUpdate(action) {
    if (!action.isInit) {
        if (action.sourceCharacter.hpTarget <= 0 || action.targetCharacter.hpTarget <= 0 || action.sourceCharacter.enraged > 0) {
            action.isDone = true;
            return;
        }
        action.isInit = true;
        action.init(action);
    }
    action.timer++;
    if (action.timer == 20) {
        attackishNoise.play();
        var damage = actionApplyDamage(action, magicActionGetPotency(action), action.sourceCharacter.magic);
        action.targetCharacter.hurtAnim();
        var dmgX = action.targetCharacter.x + 30 + random(-16, 16);
        addParticle(dmgX, action.targetCharacter.y, 0, -1.9, 45, PARTICLE_TEXT, damage, '#FFFFFFEE');
        if (action.targetCharacter.hpTarget <= 0) {
            addParticle(dmgX, action.targetCharacter.y + 10, 0, -1.9, 45, PARTICLE_TEXT, "FATAL", '#FFFF00EE');
        }
    }
    if (action.timer >= 20) {
        if ((action.timer % 10) == 0) {
            var power = magicActionGetPotency(action);
            if (power > 1000) {
                magicishNoise7.play();
                addParticle(action.targetCharacter.x + random(-10, 10), action.targetCharacter.y + random(-10, 10), random(-1, 1), random(-3, 1), 80, PARTICLE_LARGE_FIRE, "", '#FFFFFFEE');
                addParticle(action.targetCharacter.x + random(-15, 15), action.targetCharacter.y + random(-15, 15), random(-2, 2), random(-6, 2), 80, PARTICLE_LARGE_FIRE, "", '#FFFFFFEE');
            } else if (power > 300) {
                attackishNoise5.play();
                var xDir = random(-5, 5);
                var yDir = random(-8, 1);
                addParticle(action.targetCharacter.x, action.targetCharacter.y, xDir, yDir, 80, PARTICLE_MEDIUM_FIRE, "", '#FFFFFFEE');
                addParticle(action.targetCharacter.x, action.targetCharacter.y, -xDir, -yDir, 80, PARTICLE_MEDIUM_FIRE, "", '#FFFFFFEE');
            } else {
                attackishNoise3.play();
                addParticle(action.targetCharacter.x, action.targetCharacter.y, random(-5, 5), random(-8, 1), 80, PARTICLE_SMALL_FIRE, "", '#FFFFFFEE');
            }
        }
        action.targetCharacter.x = action.targetStartPosX + random(-9, 9);
        action.targetCharacter.y = action.targetStartPosY + random(-9, 9);
    }

    if (action.timer >= 60) {
        action.sourceCharacter.x = action.sourceStartPosX;
        action.sourceCharacter.y = action.sourceStartPosY;
    }

    if (action.timer >= 80) {
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

/* LIFE MAGIC */

function lifeActionInit(action) {
    action.sourceStartPosX = action.sourceCharacter.x;
    action.sourceStartPosY = action.sourceCharacter.y;
    action.targetStartPosX = action.targetCharacter.x;
    action.targetStartPosY = action.targetCharacter.y;

    if (action.skillIndex == -1) {
        addParticle(width / 2, 20, 0, 0, 80, PARTICLE_SKILL_TEXT, "Attack");
    } else {
        addParticle(width / 2, 20, 0, 0, 80, PARTICLE_SKILL_TEXT, action.sourceCharacter.skills[action.skillIndex].name, '#FFFFFFFF');
    }
    addParticle(action.sourceCharacter.x, action.sourceCharacter.y, 0, 0, 80, PARTICLE_MAGIC, "", '#00FF00FF');
    action.sourceCharacter.spellcastAnim();
    action.sourceCharacter.applyMagic(-magicActionGetMPCost(action));
    magicishNoise10.play();
}

function lifeActionUpdate(action) {
    if (!action.isInit) {
        if (action.sourceCharacter.enraged > 0) { // not error nor bug. It is okay to use Heal magic while you are dying to save yourself from death.
            action.isDone = true;
            return;
        }
        action.isInit = true;
        action.init(action);
    }
    action.timer++;

    if (action.timer >= 20) {
        if ((action.timer % 10) == 0) {
            magicishNoise11.play();
            addParticle(action.targetCharacter.x, action.targetCharacter.y, random(-2, 2), random(-2, 2), 80, PARTICLE_LIFE_SPARKLE, "", '#FFFFFFFF');
        }
    }

    if (action.timer == 100) {
        var life = action.targetCharacter.applyHealing(magicActionGetPotency(action), action.sourceCharacter.magic);
        addParticle(action.targetCharacter.x + 30 + random(-16, 16), action.targetCharacter.y, 0, -1.9, 45, PARTICLE_TEXT, life, '#00FF00FF');
        magicishNoise12.play();
    }

    if (action.timer >= 160) {
        action.finish(action);
    }
}

function lifeActionDraw(action) {

}

function lifeActionFinish(action) {
    action.sourceCharacter.x = action.sourceStartPosX;
    action.sourceCharacter.y = action.sourceStartPosY;
    action.targetCharacter.x = action.targetStartPosX;
    action.targetCharacter.y = action.targetStartPosY;
    action.targetCharacter.defaultAnim();
    action.sourceCharacter.defaultAnim();
    action.isDone = true;
}

/* SCAN MAGIC */

function scanActionInit(action) {
    action.sourceStartPosX = action.sourceCharacter.x;
    action.sourceStartPosY = action.sourceCharacter.y;
    action.targetStartPosX = action.targetCharacter.x;
    action.targetStartPosY = action.targetCharacter.y;

    if (action.skillIndex == -1) {
        addParticle(width / 2, 20, 0, 0, 80, PARTICLE_SKILL_TEXT, "Attack");
    } else {
        addParticle(width / 2, 20, 0, 0, 80, PARTICLE_SKILL_TEXT, action.sourceCharacter.skills[action.skillIndex].name, '#FFFFFFFF');
    }
    addParticle(action.sourceCharacter.x, action.sourceCharacter.y, 0, 0, 80, PARTICLE_MAGIC, "", '#FFFF00FF');
    action.sourceCharacter.spellcastAnim();
    action.sourceCharacter.applyMagic(-magicActionGetMPCost(action));
    magicishNoise10.play();
}

function scanActionUpdate(action) {
    if (!action.isInit) {
        if (action.sourceCharacter.hpTarget <= 0 || action.sourceCharacter.enraged > 0) {
            action.isDone = true;
            return;
        }
        action.isInit = true;
        action.init(action);
    }
    action.timer++;

    if (action.timer >= 20) {
        if ((action.timer % 3) == 0) {
            var xDir = random(-0.5, 0.5);
            var yDir = random(-0.5, 0.5);
            addParticle(action.targetCharacter.x + random(-25, 25), action.targetCharacter.y + random(-25, 25), xDir, yDir, 18, PARTICLE_SCAN, "", '#FFFFFFFF');
            addParticle(action.targetCharacter.x + random(-25, 25), action.targetCharacter.y + random(-25, 25), -xDir, yDir, 18, PARTICLE_SCAN, "", '#FFFFFFFF');
            addParticle(action.targetCharacter.x + random(-25, 25), action.targetCharacter.y + random(-25, 25), xDir, -yDir, 18, PARTICLE_SCAN, "", '#FFFFFFFF');
            addParticle(action.targetCharacter.x + random(-25, 25), action.targetCharacter.y + random(-25, 25), -xDir, -yDir, 18, PARTICLE_SCAN, "", '#FFFFFFFF');
        }
    }

    if (action.timer == 20) {
        scanNoise.play();
    }

    if (action.timer == 70) {
        action.targetCharacter.scanned = true;
    }

    if (action.timer >= 100) {
        action.finish(action);
    }
}

function scanActionDraw(action) {

}

function scanActionFinish(action) {
    action.sourceCharacter.x = action.sourceStartPosX;
    action.sourceCharacter.y = action.sourceStartPosY;
    action.targetCharacter.x = action.targetStartPosX;
    action.targetCharacter.y = action.targetStartPosY;
    action.targetCharacter.defaultAnim();
    action.sourceCharacter.defaultAnim();
    action.isDone = true;
}

/* POWER CHARGE */

function chargeActionInit(action) {
    action.sourceStartPosX = action.sourceCharacter.x;
    action.sourceStartPosY = action.sourceCharacter.y;
    action.targetStartPosX = action.targetCharacter.x;
    action.targetStartPosY = action.targetCharacter.y;

    if (action.skillIndex == -1) {
        addParticle(width / 2, 20, 0, 0, 80, PARTICLE_SKILL_TEXT, "Attack");
    } else {
        addParticle(width / 2, 20, 0, 0, 80, PARTICLE_SKILL_TEXT, action.sourceCharacter.skills[action.skillIndex].name, '#FFFFFFFF');
    }
    addParticle(action.sourceCharacter.x, action.sourceCharacter.y, 0, 0, 130, PARTICLE_MAGIC, "", '#FF00FFFF');
    action.sourceCharacter.spellcastAnim();
    action.sourceCharacter.applyMagic(-magicActionGetMPCost(action));
    magicishNoise5.play();
}

function chargeActionUpdate(action) {
    if (!action.isInit) {
        if (action.sourceCharacter.hpTarget <= 0 || action.targetCharacter.hpTarget <= 0 || action.sourceCharacter.enraged > 0) {
            action.isDone = true;
            return;
        }
        action.isInit = true;
        action.init(action);
    }
    action.timer++;

    if (action.timer >= 20) {
        if ((action.timer % 5) == 0) {
            magicishNoise11.play();
            addParticle(action.targetCharacter.x + random(-30, 30), action.targetCharacter.y + random(-15, 55), 0, random(-4, -2), 20, PARTICLE_CHARGE, "", '#FFFFFFFF');
        }
    }

    if (action.timer == 100) {
        action.targetCharacter.powerCharge = true;
        addParticle(action.targetCharacter.x + 30 + random(-16, 16), action.targetCharacter.y, 0, -1.9, 45, PARTICLE_TEXT, "UP!", '#FF00FFFF');
        magicishNoise12.play();
    }

    if (action.timer >= 160) {
        action.finish(action);
    }
}

function chargeActionDraw(action) {

}

function chargeActionFinish(action) {
    action.sourceCharacter.x = action.sourceStartPosX;
    action.sourceCharacter.y = action.sourceStartPosY;
    action.targetCharacter.x = action.targetStartPosX;
    action.targetCharacter.y = action.targetStartPosY;
    action.targetCharacter.defaultAnim();
    action.sourceCharacter.defaultAnim();
    action.isDone = true;
}

/* ENRAGE */

function enrageActionInit(action) {
    action.sourceStartPosX = action.sourceCharacter.x;
    action.sourceStartPosY = action.sourceCharacter.y;
    action.targetStartPosX = action.targetCharacter.x;
    action.targetStartPosY = action.targetCharacter.y;

    if (action.skillIndex == -1) {
        addParticle(width / 2, 20, 0, 0, 80, PARTICLE_SKILL_TEXT, "Attack");
    } else {
        addParticle(width / 2, 20, 0, 0, 80, PARTICLE_SKILL_TEXT, action.sourceCharacter.skills[action.skillIndex].name, '#FFFFFFFF');
    }
    addParticle(action.sourceCharacter.x, action.sourceCharacter.y, 0, 0, 130, PARTICLE_MAGIC, "", '#FF0000FF');
    action.sourceCharacter.spellcastAnim();
    action.sourceCharacter.applyMagic(-magicActionGetMPCost(action));
    magicishNoise3.play();
}

function enrageActionUpdate(action) {
    if (!action.isInit) {
        if (action.sourceCharacter.hpTarget <= 0 || action.targetCharacter.hpTarget <= 0 || action.sourceCharacter.enraged > 0) {
            action.isDone = true;
            return;
        }
        action.isInit = true;
        action.init(action);
    }
    action.timer++;

    if (action.timer >= 20) {
        if ((action.timer % 5) == 0) {
            magicishNoise11.play();
            addParticle(action.targetCharacter.x + random(-30, 30), action.targetCharacter.y + random(-15, 55), 0, random(-4, -2), 20, PARTICLE_RAGE, "", '#FFFFFFFF');
        }
    }

    if (action.timer == 20) {
        action.targetCharacter.hurtAnim();
    }

    if (action.timer == 100) {
        action.targetCharacter.enraged = magicActionGetPotency(action);
        addParticle(action.targetCharacter.x + 30 + random(-16, 16), action.targetCharacter.y, 0, -1.9, 45, PARTICLE_TEXT, "ENRAGED!", '#FF0000FF');
        magicishNoise4.play();
        action.targetCharacter.defaultAnim();
    }

    if (action.timer >= 160) {
        action.finish(action);
    }
}

function enrageActionDraw(action) {

}

function enrageActionFinish(action) {
    action.sourceCharacter.x = action.sourceStartPosX;
    action.sourceCharacter.y = action.sourceStartPosY;
    action.targetCharacter.x = action.targetStartPosX;
    action.targetCharacter.y = action.targetStartPosY;
    if (action.targetCharacter.characterGfx != -1 && action.targetCharacter.animation.anim != 0) {
        action.targetCharacter.defaultAnim();
    }
    action.sourceCharacter.defaultAnim();
    action.isDone = true;
}

/* REGEN MAGIC */

function regenActionInit(action) {
    action.sourceStartPosX = action.sourceCharacter.x;
    action.sourceStartPosY = action.sourceCharacter.y;
    action.targetStartPosX = action.targetCharacter.x;
    action.targetStartPosY = action.targetCharacter.y;

    if (action.skillIndex == -1) {
        addParticle(width / 2, 20, 0, 0, 80, PARTICLE_SKILL_TEXT, "Attack");
    } else {
        addParticle(width / 2, 20, 0, 0, 80, PARTICLE_SKILL_TEXT, action.sourceCharacter.skills[action.skillIndex].name, '#FFFFFFFF');
    }
    addParticle(action.sourceCharacter.x, action.sourceCharacter.y, 0, 0, 80, PARTICLE_MAGIC, "", '#00FF00FF');
    action.sourceCharacter.spellcastAnim();
    action.sourceCharacter.applyMagic(-magicActionGetMPCost(action));
    magicishNoise10.play();
}

function regenActionUpdate(action) {
    if (!action.isInit) {
        if (action.sourceCharacter.hpTarget <= 0 || action.targetCharacter.hpTarget <= 0 || action.sourceCharacter.enraged > 0) {
            action.isDone = true;
            return;
        }
        action.isInit = true;
        action.init(action);
    }
    action.timer++;

    if (action.timer == 40) {
        action.targetCharacter.regenAmount = (magicActionGetPotency(action));
        action.targetCharacter.regen = 8;

        addParticle(action.targetCharacter.x + 30 + random(-16, 16), action.targetCharacter.y, 0, -1.9, 45, PARTICLE_TEXT, "REGEN!", '#00FF00FF');
        magicishNoise11.play();
        addParticle(action.targetCharacter.x, action.targetCharacter.y, random(-2, 2), random(-2, 2), 80, PARTICLE_LIFE_SPARKLE, "", '#FFFFFFFF');
        magicishNoise12.play();
    }

    if (action.timer >= 80) {
        action.finish(action);
    }
}

function regenActionDraw(action) {

}

function regenActionFinish(action) {
    action.sourceCharacter.x = action.sourceStartPosX;
    action.sourceCharacter.y = action.sourceStartPosY;
    action.targetCharacter.x = action.targetStartPosX;
    action.targetCharacter.y = action.targetStartPosY;
    action.targetCharacter.defaultAnim();
    action.sourceCharacter.defaultAnim();
    action.isDone = true;
}

/* MP DRAIN MAGIC */

function mpDrainActionInit(action) {
    action.sourceStartPosX = action.sourceCharacter.x;
    action.sourceStartPosY = action.sourceCharacter.y;
    action.targetStartPosX = action.targetCharacter.x;
    action.targetStartPosY = action.targetCharacter.y;

    if (action.skillIndex == -1) {
        addParticle(width / 2, 20, 0, 0, 80, PARTICLE_SKILL_TEXT, "Attack");
    } else {
        addParticle(width / 2, 20, 0, 0, 80, PARTICLE_SKILL_TEXT, action.sourceCharacter.skills[action.skillIndex].name, '#FFFFFFFF');
    }
    addParticle(action.sourceCharacter.x, action.sourceCharacter.y, 0, 0, 80, PARTICLE_MAGIC, "", '#FF00FFFF');
    action.sourceCharacter.spellcastAnim();
    action.sourceCharacter.applyMagic(-magicActionGetMPCost(action));
    magicishNoise10.play();
}

function mpDrainActionUpdate(action) {
    if (!action.isInit) {
        if (action.sourceCharacter.hpTarget <= 0 || action.targetCharacter.hpTarget <= 0 || action.sourceCharacter.enraged > 0) {
            action.isDone = true;
            return;
        }
        action.isInit = true;
        action.init(action);
    }
    action.timer++;

    if (action.timer == 20) {
        magicishNoise9.play();
    }

    if ((action.timer >= 20 && action.timer <= 30) || (action.timer >= 60 && action.timer <= 70)) {
        if ((action.timer % 5) == 0) {
            addParticle(action.targetCharacter.x, action.targetCharacter.y, action.sourceCharacter.x + random(-30, 30), action.sourceCharacter.y + random(-30, 30), 80, PARTICLE_MPDRAIN, "", '#FFFFFFFF');
        }
    }

    if (action.timer == 20 || action.timer == 60) {
        action.targetCharacter.hurtAnim();
    }

    if (action.timer == 100) {
        var magicGain = constrain(magicActionGetPotency(action), 0, action.targetCharacter.mp);

        action.sourceCharacter.applyMagic(magicGain);
        action.targetCharacter.applyMagic(-magicGain);
        addParticle(action.sourceCharacter.x + 30 + random(-16, 16), action.sourceCharacter.y, 0, -1.9, 45, PARTICLE_TEXT, magicGain, '#FF00FFFF');
        addParticle(action.targetCharacter.x + 30 + random(-16, 16), action.targetCharacter.y, 0, 1.9, 45, PARTICLE_TEXT, "-" + magicGain, '#FF00FFFF');
        magicishNoise12.play();
    }

    if (action.timer >= 160) {
        action.finish(action);
    }
}

function mpDrainActionDraw(action) {

}

function mpDrainActionFinish(action) {
    action.sourceCharacter.x = action.sourceStartPosX;
    action.sourceCharacter.y = action.sourceStartPosY;
    action.targetCharacter.x = action.targetStartPosX;
    action.targetCharacter.y = action.targetStartPosY;
    action.targetCharacter.defaultAnim();
    action.sourceCharacter.defaultAnim();
    action.isDone = true;
}

/* REFLECT MAGIC */

function reflectActionInit(action) {
    var isPhysReflect = (magicActionGetPotency(action) == 1);

    action.sourceStartPosX = action.sourceCharacter.x;
    action.sourceStartPosY = action.sourceCharacter.y;
    action.targetStartPosX = action.targetCharacter.x;
    action.targetStartPosY = action.targetCharacter.y;

    if (action.skillIndex == -1) {
        addParticle(width / 2, 20, 0, 0, 80, PARTICLE_SKILL_TEXT, "Attack");
    } else {
        addParticle(width / 2, 20, 0, 0, 80, PARTICLE_SKILL_TEXT, action.sourceCharacter.skills[action.skillIndex].name, '#FFFFFFFF');
    }

    if (isPhysReflect) {
        addParticle(action.sourceCharacter.x, action.sourceCharacter.y, 0, 0, 80, PARTICLE_MAGIC, "", '#00FF00FF');
    } else {
        addParticle(action.sourceCharacter.x, action.sourceCharacter.y, 0, 0, 80, PARTICLE_MAGIC, "", '#FF00FFFF');
    }
    action.sourceCharacter.spellcastAnim();
    action.sourceCharacter.applyMagic(-magicActionGetMPCost(action));
    magicishNoise10.play();
}

function reflectActionUpdate(action) {
    var isPhysReflect = (magicActionGetPotency(action) == 1);
    if (!action.isInit) {
        if (action.sourceCharacter.hpTarget <= 0 || action.targetCharacter.hpTarget <= 0 || action.sourceCharacter.enraged > 0) {
            action.isDone = true;
            return;
        }
        action.isInit = true;
        action.init(action);
    }
    action.timer++;

    if (action.timer >= 20) {
        if ((action.timer % 3) == 0) {
            var xDir = random(-0.5, 0.5);
            var yDir = random(-0.5, 0.5);
            var color = ((isPhysReflect) ? '#00FF00' : '#FF00FF');
            addParticle(action.targetCharacter.x + random(-25, 25), action.targetCharacter.y + random(-25, 25), xDir, yDir, 18, PARTICLE_REFLECT, "", color);
            addParticle(action.targetCharacter.x + random(-25, 25), action.targetCharacter.y + random(-25, 25), -xDir, yDir, 18, PARTICLE_REFLECT, "", color);
            addParticle(action.targetCharacter.x + random(-25, 25), action.targetCharacter.y + random(-25, 25), xDir, -yDir, 18, PARTICLE_REFLECT, "", color);
            addParticle(action.targetCharacter.x + random(-25, 25), action.targetCharacter.y + random(-25, 25), -xDir, -yDir, 18, PARTICLE_REFLECT, "", color);
        }
    }

    if (action.timer == 20) {
        magicishNoise8.play();
    }

    if (action.timer == 70) {
        if (isPhysReflect) {
            addParticle(action.targetCharacter.x + 30 + random(-16, 16), action.targetCharacter.y, 0, -1.9, 45, PARTICLE_TEXT, "REFLECT!", '#00FF00FF');
            action.targetCharacter.protect = true;
        } else {
            addParticle(action.targetCharacter.x + 30 + random(-16, 16), action.targetCharacter.y, 0, -1.9, 45, PARTICLE_TEXT, "REFLECT!", '#FF00FFFF');
            action.targetCharacter.reflect = true;
        }
        magicishNoise12.play();
        action.targetCharacter.scanned = true;
    }

    if (action.timer >= 100) {
        action.finish(action);
    }
}

function reflectActionDraw(action) {

}

function reflectActionFinish(action) {
    action.sourceCharacter.x = action.sourceStartPosX;
    action.sourceCharacter.y = action.sourceStartPosY;
    action.targetCharacter.x = action.targetStartPosX;
    action.targetCharacter.y = action.targetStartPosY;
    action.targetCharacter.defaultAnim();
    action.sourceCharacter.defaultAnim();
    action.isDone = true;
}

/* SPEED MAGIC */

function speedActionInit(action) {
    action.sourceStartPosX = action.sourceCharacter.x;
    action.sourceStartPosY = action.sourceCharacter.y;
    action.targetStartPosX = action.targetCharacter.x;
    action.targetStartPosY = action.targetCharacter.y;

    if (action.skillIndex == -1) {
        addParticle(width / 2, 20, 0, 0, 80, PARTICLE_SKILL_TEXT, "Attack");
    } else {
        addParticle(width / 2, 20, 0, 0, 80, PARTICLE_SKILL_TEXT, action.sourceCharacter.skills[action.skillIndex].name, '#FFFFFFFF');
    }
    addParticle(action.sourceCharacter.x, action.sourceCharacter.y, 0, 0, 80, PARTICLE_MAGIC, "", '#FFFF00FF');
    action.sourceCharacter.spellcastAnim();
    action.sourceCharacter.applyMagic(-magicActionGetMPCost(action));
    magicishNoise10.play();
}

function speedActionUpdate(action) {
    var isFast = (magicActionGetPotency(action) > 1.0) ? true : false;
    if (!action.isInit) {
        if (action.sourceCharacter.hpTarget <= 0 || action.targetCharacter.hpTarget <= 0 || action.sourceCharacter.enraged > 0) {
            action.isDone = true;
            return;
        }
        action.isInit = true;
        action.init(action);
    }
    action.timer++;

    if (action.timer >= 20) {
        if ((action.timer % 3) == 0) {
            if (isFast) {
                var xDir = random(-2.3, 2.3);
                var yDir = random(-2.3, 2.3);
            } else {
                var xDir = random(-0.2, 0.2);
                var yDir = random(-0.2, 0.2);
            }
            addParticle(action.targetCharacter.x + random(-25, 25), action.targetCharacter.y + random(-25, 25), xDir, yDir, 18, PARTICLE_TIME_SLOW, "", '#FFFFFFFF');
            addParticle(action.targetCharacter.x + random(-25, 25), action.targetCharacter.y + random(-25, 25), -xDir, yDir, 18, PARTICLE_TIME_SLOW, "", '#FFFFFFFF');
            addParticle(action.targetCharacter.x + random(-25, 25), action.targetCharacter.y + random(-25, 25), xDir, -yDir, 18, PARTICLE_TIME_SLOW, "", '#FFFFFFFF');
            addParticle(action.targetCharacter.x + random(-25, 25), action.targetCharacter.y + random(-25, 25), -xDir, -yDir, 18, PARTICLE_TIME_SLOW, "", '#FFFFFFFF');
        }
    }

    if (action.timer == 20) {
        if (!isFast) {
            action.targetCharacter.hurtAnim();
        }
    }

    if (action.timer == 70) {
        action.targetCharacter.speedTurns = 3;
        action.targetCharacter.speedAmount = magicActionGetPotency(action);
        if (isFast) {
            magicishNoise2.play();
            addParticle(action.targetCharacter.x + 30 + random(-16, 16), action.targetCharacter.y, 0, -1.9, 45, PARTICLE_TEXT, "HASTE", '#00FF00FF');
        } else {
            magicishNoise.play();
            addParticle(action.targetCharacter.x + 30 + random(-16, 16), action.targetCharacter.y, 0, 1.9, 45, PARTICLE_TEXT, "SLOW", '#FFFFFFFF');
        }
    }

    if (action.timer >= 100) {
        action.finish(action);
    }
}

function speedActionDraw(action) {

}

function speedActionFinish(action) {
    action.sourceCharacter.x = action.sourceStartPosX;
    action.sourceCharacter.y = action.sourceStartPosY;
    action.targetCharacter.x = action.targetStartPosX;
    action.targetCharacter.y = action.targetStartPosY;
    action.targetCharacter.defaultAnim();
    action.sourceCharacter.defaultAnim();
    action.isDone = true;
}

/* DOOM MAGIC */

function doomActionInit(action) {
    action.sourceStartPosX = action.sourceCharacter.x;
    action.sourceStartPosY = action.sourceCharacter.y;
    action.targetStartPosX = action.targetCharacter.x;
    action.targetStartPosY = action.targetCharacter.y;

    if (action.skillIndex == -1) {
        addParticle(width / 2, 20, 0, 0, 80, PARTICLE_SKILL_TEXT, "Attack");
    } else {
        addParticle(width / 2, 20, 0, 0, 80, PARTICLE_SKILL_TEXT, action.sourceCharacter.skills[action.skillIndex].name, '#FFFFFFFF');
    }
    addParticle(action.sourceCharacter.x, action.sourceCharacter.y, 0, 0, 280, PARTICLE_MAGIC, "", '#FFFFFFFF');
    action.sourceCharacter.spellcastAnim();
    action.sourceCharacter.applyMagic(-magicActionGetMPCost(action));
    magicishNoise10.play();
}

function doomActionUpdate(action) {
    if (!action.isInit) {
        if (action.sourceCharacter.hpTarget <= 0 || action.targetCharacter.hpTarget <= 0 || action.sourceCharacter.enraged > 0) {
            action.isDone = true;
            return;
        }
        action.isInit = true;
        action.init(action);
    }
    action.timer++;

    if (action.timer >= 20) {
        var doomQuake = ((action.timer - 20) / 3);
        action.targetCharacter.x = action.targetStartPosX + random(-doomQuake, doomQuake);
        action.targetCharacter.y = action.targetStartPosY + random(-doomQuake, doomQuake);
    }

    if (action.timer == 20) {
        action.targetCharacter.hurtAnim();
        horribleNoise.play();
    }

    if (action.timer >= 300) {
        action.targetCharacter.hpTarget = 1;
        action.targetCharacter.mpTarget = 1;
        action.finish(action);
    }
}

function doomActionDraw(action) {

}

function doomActionFinish(action) {
    action.sourceCharacter.x = action.sourceStartPosX;
    action.sourceCharacter.y = action.sourceStartPosY;
    action.targetCharacter.x = action.targetStartPosX;
    action.targetCharacter.y = action.targetStartPosY;
    action.targetCharacter.defaultAnim();
    action.sourceCharacter.defaultAnim();
    action.isDone = true;
}
