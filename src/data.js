import monsterPrototype from "./assets/monster_prototype.png";
import akaManto from "./assets/aka_manto_portrait.png";

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
  osumaki: {
    name: "osumaki",
    level: 1,
    displayName: "Osumaki",
    damage: 7,
    special: "push",
    condition: "kinetic",
    description:
      "The monk imbues the air with some energy, pushing the monster back",
  },
  torane_osumaki: {
    name: "torane_osumaki",
    level: 2,
    displayName: "Torane Osumaki",
    damage: 18,
    special: "push",
    condition: "kinetic",
    description:
      "The monk imbues the air with plenty of energy, pushing the monster back",
  },
  torane_osumaki_tsuyi: {
    name: "torane_osumaki_tsuyi",
    level: 3,
    displayName: "Torane Osumaki Tsuyi",
    damage: 30,
    special: "push",
    condition: "kinetic",
    description:
      "The monk imbues the air with a huge amount of energy, pushing the monster back",
  },
  himaki: {
    name: "himaki",
    level: 1,
    displayName: "Himaki",
    damage: 7,
    special: "pull",
    condition: "kinetic",
    description:
      "The monk slightly pulls the strings of fate, pulling the monster closer",
  },
  robae_himaki: {
    name: "robae_himaki",
    level: 2,
    displayName: "Robae Himaki",
    damage: 18,
    special: "pull",
    condition: "kinetic",
    description:
      "The monk strongly pulls the strings of fate, pulling the monster closer",
  },
  robae_himaki_tsuyi: {
    name: "robae_himaki_tsuyi",
    level: 3,
    displayName: "Robae Himaki Tsuyi",
    damage: 30,
    special: "pull",
    condition: "kinetic",
    description:
      "The monk pulls the strings of fate with all his might, pulling the monster closer",
  },
  nakae: {
    name: "nakae",
    level: 1,
    displayName: "Nakae",
    damage: 9,
    special: "",
    condition: "kinetic",
    description:
      "The monk imbues the air with some power, releasing it suddenly in the form of a spiritual punch",
  },
  odan_nakae: {
    name: "odan_nakae",
    level: 2,
    displayName: "Odan Nakae",
    damage: 23,
    special: "",
    condition: "kinetic",
    description:
      "The monk imbues the air with a fair amount of power, releasing it suddenly in the form of a strong spiritual punch",
  },
  odan_nakae_tsuyi: {
    name: "odan_nakae_tsuyi",
    level: 3,
    displayName: "Odan Nakae Tsuyi",
    damage: 50,
    special: "",
    condition: "kinetic",
    description:
      "The monk imbues the air with a huge amount of power, releasing it suddenly in the form of an extremely powerful spiritual punch",
  },
  kurae: {
    name: "kurae",
    level: 1,
    displayName: "Kurae",
    damage: 15,
    special: "",
    condition: "cutting",
    description:
      "The monk shapes some of energy in an edge shaped form, causing cuts in the monster",
  },
  odan_kurae: {
    name: "odan_kurae",
    level: 2,
    displayName: "Odan Kurae",
    damage: 35,
    special: "",
    condition: "cutting",
    description:
      "The monk shapes a fair amount of energy in an edge shaped form, causing serious cuts in the monster",
  },
  odan_kurae_tsuyi: {
    name: "odan_kurae_tsuyi",
    level: 3,
    displayName: "Oadan Kurae Tsuyi",
    damage: 64,
    special: "",
    condition: "cutting",
    description:
      "The monk shapes a huge amount of energy in an edge shaped form, causing terrible cuts in the monster",
  },
  tagasu: {
    name: "tagasu",
    level: 1,
    displayName: "Tagasu",
    damage: 0,
    special: "",
    condition: "boost",
    description:
      "The monk sets a small amount of spiritual energy aside to supplement his next spell",
  },
  shime_tagasu: {
    name: "shime_tagasu",
    level: 2,
    displayName: "Shime Tagasu",
    damage: 0,
    special: "",
    condition: "boost",
    description:
      "The monk sets a fair amount of spiritual energy aside to supplement his next spell",
  },
  odan_shime_tagasu: {
    name: "odan_shime_tagasu",
    level: 3,
    displayName: "Odan Shime Tagasu",
    damage: 0,
    special: "",
    condition: "boost",
    description:
      "The monk sets a huge amount of spiritual energy aside to supplement his next spell",
  },
  gisoku: {
    name: "gisoku",
    level: 1,
    displayName: "Gisoku",
    damage: 0,
    special: "defense_mirror",
    condition: "mirror",
    description:
      "The monk exposes a small fraction of his soul, binding it with the monster's. Their pain is briefly one and the same",
  },
  odan_gisoku: {
    name: "odan_gisoku",
    level: 2,
    displayName: "Odan Gisoku",
    damage: 0,
    special: "defense_mirror",
    condition: "mirror",
    description:
      "The monk exposes a fair fraction of his soul, binding it with the monster's. Their pain is briefly one and the same",
  },
  odan_shime_gisoku: {
    name: "odan_shime_gisku",
    level: 3,
    displayName: "Odan Shime Gisoku",
    damage: 0,
    special: "defense_mirror",
    condition: "mirror",
    description:
      "The monk exposes a large fraction of his soul, binding it with the monster's. Their pain is briefly one and the same",
  },
  chisayu: {
    name: "chisayu",
    level: 1,
    displayName: "Chisayu",
    damage: 0,
    special: "self_heal",
    condition: "heal",
    description:
      "The monk calls upon a few friendly spirits, asking them to heal his wounds",
  },
  odan_chisayu: {
    name: "odan_chisayu",
    level: 2,
    displayName: "Odan Chisayu",
    damage: 0,
    special: "self_heal",
    condition: "heal",
    description:
      "The monk calls upon a considerable amount of friendly spirits, asking them to heal his wounds",
  },
  odan_chisayu_goten: {
    name: "odan_chisayu_goten",
    level: 3,
    displayName: "Odan Chisayu Goten",
    damage: 0,
    special: "self_heal",
    condition: "heal",
    description:
      "The monk calls upon a huge amount of friendly spirits, asking them to heal his wounds",
  },
  itochi_nio_sasu_yosu_itsuio: {
    name: "itochi_nio_sasu_yosu_itsuio",
    level: 3,
    displayName: "Itochi Nio Sasu Yosu Itsuio",
    damage: 0,
    special: "seal_monster",
    condition: "seal",
    description:
      "The monk fills the seal with spiritual power, preparing it to chain the monster within it",
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
  aka_manto: {
    name: "aka_manto",
    speed: 0.045,
    hp: 400,
    attackchance: 0.11,
    msperkeystroke: 800,
    spells: [
      { spell: spells.kurae, chances: 0.3 },
      { spell: spells.odan_kurae, chances: 0.5 },
      { spell: spells.odan_kurae_tsuyi, chances: 0.2 },
    ],
    sprite: monsterPrototype,
  },
};

const utils = {
  minStartingDistance: 4,
  maxStartingDistance: 7,
  defenseMultiplier: 0.3,
  mirrorMultiplier: 0.6,
  healAmount: 100,
};

const missions = [
  {
    monster: monsters.monster_prototype,
    title: "Save my children!",
    description: "They're possessed by a spooky ghost!",
    image: akaManto,
  },
  {
    monster: monsters.aka_manto,
    title: "It's in the bathroom...",
    description:
      "A strange being is offering toilet paper in the bathroom stalls,",
    image: akaManto,
  },
];

export default {
  monsters,
  missions,
  spells,
  utils,
  spellList: Object.values(spells),
};
