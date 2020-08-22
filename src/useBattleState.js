import { useState, useCallback } from "react";
import data from "./data.js";

function useLog(maxLines) {
  const [log, setLog] = useState([
    "A demon appears!",
    "Fire causes structural damage!",
    "The demon looks weakened...",
  ]);

  const addToLog = useCallback(
    (newItem) =>
      setLog((log) => {
        if (log.length > maxLines) {
          setLog([...log.slice(1), newItem]);
        } else {
          setLog([...log, newItem]);
        }
      }),
    [maxLines]
  );

  return [log, addToLog];
}

export default function useBattleState({ monster }) {
  const [hp, setHP] = useState(1000);
  const [monsterHp, setMonsterHP] = useState(monster.hp);
  const [monsterDistance, setMonsterDistance] = useState(data.maxStartingDistance);
  const [enemyWord, setEnemyWord] = useState(null);
  const [log, addToLog] = useLog(5);

  function onCompleteWord(spellUsed) {
    let damage = spellUsed.damage ? spellUsed.damage : 0;
    setMonsterHP(monsterHp - damage);
  }

  function onCompleteEnemyWord(spellUsed) {
    let damage = getPlayerDamageFunction(spellUsed.damage, monsterDistance);
    setHP(hp - damage);
  }

  function getPlayerDamageFunction(baseDamage, distance) {
    return baseDamage * (10 - distance);
  }

  function onKeyStroke() {
    if (!enemyWord) { // If we have an enemy word it is attacking
      // tries to attack
      if(Math.random() < monster.attackchance) {
        // Starts attacking
        setEnemyWord(monster.spells[0].name);
      } else {
        // Moves
        setMonsterDistance(monsterDistance - monster.speed)
      }
    } // if it's attacking, it has its own logic
  }

  return {
    hp,
    monsterHp,
    monsterDistance,
    log,
    onCompleteWord: (spellUsed) => {onCompleteWord(spellUsed)},
    onCompleteEnemyWord: (spellUsed) => {onCompleteEnemyWord(spellUsed)},
    onKeyStroke: () => {onKeyStroke()},
    enemyWord,
  };
}
