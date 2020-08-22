import monsterPrototype from "./assets/monster_prototype.png";

const spells = {
  roku: {
    name: "roku",
    level: 1,
    displayName: "Roku",
    damage: 15,
    special: "",
    condition: "fire",
    description: "Small yet damaging sparks emanate from the monk",
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
    damage: 72,
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
    description: "A simple ward protects the monk",
  },
  shime_mamoku: {
    name: "shime_mamoku",
    level: 2,
    displayName: "Shime Mamoku",
    damage: 0,
    special: "defense_response",
    condition: "defense",
    description: "A ward made of many sacred words protects the monk",
  },
  odan_shime_mamoku: {
    name: "odan_shime_mamoku",
    level: 3,
    displayName: "Odan Shime Mamoku",
    damage: 0,
    special: "defense_response",
    condition: "defense",
    description:
      "A grand sacred ward protects the monk from the most powerful of magics",
  },
  katara: {
    name: "katara",
    level: 1,
    displayName: "Katara",
    damage: 12,
    special: "",
    condition: "water",
    description: "Magically imbued water drops emanate from the monk",
  },
  odan_katara: {
    name: "odan_katara",
    level: 2,
    displayName: "Odan Katara",
    damage: 30,
    special: "",
    condition: "water",
    description: "A powerful stream of water emanates from the monk",
  },
  odan_katara_goten: {
    name: "odan_katara_goten",
    level: 3,
    displayName: "Oden Katara Goten",
    damage: 64,
    special: "",
    condition: "water",
    description:
      "A single droplet of water with the strength of a tremendous wave emanates from the monk",
  },
  watama: {
    name: "watama",
    level: 1,
    displayName: "Watama",
    damage: 13,
    special: "",
    condition: "psi",
    description: "A spirit of headache infiltrates the monster's thoughts",
  },
  iteru_watama: {
    name: "iteru_watama",
    level: 2,
    displayName: "Iteru Watama",
    damage: 33,
    special: "",
    condition: "psi",
    description: "An evil spirit of migraine infiltrates the monster's mind",
  },
  gomoku_iteru_watama: {
    name: "gomoku_iteru_watama",
    level: 3,
    displayName: "Gomoku Iteru Watama",
    damage: 59,
    special: "",
    condition: "psi",
    description:
      "A sealed demon infiltrates the monster's mind, causing excruciating pain",
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

const utils = {
  minStartingDistance: 4,
  maxStartingDistance: 7,
};

export default {
  monsters,
  spells,
  utils,
  spellList: Object.values(spells),
};
