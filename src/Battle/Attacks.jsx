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

import { Howl } from "howler";

const attackSounds = {
  cutting: new Howl({ src: cuttingSound, volume: 0.2 }),
  fire: new Howl({ src: fireSound, volume: 0.2 }),
  kinetic: new Howl({ src: kineticSound, volume: 0.2 }),
  psi: new Howl({ src: psiSound, volume: 0.2 }),
  water: new Howl({ src: waterSound, volume: 0.2 }),
  defense: new Howl({ src: defenseSound, volume: 0.2 }),
  boost: new Howl({ src: boostSound, volume: 0.2 }),
  // seal: sealSound,
  // mirror: mirrorSound,
  // heal: healSound,
};

const attackSpeeds = {
  cutting: 500,
  fire: 1000,
  kinetic: 1000,
  psi: 1500,
  seal: 1500,
  water: 1000,
  defense: 1500,
  boost: 1000,
  mirror: 1500,
  heal: 1000,
};

const defensiveSpells = ["defense", "boost", "mirror", "heal"];

let Attack = ({ enemyPos }, ref) => {
  const [attackOnPlayer, setAttackOnPlayer] = useState({});
  const [attackOnEnemy, setAttackOnEnemy] = useState({});
  const [activePlayer, setActivePlayer] = useState(false);
  const [activeEnemy, setActiveEnemy] = useState(false);

  useEffect(() => {
    let id;
    if (attackOnPlayer) {
      id = setTimeout(() => {
        setAttackOnPlayer({});
        setActivePlayer(false);
      }, attackSpeeds[attackOnPlayer.condition] || 1000);
    }
    return () => clearTimeout(id);
  }, [attackOnPlayer, activePlayer]);

  useEffect(() => {
    let id;
    if (attackOnEnemy) {
      id = setTimeout(() => {
        setAttackOnEnemy({});
        setActiveEnemy(false);
      }, attackSpeeds[attackOnEnemy.condition] || 1000);
    }
    return () => clearTimeout(id);
  }, [attackOnEnemy, activeEnemy]);

  useImperativeHandle(ref, () => ({
    triggerAttack: (spell, playerCasted) => {
      const sound = attackSounds[spell.condition];
      if (sound) {
        sound.play();
      }
      if (
        (playerCasted === "player" &&
          !defensiveSpells.includes(spell.condition)) ||
        (playerCasted === "enemy" && defensiveSpells.includes(spell.condition))
      ) {
        setAttackOnEnemy(spell);
        if (activeEnemy) {
          setActiveEnemy(false);
          setTimeout(() => setActiveEnemy(true), 0);
        } else {
          setActiveEnemy(true);
        }
      } else if (
        (playerCasted === "enemy" &&
          !defensiveSpells.includes(spell.condition)) ||
        (playerCasted === "player" && defensiveSpells.includes(spell.condition))
      ) {
        setAttackOnPlayer(spell);
        if (activePlayer) {
          setActivePlayer(false);
          setTimeout(() => setActivePlayer(true), 0);
        } else {
          setActivePlayer(true);
        }
      }
    },
  }));

  return (
    <>
      {activePlayer && (
        <div
          className="attack"
          id={attackOnPlayer.condition}
          style={{
            transform: `scale(${attackOnPlayer.level / 3})`,
            bottom: 40,
            left: 200,
          }}
        />
      )}
      {activeEnemy && (
        <div
          className="attack"
          id={attackOnEnemy.condition}
          style={{
            transform: `scale(${attackOnEnemy.level / 3})`,
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
