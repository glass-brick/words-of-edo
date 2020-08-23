import React, { useState, useEffect, useCallback } from "react";
import Battle from "./Battle";
import Menu from "./Menu/Menu";
import data from "./data";
import Intro from "./Intro/Intro";

function useTransitionState(initialState) {
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
        <Battle
          monk={monk}
          mission={gameScreen.mission}
          onMissionEnd={(results) => {
            if (results.rewards) {
              if (results.rewards.spells) {
                // here we check if the monk already has these spells
                let newSpells = [];
                results.rewards.spells.forEach((spell) => {
                  let monkHasIt = false;
                  monk.spells.forEach((monkSpell) => {
                    if (monkSpell.name === spell.name) {
                      monkHasIt = true;
                      return;
                    }
                  });
                  if (!monkHasIt) newSpells.push(spell);
                });
                setMonk({ ...monk, spells: [...monk.spells, ...newSpells] });
              }
            }
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
