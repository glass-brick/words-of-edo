import { useState, useCallback } from "react";
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

export default function useBattleState({ monster }) {
  const [hp, setHP] = useState(1000);
  const [monsterHp, setMonsterHP] = useState(monster.hp);
  const [monsterDistance, setMonsterDistance] = useState(
    data.utils.maxStartingDistance
  );
  const [enemyWord, setEnemyWord] = useState(null);
  const [log, addToLog] = useLog(5);
  const [defense, setDefense] = useState(null);

  function onCompleteWord(spellUsed) {
    if (spellUsed) {
      let damage = spellUsed.damage ? spellUsed.damage : 0;
      setMonsterHP(monsterHp - damage);

      // specials logic
      // Specials refer to extra effects on creatures
      if (spellUsed.special) {
        switch (spellUsed.special) {
          case "defense_response":
            // Defense does nothing against a spell that is not being cast
            if (monsterDistance.enemyWord) {
              setDefense(spellUsed.level);
            }
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
    setHP(hp - damage);
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
