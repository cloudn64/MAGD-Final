const ATB_MAX = 400;

const sPlayerSkillList = [
    0,
    1,
    0,
]

class Character {
    constructor(isPlayer, ID, name, maxHP, maxMP, str, def, spd, mag) { // ID should be assigned by the battle engine
        this.isPlayer = isPlayer;
        this.name = name;
        this.ID = ID;
        this.isReadyToAct = false; // ready to perform a chosen action
        this.isActing = false; // is performing an action
        this.nextSkill = 0; // index of the next skill to use

        // placeholder stuff
        this.maxHP = maxHP;
        this.maxMP = maxMP;
        this.x = 0;
        this.y = 0;

        // stats
        this.hp = this.maxHP;
        this.mp = this.maxMP;
        this.strength = str; // Attack power
        this.defense = def; // Defense
        this.speed = spd; // amount to subtract the max ATB by. Used to be a multiplier until I found out how totally OP it is that a speed of 2 is twice as fast as a speed of 1
        this.magic = mag; // Magic power

        this.skills = skillListToSkills(sPlayerSkillList); // Skill array, I think. Kind of wild system, but wild is how we like it.

        this.skillMenu = null;
        if (this.isPlayer) {
            this.skillMenu = new SkillMenu(this, this.skills, 210, height - 159, width - 211, 158, 20, 12);
        }

        this.dead = false;

        this.atbTimer = 0;
    }

    drawSkillMenu() {
        if (this.skillMenu != null) {
            this.skillMenu.draw();
        }
    }

    update(atbIsPaused) {
        if (this.dead) {
            this.atbTimer = 0;
            this.isActing = false;
            this.isReadyToAct = false;
        }

        if (!atbIsPaused && !this.isActing) { // update ATB if not doing an attack and the global ATB pause flag is not set
            this.atbTimer = constrain(this.atbTimer + 1, 0, ATB_MAX - this.speed);
        }

        if (this.atbTimer >= (ATB_MAX - this.speed)) { // you can attack now (unless the global ATB is paused)
            this.isReadyToAct = true;
        }

        if (this.isActing) { // update the current action, it has already started
            // update the action (this.nextSkill)
        } else if (this.isReadyToAct && !atbIsPaused) { // begin the chosen action if atb is not paused
            //this.isReadyToAct = false;
            //this.isActing = true;
            //this.atbTimer = 0;
            // this.nextSkill
        }

    }

    debugString(x, y) {
        text("character" + this.ID + ":\nReady: " + this.isReadyToAct + "\nActing: " + this.isActing + "\nHP: " + this.hp + "/" + this.maxHP + "\nMP: " + this.mp + "/" + this.maxMP + "\nSTR: " + this.strength + "\nDEF: " + this.defense + "\nSPD:" + this.speed + "\ntime: " + this.atbTimer, x, y);
    }

    applyHealth(amount) {
        this.hp += amount;

        if (this.hp < 0) { // you die
            this.hp = 0;
            this.dead = true; 
        } else if (this.hp > this.maxHP) { // you live really hard
            this.hp = this.maxHP;
        }
    }

    applyMagic(amount) {
        this.mp += amount;

       // other stuff 
    }
}

