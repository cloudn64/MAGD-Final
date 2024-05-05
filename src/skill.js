const FIREI_SKILL = 0;
const FIREII_SKILL = 1;
const FIREIII_SKILL = 2;
const LIFEI_SKILL = 3;
const LIFEII_SKILL = 4;
const SCAN_SKILL = 5;
const HEALI_SKILL = 6;
const HEALII_SKILL = 7;
const HEALIII_SKILL = 8;
const CHARGE_SKILL = 9;
const ENRAGEI_SKILL = 10;
const ENRAGEII_SKILL = 11;
const REGENI_SKILL = 12;
const REGENII_SKILL = 13;
const MPDRAINI_SKILL = 14;
const MPDRAINII_SKILL = 15;
const PROTECT_SKILL = 16;
const REFLECT_SKILL = 17;
const SLOWI_SKILL = 18;
const SLOWII_SKILL = 19;
const HASTEI_SKILL = 20;
const HASTEII_SKILL = 21;
const DOOM_SKILL = 22;

var sSkillList = [];

class Skill {
    constructor(name, desc, actionId, skillId, potency, mpCost, targetAllies, targetDead) {
        this.name = name; // name of the attack, not used in the description, but used for buttons and overhead info.
        this.description = desc; // example: "(name) threw a rock!" "(name) charged up his power!"
        this.potency = potency;
        this.mpCost = mpCost;
        this.targetAllies = targetAllies; // attack targets allies instead of enemies
        this.targetDead = targetDead; // attack targets dead people
        this.actionId = actionId;
        this.skillId = skillId;
    }
}

// there's got to be a better way to do this but I'm not going to bother with it
function populateGlobalSkillList() {
    sSkillList = [];
    sSkillList.push(new Skill("Fire I", "Burn the opponent with flames!", BATTLEACTION_FIRE, FIREI_SKILL, 300, 30, false, false)); // FIREI_SKILL
    sSkillList.push(new Skill("Fire II", "Burn the opponent with strong flames!", BATTLEACTION_FIRE, FIREII_SKILL, 800, 50, false, false)); // FIREII_SKILL
    sSkillList.push(new Skill("Fire III", "Burn the opponent with extreme flames!", BATTLEACTION_FIRE, FIREIII_SKILL, 3000, 130, false, false)); // FIREIII_SKILL
    sSkillList.push(new Skill("Revive I", "Revive a fallen ally", BATTLEACTION_LIFE, LIFEI_SKILL, 500, 60, true, true)); // LIFEI_SKILL
    sSkillList.push(new Skill("Revive II", "Revive a fallen ally with full HP", BATTLEACTION_LIFE, LIFEII_SKILL, 99999, 150, true, true)); // LIFEII_SKILL
    sSkillList.push(new Skill("Scan", "Reveal an opponent's HP/MP when targeting", BATTLEACTION_SCAN, SCAN_SKILL, 0, 25, false, false)); // SCAN_SKILL
    sSkillList.push(new Skill("Heal I", "Restore a bit of an ally's HP", BATTLEACTION_LIFE, HEALI_SKILL, 500, 20, true, false)); // HEALI_SKILL
    sSkillList.push(new Skill("Heal II", "Restore some of an ally's HP", BATTLEACTION_LIFE, HEALII_SKILL, 2000, 30, true, false)); // HEALII_SKILL
    sSkillList.push(new Skill("Heal III", "Restore a lot of an ally's HP", BATTLEACTION_LIFE, HEALIII_SKILL, 5000, 60, true, false)); // HEALIII_SKILL
    sSkillList.push(new Skill("Charge", "Ally's next attack will do 1.5x damage", BATTLEACTION_CHARGE, CHARGE_SKILL, 1.5, 45, true, false)); // CHARGE_SKILL
    sSkillList.push(new Skill("Enrage I", "Target will only attack for 3 turns", BATTLEACTION_ENRAGE, ENRAGEI_SKILL, 3, 25, false, false)); // ENRAGEI_SKILL
    sSkillList.push(new Skill("Enrage II", "Target will only attack for 6 turns", BATTLEACTION_ENRAGE, ENRAGEII_SKILL, 6, 50, false, false)); // ENRAGEII_SKILL
    sSkillList.push(new Skill("Regen I", "Recover a bit of HP for 8 turns", BATTLEACTION_REGEN, REGENI_SKILL, 50, 15, true, false)); // REGENI_SKILL
    sSkillList.push(new Skill("Regen II", "Recover some HP for 8 turns", BATTLEACTION_REGEN, REGENII_SKILL, 150, 25, true, false)); // REGENII_SKILL
    sSkillList.push(new Skill("MP Drain I", "Steal a bit of MP from the opponent", BATTLEACTION_MPDRAIN, MPDRAINI_SKILL, 15, 5, false, false)); // MPDRAINI_SKILL
    sSkillList.push(new Skill("MP Drain II", "Steal some of MP from the opponent", BATTLEACTION_MPDRAIN, MPDRAINII_SKILL, 30, 10, false, false)); // MPDRAINII_SKILL
    sSkillList.push(new Skill("PhysReflect", "Reflect one physical attack from everyone", BATTLEACTION_REFLECT, PROTECT_SKILL, 1, 20, true, false)); // PROTECT_SKILL
    sSkillList.push(new Skill("MagReflect", "Reflect one magical attack from everyone", BATTLEACTION_REFLECT, REFLECT_SKILL, 2, 30, true, false)); // REFLECT_SKILL
    sSkillList.push(new Skill("Slow I", "Slow down an opponent by a bit for 3 turns", BATTLEACTION_SPEED, SLOWI_SKILL, 0.75, 30, false, false)); // SLOWI_SKILL
    sSkillList.push(new Skill("Slow II", "Slow down an opponent by a lot for 3 turns", BATTLEACTION_SPEED, SLOWII_SKILL, 0.4, 60, false, false)); // SLOWII_SKILL
    sSkillList.push(new Skill("Haste I", "Speed up an ally by a bit for 3 turns", BATTLEACTION_SPEED, HASTEI_SKILL, 1.35, 30, true, false)); // HASTEI_SKILL
    sSkillList.push(new Skill("Haste II", "Speed up an ally by a lot for 3 turns", BATTLEACTION_SPEED, HASTEII_SKILL, 2.2, 60, true, false)); // HASTEII_SKILL
    sSkillList.push(new Skill("Doom", "Reduce an opponent to 1HP/1MP", BATTLEACTION_DOOM, DOOM_SKILL, 0, 1, false, false)); // HASTEII_SKILL
}

function skillListToSkills(skillList) {
    var tempSkillArray = new Array();
    for (var s = 0; s < skillList.length; s++) {
        var skillId = skillList[s];
        if (skillId < sSkillList.length) {
            print("add skill " + skillId + "(" + sSkillList[skillId].name + ")");
            tempSkillArray.push(getSkill(skillId));
        }
    }

    return tempSkillArray;
}

function getSkill(id) {
    return sSkillList[id];
}

// Unused
function attack(source, target) {
    var characterPower = source.strength * random(0.8, 1.2);
    var targetDefense = target.defense * random(0.8, 1.2);

    var attackPower = (this.potency * characterPower) / targetDefense;
}