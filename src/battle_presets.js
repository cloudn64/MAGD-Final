// Skill Lists
const sHeroSkillList = [
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
    PROTECT_SKILL,
    REFLECT_SKILL,
    SLOWI_SKILL,
    SLOWII_SKILL,
    HASTEI_SKILL,
    HASTEII_SKILL,
    //DOOM_SKILL,
];

// Ultiman Skill List
const sUltimanSkillList = [
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
    PROTECT_SKILL,
    REFLECT_SKILL,
    SLOWI_SKILL,
    SLOWII_SKILL,
    HASTEI_SKILL,
    HASTEII_SKILL,
    //DOOM_SKILL,
];

// Water Skill List
const sWaterSkillList = [
    HEALII_SKILL,
    REGENII_SKILL,
    MPDRAINII_SKILL,
    PROTECT_SKILL,
    REFLECT_SKILL,
    SLOWII_SKILL,
    HASTEII_SKILL,
    ENRAGEI_SKILL,
];

// Characters
const sCharacters = [
    { name: "Hero", graphics:0, maxHP:2400, maxMP:200, str:120, def:28, spd:50, mag:50, skills:sHeroSkillList },
    { name: "Ultiman", graphics:0, maxHP:32280, maxMP:1800, str:550, def:220, spd:250, mag:170, skills:sUltimanSkillList },
    { name: "Hero3", graphics:0, maxHP:1900, maxMP:170, str:88, def:50, spd:130, mag:150, skills:sHeroSkillList },
    { name: "EnemyMan", graphics:0, maxHP:12000, maxMP:500, str:99, def:50, spd:102, mag:99, skills:sHeroSkillList },
    { name: "Water", graphics:-1, maxHP:12000, maxMP:500, str:99, def:50, spd:102, mag:99, skills:sWaterSkillList },
]

// Battles
function setupTestBattle(state) {
    // Enemies
    state.characters.push(createCharacter(false, 3, 480, 150));
}

function setupWaterBattle(state) {
    // Enemies
    state.characters.push(createCharacter(false, 4, 480, 150));
    
    
}

function createCharacter(isPlayer, ID, x, y) {
    var retCharacter = new Character(isPlayer, ID, sCharacters[ID].name, sCharacters[ID].graphics, x, y, sCharacters[ID].maxHP, sCharacters[ID].maxMP, sCharacters[ID].str, sCharacters[ID].def, sCharacters[ID].spd, sCharacters[ID].mag, sCharacters[ID].skills);

    return retCharacter;
}