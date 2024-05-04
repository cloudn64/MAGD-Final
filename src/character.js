const ATB_MAX = 400;
const DRAIN_SPEED = 10;

const sPlayerSkillList = [
    0,
    1,
    2,
]

class Character {
    constructor(isPlayer, ID, name, x, y, maxHP, maxMP, str, def, spd, mag) { // ID should be assigned by the battle engine
        this.isPlayer = isPlayer;
        this.name = name;
        this.ID = ID;
        this.isReadyToAct = false; // ready to perform a chosen action - UNUSED
        this.isActing = false; // is performing an action - UNUSED
        this.nextSkill = 0; // index of the next skill to use - UNUSED

        // Max HP/MP
        this.maxHP = maxHP;
        this.maxMP = maxMP;

        // Stats
        this.hp = this.maxHP;
        this.mp = this.maxMP;
        this.strength = str; // Attack power
        this.defense = def; // Defense
        this.speed = spd; // amount to subtract the max ATB by. Used to be a speed multiplier until I found out how totally OP it is that a speed of 2 is twice as fast as a speed of 1
        this.magic = mag; // Magic power

        // Skill pointer array created from skill list, points to skills inside global skill array
        this.skills = skillListToSkills(sPlayerSkillList); // Kind of wild system, but wild is how we like it. Finished on time is even more how we like it.

        // Menu for this character's skills (not created for enemies because they aren't controlled in the UI)
        // Having each player own a menu for this instead of one global menu reading data from the player is admittedly very strange
        // However, this is what I did first, and it works.
        this.skillMenu = null;
        if (this.isPlayer) {
            this.skillMenu = new SkillMenu(this, this.skills, 210, height - 159, width - 211, 158, 17, 8);
        }

        // Flags
        this.dead = false;
        this.defending = false;
        this.scanned = this.isPlayer; // shows this character's stats in menus. If false, only their name will appear.
        this.scanned = true; // TEMP

        // ATB Timer
        this.atbTimer = 0;

        // HP/MP Target- steps towards these so that when you lose something, the bar goes down instead of snapping to the new number.
        this.hpTarget = this.hp;
        this.mpTarget = this.mp;

        // gfx
        this.characterGfx = 0;
        this.animation = new SpriteAnimation("assets/characters/char" + this.characterGfx + "/", 0);
        this.x = x;
        this.y = y;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;

        // setup (no init function yet, later character IDs might have their own init functions.)
        this.defaultAnim();
    }

    defaultAnim() {
        if (!this.dead) {
            this.animation.changeAnim(0, 6, 0.02, true);
        }
    }

    defendAnim() {
        if (!this.dead) {
            this.animation.changeAnim(5, 0, 0.0, false);
        }
    }

    drawSkillMenu() {
        if (this.skillMenu != null) {
            this.skillMenu.draw();
        }
    }

    // for the enemies
    pickRandomSkill() {
        this.atbTimer = 0;
        var target = getRandomTarget(true, false);
        if (target != null) {
            activateSkill(this, getRandomTarget(true, false), -1);
        }
    }

    update(atbIsPaused) {
        var atbIsFull = this.atbTimer >= (ATB_MAX - this.speed);
        if (this.dead) {
            this.animation.changeAnim(3, 0, 0.0, false);
            this.atbTimer = 0;
            this.isActing = false;
            this.isReadyToAct = false;
            return;
        }

        if (this.hp <= 0) {
            this.hp = 0;
            this.dead = true;
            return;
        }

        // approach HP target
        if (this.hpTarget > this.hp) { // get more HP
            this.hp = constrain(this.hp + DRAIN_SPEED, this.hp, this.hpTarget);
        } else if (this.hpTarget < this.hp) { // lose HP
            this.hp = constrain(this.hp - DRAIN_SPEED, this.hpTarget, this.hp);
        }

        // approach MP target
        if (this.mpTarget > this.mp) { // get more MP
            this.mp = constrain(this.mp + DRAIN_SPEED, this.mp, this.mpTarget);
        } else if (this.mpTarget < this.mp) { // lose MP
            this.mp = constrain(this.mp - DRAIN_SPEED, this.mpTarget, this.mp);
        }

        if (!atbIsPaused/* && !this.isActing*/) { // update ATB if not doing an attack and the global ATB pause flag is not set
            this.atbTimer = constrain(this.atbTimer + 1, 0, ATB_MAX - this.speed);
        }

        if (!atbIsFull && this.defending && !this.dead) {
            this.defendAnim();
        } else if ((this.defending && atbIsFull) || this.dead) {
            this.defending = false;
            this.defaultAnim();
        }

        if (!this.isPlayer && atbIsFull) {
            this.pickRandomSkill();
        }

        // Unused attacking logic prior to genius invention of Battle Action
        //if (this.isActing) { // update the current action, it has already started
            // update the action (this.nextSkill)
        //} else if (this.isReadyToAct && !atbIsPaused) { // begin the chosen action if atb is not paused
            //this.isReadyToAct = false;
            //this.isActing = true;
            //this.atbTimer = 0;
            // this.nextSkill
        //}

    }

    draw() {
        this.animation.draw(this.x, this.y, this.scaleX * ((!this.isPlayer) ? -1 : 1), this.scaleY, this.rotation);
    }

    debugString(x, y) {
        text("character" + this.ID + ":\nReady: " + this.isReadyToAct + "\nActing: " + this.isActing + "\nHP: " + this.hp + "/" + this.maxHP + "\nMP: " + this.mp + "/" + this.maxMP + "\nSTR: " + this.strength + "\nDEF: " + this.defense + "\nSPD:" + this.speed + "\ntime: " + this.atbTimer, x, y);
    }

    applyDamage(amount, strength) {
        var powerBonus = random(0.8, 1.2) + (strength / 50);
        var defenseNullifier = (random(1.0, 1.2) + (this.defense / 50));
        var attackDamage = (int)(constrain(((amount * powerBonus) / defenseNullifier), 1, 9999));

        if (this.defending) attackDamage = (int)(attackDamage / 2); // cut damage in half if defending

        this.hpTarget = constrain(this.hpTarget - attackDamage, 0, this.maxHP);
        return attackDamage;
    }

    applyMagic(amount) {
        this.mpTarget = constrain(this.mpTarget + (int)(amount), 0, this.maxMP);

       // other stuff 
    }
}

