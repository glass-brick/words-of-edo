/* eslint-disable default-case */
import { useState, useCallback, useEffect } from "react";
import data from "./data.js";

// Music & Sound
import { Howl, Howler } from "howler";
import musicSrc from "./assets/tin_tintin.mp3";
import musicSrc2 from "./assets/tin_tin_tin_tin_TIN_TIN_TIN_TIN.mp3";

function useLog(maxLines) {
  const [log, setLog] = useState(["A demon appears!"]);

  const addToLog = useCallback(
    (newItem) =>
      setLog((log) => {
        if (log.length >= maxLines) {
          return [...log.slice(1), newItem];
        } else {
          return [...log, newItem];
        }
      }),
    [maxLines]
  );

  return [log, addToLog];
}

const possibleMusic = [musicSrc, musicSrc2];

let musicChoice = Math.floor(Math.random() * possibleMusic.length);
const music = new Howl({
  src: [possibleMusic[musicChoice]],
  loop: true,
});

export default function useBattleState({ monk, mission, onMissionEnd }) {
  const { monster } = mission;
  const [hp, setHP] = useState(monk.hp);
  const [monsterHp, setMonsterHP] = useState(monster.hp);
  const [monsterDistance, setMonsterDistance] = useState(
    data.utils.maxStartingDistance
  );
  const [enemyWord, setEnemyWord] = useState(null);
  const [log, addToLog] = useLog(5);
  const [defense, setDefense] = useState(null);
  const [defenseMirror, setDefenseMirror] = useState(null);
  const [defenseBoosted, setDefenseBoosted] = useState(null);
  const [boost, setBoost] = useState(null);
  const [objectiveHP, setObjectiveHP] = useState(mission.objectiveHP);
  const [monkItems, setMonkItems] = useState(monk.items);
  const [usedItems, setUsedItems] = useState([]);

  useEffect(() => {
    music.volume(1);
    music.play();

    return () => music.stop();
  }, []);

  function onCompleteWord(spellUsed) {
    if (spellUsed) {
      setDefenseMirror(null);
      setDefenseBoosted(null);
      setDefense(null);
      let boosted = false;
      if (boost && boost >= spellUsed.level) {
        boosted = true;
        setBoost(null);
      }
      attackOnOpponent(spellUsed, boosted);
    }
  }

  function attackOnOpponent(spellUsed, boosted) {
    let damage = spellUsed.damage ? spellUsed.damage : 0;
    let boostValue = boosted ? data.utils.boostMultiplier : 1;

    damage *= boostValue;

    setMonsterHP(Math.round(monsterHp - damage));

    // specials logic
    // Specials refer to extra effects on creatures
    if (spellUsed.special) {
      let finalDistance;
      switch (spellUsed.special) {
        case "defense_response":
          // Defense does nothing against a spell that is not being cast
          if (enemyWord) {
            setDefense(spellUsed.level);
            if (boosted) setDefenseBoosted(boosted);
          }
          break;
        case "defense_mirror":
          // Defense does nothing against a spell that is not being cast
          if (enemyWord) {
            setDefenseMirror(spellUsed.level);
            if (boosted) setDefenseBoosted(boosted);
          }
          break;
        case "push":
          finalDistance =
            monsterDistance +
            spellUsed.displayName.length * monster.speed * 1.5 * boostValue;
          if (finalDistance > data.utils.maxStartingDistance) {
            finalDistance = data.utils.maxStartingDistance;
            addToLog("It can't go any further");
          }
          setMonsterDistance(finalDistance);
          break;
        case "pull":
          finalDistance =
            monsterDistance -
            spellUsed.displayName.length * monster.speed * 1.5 * boostValue;
          if (finalDistance < data.utils.minStartingDistance) {
            finalDistance = data.utils.minStartingDistance;
            addToLog("It can't go any closer");
          }
          setMonsterDistance(finalDistance);
          break;
        case "self_heal":
          setHP(
            Math.round(
              hp + spellUsed.level * data.utils.healAmount * boostValue
            )
          );
          break;
        case "boost":
          setBoost(spellUsed.level);
          break;
      }
    }

    if (spellUsed.condition) {
      if (
        mission.type === "protect" &&
        mission.conditions &&
        mission.conditions.includes(spellUsed.condition)
      ) {
        if (objectiveHP) {
          setObjectiveHP(objectiveHP - damage);
        }
        addToLog(`The ${mission.type} seems damaged`);
      }
    }
  }

  function onCompleteEnemyWord(spellUsed) {
    let damage = getPlayerDamageFunction(spellUsed.damage, monsterDistance);
    let boosted = defenseBoosted ? data.utils.boostMultiplier : 1;
    if (defense && spellUsed.level <= defense) {
      damage *= data.utils.defenseMultiplier / boosted;
      setDefense(null);
    }
    if (defenseMirror && spellUsed.level <= defenseMirror) {
      setMonsterHP(
        Math.round(monsterHp - data.utils.mirrorMultiplier * damage * boosted)
      );
      setDefenseMirror(null);
    }

    setHP(Math.round(hp - damage));
    setEnemyWord(null);
  }

  function getPlayerDamageFunction(baseDamage, distance) {
    return baseDamage * (10 - distance);
  }

  function onKeyStroke() {
    if (!enemyWord) {
      // If we have an enemy word it is attacking
      // tries to attack
      if (Math.random() < monster.attackchance) {
        // choose attack
        let finalAttack = null;
        if (monster.spells.length === 1) {
          finalAttack = monster.spells[0].spell;
        } else {
          let randomChoice = Math.random();
          let advance = 0;
          for (let i = 0; i < monster.spells.length; i++) {
            const attack = monster.spells[i];
            if (randomChoice < attack.chances + advance ) {
              finalAttack = attack.spell;
              break;
            } else {
              advance += attack.chances;
            }
          }
        }
        // Starts attacking
        setEnemyWord(finalAttack);
      } else {
        // Moves
        setMonsterDistance(
          Math.max(
            monsterDistance - monster.speed,
            data.utils.minStartingDistance
          )
        );
      }
    } // if it's attacking, it has its own logic
  }

  function onItemUse(itemUsed) {
    if (itemUsed) {
      attackOnOpponent(itemUsed.spell, false);
      // here we check if the monk already has these spells
      setUsedItems([...usedItems, itemUsed]); // New array with old and new items used
      setMonkItems(monkItems.filter((item) => item.name !== itemUsed.name));
    }
  }

  useEffect(() => {
    if (monsterHp <= 0 || hp <= 0) {
      // HACK so it's not called again
      setMonsterHP(1);
      setHP(1);
      let missionObjectivePassed;
      let monkDead;
      let rewards = mission.rewards;
      if (monsterHp <= 0) {
        missionObjectivePassed = true;
        switch (mission.type) {
          case "protect":
            missionObjectivePassed = objectiveHP;
            break;
        }
        monkDead = false;
      } else {
        missionObjectivePassed = false;
        monkDead = true;
      }
      onMissionEnd({
        missionObjectivePassed,
        monkDead,
        rewards,
        usedItems,
        mission,
      });
    }
  }, [monsterHp, hp]);

  return {
    hp,
    monsterHp,
    monsterDistance,
    log,
    onCompleteWord: (spellUsed) => {
      onCompleteWord(spellUsed);
    },
    onCompleteEnemyWord: (spellUsed) => {
      onCompleteEnemyWord(spellUsed);
    },
    onKeyStroke: () => {
      onKeyStroke();
    },
    onItemUse: (itemUsed) => {
      onItemUse(itemUsed);
    },
    enemyWord,
    objectiveHP,
    monkItems,
  };
}
