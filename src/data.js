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
};

export default {
  monsters,
  spells,
};
