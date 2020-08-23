/* eslint-disable default-case */
import { useState, useCallback, useEffect } from "react";
import data from "./data.js";

function useLog(maxLines) {
  const [log, setLog] = useState(["A demon appears!"]);

  const addToLog = useCallback(
    (newItem) =>
      setLog((log) => {
        if (log.length > maxLines) {
          return [...log.slice(1), newItem];
        } else {
          return [...log, newItem];
        }
      }),
    [maxLines]
  );

  return [log, addToLog];
}

export default function useBattleState({ mission, onMissionEnd }) {
  const { monster } = mission;
  const [hp, setHP] = useState(1000);
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

  function onCompleteWord(spellUsed) {
    if (spellUsed) {
      setDefenseMirror(null);
      setDefenseBoosted(null);
      setDefense(null);
      let damage = spellUsed.damage ? spellUsed.damage : 0;
      let boosted = false;
      if(boost && boost >= spellUsed.level) {
        damage *= data.utils.boostMultiplier;
        boosted = true;
        setBoost(null);
      }
      setMonsterHP(Math.round(monsterHp - damage));

      // specials logic
      // Specials refer to extra effects on creatures
      if (spellUsed.special) {
        let finalDistance;
        let boostValue = boosted ? data.utils.boostMultiplier : 1;
        switch (spellUsed.special) {
          case "defense_response":
            // Defense does nothing against a spell that is not being cast
            if (enemyWord) {
              setDefense(spellUsed.level);
              if(boosted) setDefenseBoosted(boosted);
            }
            break;
          case "defense_mirror":
            // Defense does nothing against a spell that is not being cast
            if (enemyWord) {
              setDefenseMirror(spellUsed.level);
              if(boosted) setDefenseBoosted(boosted);
            }
            break;
          case "push":
            finalDistance = monsterDistance + 
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
          case 'self_heal':
            setHP(Math.round(hp + spellUsed.level * data.utils.healAmount * boostValue));
            break;
          case 'boost':
            setBoost(spellUsed.level);
            break;
        }
      }

      if (spellUsed.condition) {
        switch (spellUsed.condition) {
          case "fire":
            addToLog("The house seems damaged");
            // TODO add fire damage to house
            break;
        }
      }
    }
  }

  function onCompleteEnemyWord(spellUsed) {
    let damage = getPlayerDamageFunction(spellUsed.damage, monsterDistance);
    let boosted = defenseBoosted ? data.utils.boostMultiplier : 1;
    if (defense && spellUsed.level <= defense) {
      damage *= (data.utils.defenseMultiplier / boosted);
      console.log({damage})
      console.log({boosted})
      setDefense(null)
    }
    if (defenseMirror && spellUsed.level <= defenseMirror) {
      console.log(data.utils.mirrorMultiplier * damage * boosted)
      console.log({boosted})
      setMonsterHP(Math.round(monsterHp - data.utils.mirrorMultiplier * damage * boosted));
      setDefenseMirror(null)
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
        // Starts attacking
        setEnemyWord(monster.spells[0]);
      } else {
        // Moves
        setMonsterDistance(monsterDistance - monster.speed);
      }
    } // if it's attacking, it has its own logic
  }

  useEffect(() => {
    if (monsterHp <= 0 || hp <= 0) {
      onMissionEnd({
        /* complete with winning/losing details */
      });
    }
  });

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
    enemyWord,
  };
}
