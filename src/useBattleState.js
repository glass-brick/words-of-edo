import { useState, useCallback } from "react";

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
  const [monsterDistance, setMonsterDistance] = useState(3);
  const [enemyWord, setEnemyWord] = useState(null);
  const [log, addToLog] = useLog(5);

  return {
    hp,
    monsterHp,
    monsterDistance,
    log,
    onCompleteWord: () => {},
    onCompleteEnemyWord: () => {},
    onKeyStroke: () => {},
    enemyWord,
  };
}
