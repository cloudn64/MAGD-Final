
const sBattleActionFuncs = [ 
    { init: testActionInit, update: testActionUpdate, draw: testActionDraw, finish: testActionFinish }, // Test battle action
 ];

class BattleAction {
    constructor(actionID, sourceCharacter, targetCharacter) {
        // action stuff
        this.actionID = actionID;
        this.isDone = false;
        this.isInit = false;
        this.timer = 0;

        // character stuff
        this.sourceCharacter = sourceCharacter;
        this.sourceStartPosX = sourceCharacter.x;
        this.sourceStartPosY = sourceCharacter.y;
        this.targetCharacter = targetCharacter;
        this.targetStartPosX = targetCharacter.x;
        this.targetStartPosY = targetCharacter.y;

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

function testActionInit(action) {
    action.sourceCharacter.animation.changeAnim(1, 6, 0.12, false);
    //this.sourceCharacter.applyDamage(100, 12450);
}

function testActionUpdate(action) {
    if (!action.isInit) {
        action.isInit = true;
        action.init(action);
    }
    action.timer++;
    if (action.timer == 20) {
        action.targetCharacter.animation.changeAnim(2, 1, 0.32, true);
    }
    if (action.timer >= 120 && action.targetCharacter.animation != 2) {
        action.finish(action);
    }
}

function testActionDraw(action) {

}

function testActionFinish(action) {
    action.targetCharacter.defaultAnim();
    action.sourceCharacter.defaultAnim();
    action.isDone = true;
}