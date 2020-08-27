/* eslint-disable default-case */
import { useState, useCallback, useEffect } from "react";
import data from "../data.js";

// Music & Sound
import { Howl } from "howler";
import musicSrc from "../assets/music/battle1.mp3";

function useLog(maxLines) {
  const [log, setLog] = useState([{ pos: 0, text: "A demon appears!" }]);

  const addToLog = useCallback(
    (newText) =>
      setLog((log) => {
        const newItem = { pos: log[log.length - 1].pos + 1, text: newText };
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

const possibleMusic = [musicSrc];

let musicChoice = Math.floor(Math.random() * possibleMusic.length);
const music = new Howl({
  src: [possibleMusic[musicChoice]],
  loop: true,
});

function useHP(initialHP) {
  const [hp, setHP] = useState(initialHP);

  return [hp, (hp) => setHP(Math.round(hp))];
}

function getPlayerDamageFunction(baseDamage, distance) {
  return baseDamage * (10 - distance);
}

function useBuffState(initialState = {}) {
  const [buffs, setBuffs] = useState(initialState);

  const setBuffsObject = useCallback((newBuffValues) => {
    setBuffs((buffs) => ({ ...buffs, ...newBuffValues }));
  }, []);

  return [buffs, setBuffsObject];
}

export default function useBattleState({ monk, mission, onMissionEnd }) {
  const { monster } = mission;
  const [hp, setHP] = useHP(monk.hp);
  const [monsterHp, setMonsterHP] = useHP(monster.hp);
  const [objectiveHP, setObjectiveHP] = useHP(mission.objectiveHP);
  const [monsterDistance, setMonsterDistance] = useState(
    data.utils.maxStartingDistance
  );
  const [enemySpell, setEnemySpell] = useState(null);
  const [log, addToLog] = useLog(5);
  const [playerBuffs, setPlayerBuffs] = useBuffState({
    defense: null,
    defenseMirror: null,
    defenseBoosted: null,
    boosted: null,
  });
  const [enemyBuffs, setEnemyBuffs] = useBuffState({
    defense: null,
    defenseMirror: null,
    defenseBoosted: null,
    boosted: null,
  });
  const [monkItems, setMonkItems] = useState(monk.items);
  const [usedItems, setUsedItems] = useState([]);
  const [battleRunning, setBattleRunning] = useState(true);

  useEffect(() => {
    if (mission.name === 0) {
      addToLog("Press (1) at any time to open the spellbook");
      addToLog("Try writing one of your spells!");
    }
  }, [addToLog, mission.name]);

  useEffect(() => {
    music.volume(1);
    music.play();

    return () => music.stop();
  }, []);

  function onCompleteWord(spellUsed) {
    if (spellUsed) {
      setPlayerBuffs({
        defense: null,
        defenseMirror: null,
        defenseBoosted: null,
      });
      let boosted = false;
      if (playerBuffs.boost && playerBuffs.boost >= spellUsed.level) {
        boosted = true;
        if (spellUsed.special !== "boost") setPlayerBuffs({ boosted: null });
      }
      attackOnOpponent(spellUsed, boosted);
    } else {
      addToLog("That isn't a word of power!");
    }
  }

  function attackOnOpponent(spellUsed, boosted) {
    let damage = spellUsed.damage ? spellUsed.damage : 0;
    let boostValue = boosted ? data.utils.boostMultipliers[boosted] : 1;

    damage *= boostValue;

    setMonsterHP(monsterHp - damage);

    // specials logic
    // Specials refer to extra effects on creatures
    if (spellUsed.special) {
      let finalDistance;
      switch (spellUsed.special) {
        case "defense_response":
          // Defense does nothing against a spell that is not being cast
          if (enemySpell) {
            addToLog("You feel protected");
            setPlayerBuffs({ defense: spellUsed.level });
            if (boosted) setPlayerBuffs({ defenseBoosted: boosted });
          } else {
            addToLog("There is nothing to protect against!");
          }
          break;
        case "defense_mirror":
          // Defense does nothing against a spell that is not being cast
          if (enemySpell) {
            setPlayerBuffs({ defenseMirror: spellUsed.level });
            if (boosted) setPlayerBuffs({ defenseBoosted: boosted });
          }
          break;
        case "push":
          finalDistance =
            monsterDistance +
            spellUsed.displayName.length * monster.speed * 1.5 * boostValue;
          addToLog("The monster is pushed away!");
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
          addToLog("The monster is pulled closer!");
          if (finalDistance < data.utils.minStartingDistance) {
            finalDistance = data.utils.minStartingDistance;
            addToLog("It can't go any closer");
          }
          setMonsterDistance(finalDistance);
          break;
        case "self_heal":
          setHP(hp + spellUsed.level * data.utils.healAmount * boostValue);
          addToLog("You feel your wounds closing up...");
          break;
        case "boost":
          addToLog("You feel stronger than ever!");
          setPlayerBuffs({ boosted: spellUsed.level });
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
        if (mission.displayObjective.toLowerCase() === "noise") {
          addToLog(`The noise is upsetting the customers!`);
        } else {
          addToLog(
            `The ${mission.displayObjective.toLowerCase()} seems damaged`
          );
        }
      }
    }
  }

  function onCompleteEnemyWord(spellUsed) {
    let damage = getPlayerDamageFunction(spellUsed.damage, monsterDistance);
    let boosted = playerBuffs.defenseBoosted
      ? data.utils.boostMultipliers[playerBuffs.defenseBoosted]
      : 1;
    if (playerBuffs.defense) {
      damage *= data.utils.defenseMultipliers[playerBuffs.defense] / boosted;
      setPlayerBuffs({ defense: null });
      addToLog("Your words protected you!");
      addToLog("The protection vanishes");
    }
    if (playerBuffs.defenseMirror) {
      setMonsterHP(
        monsterHp -
          data.utils.mirrorMultipliers[playerBuffs.defenseMirror] *
            damage *
            boosted
      );
      setPlayerBuffs({ defenseMirror: null });
      addToLog("Your words turned the attack back on the monster!");
      addToLog("The mirror vanishes");
    }

    if (damage > 0) {
      addToLog("You feel wounded");
    } else if (damage === 0) {
      addToLog("The attack doesn't seem to damage you");
    }

    setHP(hp - damage);
    setEnemySpell(null);
  }

  function onKeyStroke() {
    if (!enemySpell) {
      // If we have an enemy word it is attacking
      // tries to attack
      if (Math.random() < monster.attackchance) {
        // choose attack
        const randomChoice = Math.random();
        let advance = 0;
        const attack = monster.spells.find((attack, i) => {
          advance += attack.chances;
          return randomChoice < advance;
        })?.spell;

        // Starts attacking
        setEnemySpell(attack);
        addToLog("The monster starts chanting...");
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
    if (battleRunning && (monsterHp <= 0 || hp <= 0)) {
      setBattleRunning(false);
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
  }, [
    monsterHp,
    hp,
    battleRunning,
    mission,
    onMissionEnd,
    usedItems,
    objectiveHP,
  ]);

  return {
    hp,
    monsterHp,
    monsterDistance,
    log,
    onCompleteWord,
    onCompleteEnemyWord,
    onKeyStroke,
    onItemUse,
    enemySpell,
    objectiveHP,
    monkItems,
    playerBuffs,
  };
}
