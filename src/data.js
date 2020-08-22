import monsterPrototype from "./assets/monster_prototype.png";

const spells = {
  roku: {
    name: "roku",
    displayName: "Roku",
    damage: 15,
    special: "",
    condition: "fire",
    descrition: "Small yet damaging sparks emanate from the monk",
  },
  odan_roku: {
    name: "odan_roku",
    damage: 37,
    special: "",
    condition: "fire",
    description: "A burst of fire emanates from the monk",
  },
  odan_roku_goten: {
    name: "odan_roku_goten",
    damage: 73,
    special: "",
    condition: "fire",
    description: "The king of all flames erupts from the monk",
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
};
