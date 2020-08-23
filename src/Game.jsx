import React, { useState, useEffect } from "react";
import Battle from "./Battle";
import Intro from "./Intro/Intro";
import data from "./data";

function Game() {
  const [currentMission, setCurrentMission] = useState(null);
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

  return (
    <>
      <div className="game-app">
        {transition && <div className="transition" />}
        {currentMission ? (
          <Battle
            mission={currentMission}
            onMissionEnd={() => {
              if (!transition) setTransition(true);
              setTimeout(() => {
                setCurrentMission(null);
              }, 500);
            }}
          />
        ) : (
          <Intro
            onMissionStart={(mission) => {
              if (!transition) setTransition(true);
              setTimeout(() => {
                setCurrentMission(mission);
              }, 500);
            }}
          />
        )}
      </div>
      <div id="portal-root"></div>
    </>
  );
}

export default Game;
