import React, { useState, useEffect, useCallback } from "react";
import Menu from "./Menu/Menu";
import data from "./data";
import Intro from "./Intro/Intro";
import BattleWrapper from "./Battle/BattleWrapper";

export function useTransitionState(initialState) {
  const [state, setState] = useState(initialState);
  const [transition, setTransition] = useState(false);

  useEffect(() => {
    let id1;
    if (transition) {
      id1 = setTimeout(() => {
        setTransition(false);
      }, 1000);
    }
    return () => {
      clearTimeout(id1);
    };
  }, [transition]);

  const transitionTo = useCallback(
    (newState) =>
      new Promise((resolve) => {
        if (!transition) setTransition(true);
        setTimeout(() => {
          setState(newState);
          resolve();
        }, 500);
      }),
    [transition]
  );

  return [state, transitionTo, transition];
}

function Game() {
  const [monk, setMonk] = useState(data.monk);
  const [gameScreen, setGameScreen, transition] = useTransitionState({
    // type: localStorage.getItem("introComplete") === "true" ? "menu" : "intro", <- play intro only once
    type: "intro",
  });

  let currentScreen;

  switch (gameScreen.type) {
    case "intro":
      currentScreen = (
        <Intro
          onIntroEnd={() => {
            localStorage.setItem("introComplete", "true");
            setGameScreen({ type: "menu" });
          }}
        />
      );
      break;
    case "mission":
      currentScreen = (
        <BattleWrapper
          monk={monk}
          mission={gameScreen.mission}
          onMissionEnd={(results) => {
            let newItems = [];
            let newSpells = [];
            let finalItems = [...monk.items];
            let finalSpells = [...monk.spells];

            if (results.usedItems) {
              let oldItems = monk.items;
              let usedItems = [];
              let used;
              let objectUsed;
              let indexUsed;
              results.usedItems.forEach(function (item) {
                usedItems.push(item);
              });
              for (let i = 0; i < oldItems.length; i++) {
                used = false;
                objectUsed = null;
                for (let j = 0; j < usedItems.length; j++) {
                  if (usedItems[j].name === oldItems[i].name) {
                    used = true;
                    indexUsed = j;
                    break;
                  }
                }
                if (!used) {
                  newItems.push(oldItems[i]);
                }
              }
              if (results.rewards?.items) {
                finalItems = [...newItems, ...results.rewards.items];
              } else {
                finalItems = newItems;
              }
            } else {
              if (results.rewards?.items) {
                finalItems = [...monk.items, ...results.rewards.items];
              }
            }
            if (
              results.rewards &&
              (results.mission.type !== "protect" ||
                (results.mission.type === "protect" && results.objectiveHP > 0))
            ) {
              if (results.rewards.spells) {
                // here we check if the monk already has these spells
                let newSpells = [];
                results.rewards.spells.forEach((spell) => {
                  let monkHasIt = false;
                  monk.spells.forEach((monkSpell) => {
                    if (monkSpell.name === spell.name) {
                      monkHasIt = true;
                    }
                  });
                  if (!monkHasIt) newSpells.push(spell);
                });
                finalSpells = [...monk.spells, ...newSpells];
              }
            }
            setMonk({
              ...monk,
              spells: [...finalSpells],
              items: [...finalItems],
            });
            setGameScreen({ type: "menu" });
          }}
        />
      );
      break;
    case "menu":
    default:
      currentScreen = (
        <Menu
          onMissionStart={(mission) => {
            setGameScreen({ type: "mission", mission });
          }}
        />
      );
      break;
  }

  return (
    <>
      <div className="game-app">
        {transition && <div className="transition" />}
        {currentScreen}
      </div>
      <div id="portal-root"></div>
    </>
  );
}

export default Game;
