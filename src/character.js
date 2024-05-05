const ATB_MAX = 400;
const DRAIN_SPEED = 10;

const sPlayerSkillList = [
    FIREI_SKILL,
    FIREII_SKILL,
    FIREIII_SKILL,
    LIFEI_SKILL,
    LIFEII_SKILL,
    SCAN_SKILL,
    HEALI_SKILL,
    HEALII_SKILL,
    HEALIII_SKILL,
    CHARGE_SKILL,
    ENRAGEI_SKILL,
    ENRAGEII_SKILL,
    REGENI_SKILL,
    REGENII_SKILL,
    MPDRAINI_SKILL,
    MPDRAINII_SKILL,
];

class Character {
    constructor(isPlayer, ID, name, x, y, maxHP, maxMP, str, def, spd, mag, skillList) { // ID should be assigned by the battle engine
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
        this.skills = skillListToSkills(skillList); // Kind of wild system, but wild is how we like it. Finished on time is even more how we like it.

        // Menu for this character's skills (not created for enemies because they aren't controlled in the UI)
        // Having each player own a menu for this instead of one global menu reading data from the player is admittedly very strange
        // However, this is what I did first, and it works.
        this.skillMenu = null;
        if (this.isPlayer) {
            this.skillMenu = new SkillMenu(this, this.skills, 210, height - 159, width - 211, 158, 11, 8);
        }

        // Flags
        this.dead = false;
        this.defending = false;
        this.scanned = this.isPlayer; // shows this character's stats in menus. If false, only their name will appear.

        // ATB Timer
        this.atbTimer = 0;

        // HP/MP Target- steps towards these so that when you lose something, the bar goes down instead of snapping to the new number.
        this.hpTarget = this.hp;
        this.mpTarget = this.mp;

        this.turnFlag = false; // flag for things that occur once per turn (when the ATB is full)

        // Effects
        this.powerCharge = false;
        this.enraged = 0;
        this.regen = 0;
        this.regenAmount = 0;
        this.poison = 0;
        this.poisonAmount = 0;

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

    attackRandomTarget() {
        var attackTarget = getRandomTarget(!this.isPlayer, this.isPlayer, false);
        if (attackTarget != null) {
            activateSkill(this, attackTarget, -1);
        }
    }

    checkForSpell(id) {
        for (var s = 0; s < this.skills.length; s++) {
            var thisSkill = this.skills[s];
            if (thisSkill != null && thisSkill.skillId == id) {
                return s;
            }
        }
        return -1;
    }

    castIfAvailable(id) {
        // check if I know an MP Drain spell
        var foundSpell = this.checkForSpell(id);
        if (foundSpell != -1 && (this.skills[foundSpell].mpCost <= this.mp)) {
            var magicTarget = ((!this.isPlayer) 
                    ? getRandomTarget(!this.skills[foundSpell].targetAllies, this.skills[foundSpell].targetAllies, this.skills[foundSpell].targetDead) 
                    : getRandomTarget(this.skills[foundSpell].targetAllies, !this.skills[foundSpell].targetAllies, this.skills[foundSpell].targetDead));

            activateSkill(this, magicTarget, foundSpell);
            return true;
        }
        return false;
    }

    // for the enemies
    pickRandomSkill() {
        this.atbTimer = 0;

        if (this.enraged != 0) {
            this.attackRandomTarget();
        // If I'm low on HP, try to heal. If I don't have enough MP, try to get more.
        } else if ((this.hp < (this.maxHP / 10)) && (this.castIfAvailable(HEALIII_SKILL) || this.castIfAvailable(HEALII_SKILL) || this.castIfAvailable(HEALI_SKILL) || this.castIfAvailable(MPDRAINII_SKILL) || this.castIfAvailable(MPDRAINI_SKILL))) {
            return;
        } else if (random(0, 15) >= 13) { // low chance to defend (unless enraged)
            activateDefend(this);
        } else if (random(0, 8) >= 6) { // slightly greater chance to attack
            this.attackRandomTarget();
        } else { // magic
            var randomSkill = (int)(random(0, this.skills.length));

            print("I want skill " + randomSkill + " out of my " + this.skills.length + " skills!");
            print("That's skill " + this.skills[randomSkill].name);
            if (randomSkill >= this.skills.length || this.skills[randomSkill].mpCost > this.mp) { // bad skill or unaffordable skill
                // attack if I can't steal MP
                if (!this.castIfAvailable(MPDRAINII_SKILL) && !this.castIfAvailable(MPDRAINI_SKILL)) {
                    this.attackRandomTarget();
                }
                print("but it's too expensive!");
            } else {
                var magicTarget = ((!this.isPlayer) 
                    ? getRandomTarget(!this.skills[randomSkill].targetAllies, this.skills[randomSkill].targetAllies, this.skills[randomSkill].targetDead) 
                    : getRandomTarget(this.skills[randomSkill].targetAllies, !this.skills[randomSkill].targetAllies, this.skills[randomSkill].targetDead));
                
                if (magicTarget != null) {
                    activateSkill(this, magicTarget, randomSkill);
                    print("here we go!");
                } else {
                    print("no suitable target for my spell...?");
                    this.attackRandomTarget();
                }
            }
        }
    }

    update(atbIsPaused) {
        var atbIsFull = this.atbTimer >= (ATB_MAX - this.speed);

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

        // Being dead
        if (this.dead) {
            this.powerCharge = false;
            this.enraged = 0;
            this.regen = 0;
            this.regenAmount = 0;
            this.poison = 0;
            this.poisonAmount = 0;
            if (this.hp != 0) {
                this.dead = false;
                this.defaultAnim();
            } else {
                this.animation.changeAnim(3, 0, 0.0, false);
                this.atbTimer = 0;
                this.isActing = false;
                this.isReadyToAct = false;
                return;
            }
        }

        // About to be dead
        if (this.hp <= 0) {
            this.hp = 0;
            this.regenAmount = 0;
            this.dead = true;
            return;
        }

        if (!atbIsPaused/* && !this.isActing*/) { // update ATB if not doing an attack and the global ATB pause flag is not set
            this.atbTimer = constrain(this.atbTimer + 1, 0, ATB_MAX - this.speed);
        }

        // per turn things
        if (atbIsFull && !this.turnFlag) {
            this.turnFlag = true;
            if (this.poison > 0) {
                var curPoisonAmount = this.applyUnblockableDamage(this.poisonAmount, 1);
                this.poison--;
                addParticle(this.x + 20 + random(-7, 7), this.y - 30, 0, 1.9, 45, PARTICLE_TEXT, "-" + curPoisonAmount, '#0E660EFF');
            }
            if (this.regen > 0) {
                var curRegenAmount = this.applyHealing(this.regenAmount, 1);
                this.regen--;
                magicishNoise11.play();
                for (var p = 0; p < random(2, 5); p++) {
                    addParticle(this.x, this.y, random(-2, 2), random(-2, 2), 80, PARTICLE_LIFE_SPARKLE, "", '#FFFFFFFF');
                }
                addParticle(this.x + 20 + random(-7, 7), this.y - 30, 0, -1.9, 45, PARTICLE_TEXT, curRegenAmount, '#00FF00FF');
            }

        } else if (!atbIsFull) {
            this.turnFlag = false;
        }

        if (!atbIsFull && this.defending && !this.dead) {
            this.defendAnim();
        } else if ((this.defending && atbIsFull) || this.dead) {
            this.defending = false;
            this.defaultAnim();
        }

        if (this.enraged > 0 && atbIsFull) {
            this.pickRandomSkill();
            this.enraged = constrain(this.enraged - 1, 0, this.enraged);
        } else if (!this.isPlayer && atbIsFull) {
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
        var atbIsFull = this.atbTimer >= (ATB_MAX - this.speed);

        if (this.poison > 0) {
            this.animation.drawImpl(this.x, this.y, this.scaleX * ((!this.isPlayer) ? -1 : 1), this.scaleY, this.rotation, '#669966FF');
        } else if (this.enraged > 0) {
            if ((frameCount % (((int)(random(3, 8))) * 10)) == 0) {
                addParticle(this.x + random(-20, 20), this.y + random(-35, -10), random(-1, 1), random(-1, -0.2), 80, PARTICLE_RAGE, "", '#FFFFFFFF');
            }
            this.animation.drawImpl(this.x, this.y, this.scaleX * ((!this.isPlayer) ? -1 : 1), this.scaleY, this.rotation, '#FF6666FF');
        } else if (this.powerCharge) {
            this.animation.drawImpl(this.x, this.y, this.scaleX * ((!this.isPlayer) ? -1 : 1), this.scaleY, this.rotation, '#BB66BBFF');
        } else if (this.regen > 0) {
            this.animation.draw(this.x, this.y, this.scaleX * ((!this.isPlayer) ? -1 : 1), this.scaleY, this.rotation);
        } else {
            this.animation.draw(this.x, this.y, this.scaleX * ((!this.isPlayer) ? -1 : 1), this.scaleY, this.rotation);
        }
    }

    debugString(x, y) {
        text("character" + this.ID + ":\nReady: " + this.isReadyToAct + "\nActing: " + this.isActing + "\nHP: " + this.hp + "/" + this.maxHP + "\nMP: " + this.mp + "/" + this.maxMP + "\nSTR: " + this.strength + "\nDEF: " + this.defense + "\nSPD:" + this.speed + "\ntime: " + this.atbTimer, x, y);
    }

    applyDamage(amount, strength) {
        var powerBonus = random(0.8, 1.2) + (strength / 50);
        var defenseNullifier = (random(1.0, 1.2) + (this.defense / 50));
        var attackDamage = (int)(constrain(((amount * powerBonus) / defenseNullifier), 1, this.maxHP));

        if (this.defending) attackDamage = constrain((int)(attackDamage / 3), 0, (this.hp - 1)); // cut damage in third and survive with 1 HP if defending

        this.hpTarget = constrain(this.hpTarget - attackDamage, 0, this.maxHP);
        return attackDamage;
    }

    // I don't feel like adding an arg to applyDamage hahahehe
    applyUnblockableDamage(amount, strength) {
        var powerBonus = random(0.8, 1.2) + (strength / 50);
        var attackDamage = (int)(constrain((amount * powerBonus), 1, this.maxHP));

        this.hpTarget = constrain(this.hpTarget - attackDamage, 0, this.maxHP);
        return attackDamage;
    }

    applyHealing(amount, strength) {
        var powerBonus = random(0.8, 1.2) + (strength / 50);
        var healPower = (int)(constrain((amount * powerBonus), 0, this.maxHP));

        this.hpTarget = constrain(this.hpTarget + healPower, 0, this.maxHP);
        return healPower;
    }

    applyMagic(amount) {
        this.mpTarget = constrain(this.mpTarget + (int)(amount), 0, this.maxMP);

       // other stuff 
    }
}

