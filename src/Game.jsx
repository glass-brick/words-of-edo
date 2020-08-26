import React, { useState, useEffect, useCallback } from "react";
import Menu from "./Menu/Menu";
import data from "./data";
import Tutorial from "./Tutorial/Tutorial";
import BattleWrapper from "./Battle/BattleWrapper";
import { Howler } from "howler";
import { useLocalStorageObjectState, useTransitionState } from "./hooks";

function Game() {
  const [monk, setMonk] = useLocalStorageObjectState("monk", data.monk);
  const [gameScreen, setGameScreen, transition] = useTransitionState({
    type: "menu",
  });
  const [muted, setMuted] = useState(localStorage.getItem("muted") === "true");
  const missions = Object.values(data.missionPool).filter((mission) => {
    if (monk.missionBeaten.includes(mission.name)) return false;
    const unlockers = mission.unlockedBy;
    return unlockers.every((unlocker) => monk.missionBeaten.includes(unlocker));
  });

  useEffect(() => {
    if (muted) {
      Howler.volume(0);
      localStorage.setItem("muted", "true");
    } else {
      Howler.volume(1);
      localStorage.setItem("muted", "false");
    }
  }, [muted]);

  let currentScreen;

  switch (gameScreen.type) {
    case "intro":
      currentScreen = (
        <Tutorial
          onTutorialEnd={() => {
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
            setGameScreen({ type: "menu" });
            // If monk is dead, return to screen as if nothing happened
            if (results.monkDead) {
              return;
            }
            let newItems = [];
            let newSpells = [];
            let finalItems = [...monk.items];
            let finalSpells = [...monk.spells];

            if (results.usedItems) {
              let oldItems = monk.items;
              let usedItems = [];
              let used;
              results.usedItems.forEach(function (item) {
                usedItems.push(item);
              });
              for (let i = 0; i < oldItems.length; i++) {
                used = false;
                for (let j = 0; j < usedItems.length; j++) {
                  if (usedItems[j].name === oldItems[i].name) {
                    used = true;
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
                (results.mission.type === "protect" &&
                  results.missionObjectivePassed > 0))
            ) {
              if (results.rewards.spells) {
                // here we check if the monk already has these spells
                newSpells = [];
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
              missionBeaten: [...monk.missionBeaten, results.mission.name],
            });
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
          missions={missions}
          monk={monk}
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
      <div id="portal-root">
        <button className="mute-button" onClick={() => setMuted(!muted)}>
          {muted ? "Unmute" : "Mute"}
        </button>
      </div>
    </>
  );
}

export default Game;
