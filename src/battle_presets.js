// Skill Lists
const sTestSkillList = [
    WATER_SKILL,
    BASKETBALL_SKILL,
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
    POISONI_SKILL,
    POISONII_SKILL,
];

// EvilMan Skill List
const sEvilManSkillList = [
    FIREII_SKILL,
    HEALI_SKILL,
    CHARGE_SKILL,
];

// Ultiman Skill List
const sUltimanSkillList = [
    FIREII_SKILL,
    FIREIII_SKILL,
    HEALII_SKILL,
    CHARGE_SKILL,
    ENRAGEII_SKILL,
    REGENII_SKILL,
    MPDRAINII_SKILL,
    PROTECT_SKILL,
    REFLECT_SKILL,
    SLOWII_SKILL,
    HASTEII_SKILL,
    POISONII_SKILL,
    DOOM_SKILL,
];

// Water Skill List
const sWaterSkillList = [
    HEALI_SKILL,
    REGENII_SKILL,
    MPDRAINII_SKILL,
    PROTECT_SKILL,
    REFLECT_SKILL,
    SLOWII_SKILL,
    HASTEII_SKILL,
    ENRAGEI_SKILL,
    WATER_SKILL,
    WATER_SKILL,
    WATER_SKILL,
    WATER_SKILL,
    WATER_SKILL,
    WATER_SKILL,
    WATER_SKILL,
    WATER_SKILL,
    WATER_SKILL,
    WATER_SKILL,
    WATER_SKILL,
    WATER_SKILL,
    WATER_SKILL,
    WATER_SKILL,
    WATER_SKILL,
    WATER_SKILL,
];

// AnnoyBro Skill List
const sAnnoyBroSkillList = [
    BASKETBALL_SKILL,
    ENRAGEII_SKILL,
    PROTECT_SKILL,
    MPDRAINII_SKILL,
    SLOWII_SKILL,
    LIFEI_SKILL,
    CHARGE_SKILL,
];

// CryBro Skill List
const sCryBroSkillList = [
    WATER_SKILL,
    LIFEI_SKILL,
    SLOWII_SKILL,
    HASTEII_SKILL,
    POISONII_SKILL,
];

// Mage Skill List
const sMageSkillList = [
    FIREI_SKILL,
    FIREII_SKILL,
    FIREIII_SKILL,
    LIFEI_SKILL,
    LIFEII_SKILL,
    SCAN_SKILL,
    HEALI_SKILL,
    HEALII_SKILL,
    HEALIII_SKILL,
    ENRAGEI_SKILL,
    ENRAGEII_SKILL,
    REGENI_SKILL,
    REGENII_SKILL,
    MPDRAINI_SKILL,
    MPDRAINII_SKILL,
    REFLECT_SKILL,
    SLOWI_SKILL,
    SLOWII_SKILL,
    HASTEI_SKILL,
    HASTEII_SKILL,
    POISONI_SKILL,
    POISONII_SKILL,
];

const sGuardSkillList = [
    PROTECT_SKILL,
    CHARGE_SKILL,
    HEALI_SKILL,
    SLOWI_SKILL,
];

const sHeroSkillList = [
    SCAN_SKILL,
    FIREI_SKILL,
    HEALI_SKILL,
    REGENI_SKILL,
    LIFEI_SKILL,
    SLOWI_SKILL,
]

const sGlaskSkillList = [
    FIREII_SKILL,
    FIREIII_SKILL,
    ENRAGEII_SKILL,
    POISONII_SKILL,
]

// Characters
const sCharacters = [
    { name: "Hero",     graphics:0,     maxHP:2400,     maxMP:150,   str:140,   def:50,     spd:50,     mag:50,     skills:sHeroSkillList },
    { name: "Ultiman",  graphics:1,     maxHP:32280,    maxMP:1800,  str:550,   def:220,    spd:250,    mag:350,    skills:sUltimanSkillList },
    { name: "Mage",     graphics:0,     maxHP:1900,     maxMP:450,   str:88,    def:25,     spd:110,    mag:150,    skills:sMageSkillList },
    { name: "EvilMan",  graphics:0,     maxHP:16000,    maxMP:800,   str:500,   def:140,    spd:130,    mag:200,     skills:sEvilManSkillList },
    { name: "Water",    graphics:-1,    maxHP:18000,    maxMP:500,   str:30,    def:90,     spd:200,    mag:200,    skills:sWaterSkillList },
    { name: "AnnoyBro", graphics:5,     maxHP:25000,    maxMP:500,   str:50,    def:50,     spd:80,     mag:300,    skills:sAnnoyBroSkillList },
    { name: "CryBro",   graphics:6,     maxHP:30000,    maxMP:900,   str:1,     def:1,      spd:1,      mag:500,    skills:sCryBroSkillList },
    { name: "Hidy",     graphics:0,     maxHP:3800,     maxMP:90,    str:180,   def:150,    spd:5,      mag:30,     skills:sGuardSkillList },
    { name: "Glask",    graphics:0,     maxHP:1200,     maxMP:600,   str:250,   def:1,      spd:45,     mag:120,    skills:sGlaskSkillList },
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

function setupUltimanBattle(state) {
    // Enemies
    state.characters.push(createCharacter(false, 1, 480, 150));
}

function setupBasketballBattle(state) {
    // Enemies
    state.characters.push(createCharacter(false, 5, 480, 150));
    state.characters.push(createCharacter(false, 6, 480, 250));
}

function createCharacter(isPlayer, ID, x, y) {
    var retCharacter = new Character(isPlayer, ID, sCharacters[ID].name, sCharacters[ID].graphics, x, y, sCharacters[ID].maxHP, sCharacters[ID].maxMP, sCharacters[ID].str, sCharacters[ID].def, sCharacters[ID].spd, sCharacters[ID].mag, sCharacters[ID].skills);

    return retCharacter;
}