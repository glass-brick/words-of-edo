import monsterPrototype from "./assets/monster_prototype.png";

const spells = {
  roku: {
    name: "roku",
    level: 1,
    displayName: "Roku",
    damage: 15,
    special: "",
    condition: "fire",
    descrition: "Small yet damaging sparks emanate from the monk",
  },
  odan_roku: {
    name: "odan_roku",
    level: 2,
    displayName: "Odan Roku",
    damage: 37,
    special: "",
    condition: "fire",
    description: "A burst of fire emanates from the monk",
  },
  odan_roku_goten: {
    name: "odan_roku_goten",
    level: 3,
    displayName: "Odan Roku Goten",
    damage: 73,
    special: "",
    condition: "fire",
    description: "The king of all flames erupts from the monk",
  },
  mamoku: {
    name: "mamoku",
    level: 1,
    displayName: "Mamoku",
    damage: 0,
    special: "defense_response",
    condition: "defense",
    descrition: "A simple ward protects the monk",
  },
  shime_mamoku: {
    name: "shime_mamoku",
    level: 2,
    displayName: "Shime Mamoku",
    damage: 0,
    special: "defense_response",
    condition: "defense",
    descrition: "A ward made of many sacred words protects the monk",
  },
  odan_shime_mamoku: {
    name: "odan_shime_mamoku",
    level: 3,
    displayName: "Odan Shime Mamoku",
    damage: 0,
    special: "defense_response",
    condition: "defense",
    descrition: "A grand sacred ward protects the monk from the most powerful of magics",
  },
};

const monsters = {
  monster_prototype: {
    name: "monster_prototype",
    speed: 0.026,
    hp: 400,
    attackchance: 0.15,
    msperkeystroke: 750,
    spells: [spells.roku],
    sprite: monsterPrototype,
  },
  monster_prototype_2attacks: {
    name: "monster_prototype_2attacks",
    speed: 0.026,
    hp: 400,
    attackchance: 0.15,
    msperkeystroke: 750,
    spells: [spells.roku, spells.odan_roku],
  },
};

export default {
  monsters,
  spells,
  spellList: Object.values(spells),
};
