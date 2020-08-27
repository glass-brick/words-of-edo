import React, {
  forwardRef,
  useState,
  useImperativeHandle,
  useEffect,
} from "react";
import "./Attacks.scss";
import cuttingSound from "../assets/attack_sounds/cut.wav";
import fireSound from "../assets/fireball.wav";
import kineticSound from "../assets/attack_sounds/push.wav";
import psiSound from "../assets/attack_sounds/psi.wav";
import waterSound from "../assets/attack_sounds/water_spell.wav";
import defenseSound from "../assets/attack_sounds/defense.wav";
import boostSound from "../assets/attack_sounds/boost1.mp3";
import mirrorSound from "../assets/attack_sounds/reflect.wav";
import sealSound from "../assets/attack_sounds/defense_3.wav";

import { Howl } from "howler";

const attackSounds = {
  cutting: new Howl({ src: cuttingSound, volume: 0.2 }),
  fire: new Howl({ src: fireSound, volume: 0.2 }),
  kinetic: new Howl({ src: kineticSound, volume: 0.2 }),
  mind: new Howl({ src: psiSound, volume: 0.2 }),
  water: new Howl({ src: waterSound, volume: 0.2 }),
  defense: new Howl({ src: defenseSound, volume: 0.2 }),
  defense_success: new Howl({ src: defenseSound, volume: 0.2 }),
  boost: new Howl({ src: boostSound, volume: 0.2 }),
  mirror: new Howl({ src: mirrorSound, volume: 0.2 }),
  seal: new Howl({ src: sealSound, volume: 0.2 }),
  heal: new Howl({ src: boostSound, volume: 0.2 }),
};

const attackSpeeds = {
  cutting: 500,
  fire: 1000,
  kinetic: 1000,
  psi: 1500,
  seal: 1500,
  water: 1000,
  defense: 1500,
  defense_success: 1500,
  boost: 1000,
  mirror: 1500,
  heal: 1000,
};

const defensiveSpells = ["defense", "boost", "mirror", "heal"];

function useSpellOnPlace() {
  const [spellCast, setSpellCast] = useState({});
  const [spellIsActive, setSpellIsActive] = useState(false);

  useEffect(() => {
    let id;
    if (spellCast) {
      id = setTimeout(() => {
        setSpellCast({});
        setSpellIsActive(false);
      }, attackSpeeds[spellCast.condition] || 1000);
    }
    return () => clearTimeout(id);
  }, [spellCast, spellIsActive]);

  const triggerSpell = (spell) => {
    const sound = attackSounds[spell.condition];
    if (sound) {
      sound.play();
    }
    setSpellCast(spell);
    if (spellIsActive) {
      setSpellIsActive(false);
      setTimeout(() => setSpellIsActive(true), 0);
    } else {
      setSpellIsActive(true);
    }
  };

  return [spellIsActive && spellCast, triggerSpell];
}

let Attack = ({ enemyPos, defense }, ref) => {
  const [spellOnPlayer, triggerSpellOnPlayer] = useSpellOnPlace();
  const [spellOnEnemy, triggerSpellOnEnemy] = useSpellOnPlace();
  const [auxPlayerSpell, triggerAuxPlayerSpell] = useSpellOnPlace();

  useImperativeHandle(ref, () => ({
    triggerAttack: (spell, entityCasted) => {
      if (
        (entityCasted === "player" &&
          !defensiveSpells.includes(spell.condition)) ||
        (entityCasted === "enemy" && defensiveSpells.includes(spell.condition))
      ) {
        triggerSpellOnEnemy(spell);
      } else if (
        (entityCasted === "enemy" &&
          !defensiveSpells.includes(spell.condition)) ||
        (entityCasted === "player" && defensiveSpells.includes(spell.condition))
      ) {
        triggerSpellOnPlayer(spell);
        if (entityCasted === "enemy" && defense) {
          triggerAuxPlayerSpell({ condition: "defense_success", level: 3 });
        }
      }
    },
  }));

  return (
    <>
      {auxPlayerSpell && (
        <div
          className="attack"
          id={auxPlayerSpell.condition}
          style={{
            transform: `scale(${auxPlayerSpell.level / 3})`,
            bottom: 40,
            left: 200,
          }}
        />
      )}
      {spellOnPlayer && (
        <div
          className="attack"
          id={spellOnPlayer.condition}
          style={{
            transform: `scale(${spellOnPlayer.level / 3})`,
            bottom: 40,
            left: 200,
          }}
        />
      )}
      {spellOnEnemy && (
        <div
          className="attack"
          id={spellOnEnemy.condition}
          style={{
            transform: `scale(${spellOnEnemy.level / 3})`,
            top: enemyPos.top,
            left: enemyPos.left,
          }}
        />
      )}
    </>
  );
};

Attack = forwardRef(Attack);

export default Attack;
