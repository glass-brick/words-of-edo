import React, { useState, useEffect, useCallback } from "react";
import Menu from "./Menu/Menu";
import data from "./data";
import Tutorial from "./Tutorial/Tutorial";
import BattleWrapper from "./Battle/BattleWrapper";
import { Howler } from "howler";
import { useLocalStorageObjectState, useTransitionState } from "./hooks";
import "./Game.scss";

function Game() {
  const [monk, setMonk] = useLocalStorageObjectState("monk", data.monk);
  const [muted, setMuted] = useState(localStorage.getItem("muted") === "true");
  const missions = Object.values(data.missionPool).filter((mission) => {
    if (monk.missionBeaten.includes(mission.name)) return false;
    const unlockers = mission.unlockedBy;
    return unlockers.every((unlocker) => monk.missionBeaten.includes(unlocker));
  });
  const [gameScreen, setGameScreen, transition] = useTransitionState(
    process.env.NODE_ENV === "production"
      ? { type: "intro" }
      : {
          type: "menu",
        }
  );

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
            const spells = [
              ...monk.spells,
              ...(results.rewards?.spells.filter(
                (spell) =>
                  !monk.spells.find((_spell) => spell.name === _spell.name)
              ) || []),
            ];
            setMonk({
              ...monk,
              missionBeaten: [...monk.missionBeaten, results.mission.name],
              spells,
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
        <div className="mute-button" onClick={() => setMuted(!muted)}>
          {muted ? "Unmute" : "Mute"}
        </div>
      </div>
    </>
  );
}

export default Game;
