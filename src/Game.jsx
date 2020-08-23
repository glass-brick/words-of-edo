import React, { useState, useEffect } from "react";
import Battle from "./Battle";
import Intro from "./Intro/Intro";

function Game() {
  const [currentMission, setCurrentMission] = useState(null);
  const [transition, setTransition] = useState(null);

  useEffect(() => {
    let id1, id2;
    if (transition !== null) {
      id1 = setTimeout(() => {
        setCurrentMission(transition);
      }, 500);
      id2 = setTimeout(() => {
        setTransition(null);
      }, 1000);
    }
    return () => {
      clearTimeout(id1);
      clearTimeout(id2);
    };
  }, [transition]);

  return (
    <>
      <div className="game-app">
        {transition && <div className="transition" />}
        {currentMission ? (
          <Battle monster={currentMission.monster} />
        ) : (
          <Intro
            onMissionStart={(mission) => {
              if (!transition) setTransition(mission);
            }}
          />
        )}
      </div>
      <div id="portal-root"></div>
    </>
  );
}

export default Game;
