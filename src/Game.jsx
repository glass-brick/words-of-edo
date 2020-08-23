import React, { useState, useEffect } from "react";
import Battle from "./Battle";
import Intro from "./Intro/Intro";
import data from "./data";

function Game() {
  const [monk, setMonk] = useState(data.monk);
  const [currentMission, setCurrentMission] = useState(data.missions[0]);
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
            monk={monk}
            mission={currentMission}
            onMissionEnd={(results) => {
              if(results.rewards){
                if(results.rewards.spells){
                  // here we check if the monk already has these spells 
                  let newSpells = [];
                  results.rewards.spells.forEach(spell => {
                    let monkHasIt = false;
                    monk.spells.forEach(monkSpell => {
                      if( monkSpell.name === spell.name){
                        monkHasIt = true;
                        return ;
                      }
                    })
                    if( !monkHasIt ) newSpells.push(spell);
                  });
                  setMonk({...monk, spells: [...monk.spells, ...newSpells]});
                }
              }
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
