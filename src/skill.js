const TEST_SKILL = 0;

var sSkillList = [];

class Skill {
    constructor(name, desc, actionId, potency, mpCost, targetAllies, targetDead, atk, upd, drw) {
        this.name = name; // name of the attack, not used in the description, but used for buttons and overhead info.
        this.description = desc; // example: "(name) threw a rock!" "(name) charged up his power!"
        this.potency = potency;
        this.mpCost = mpCost;
        this.targetAllies = targetAllies; // attack targets allies instead of enemies
        this.targetDead = targetDead; // attack targets dead people
        this.actionId = actionId;
    }
}

// there's got to be a better way to do this but I'm not going to bother with it
function populateGlobalSkillList() {
    sSkillList = [];
    sSkillList.push(new Skill("Fire", "Burn the opponent with very funny flames!", 2, 300, 30, false, false, null, null, null)); // TEST_SKILL
    sSkillList.push(new Skill("Test Skill II", "Test Skill but Expensive", 1, 2, 6000, false, false, null, null, null)); // TEST_SKILL
    sSkillList.push(new Skill("Test Life", "Test Life Spell", 2, 2, 92, true, true, null, null, null)); // TEST_SKILL
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