import React from "react";
import "./Battle.scss";
import data from "./data.js";
import useBattleState from "./useBattleState";
import Dropdown from "./Battle/Dropdown";
import Room from "./Battle/Room";
import {Howl, Howler} from 'howler';

export default function Battle({ monk, mission, onMissionEnd }) {
  const state = useBattleState({ monk, mission, onMissionEnd });
  let missionObjName;
  if( mission.type == 'protect_house' ) missionObjName = 'House'; 
  if( mission.type == 'protect_library' ) missionObjName = 'Library'; 
  if( mission.type == 'protect_people' ) missionObjName = 'People'; 
  let missionObj = mission.type ? `${missionObjName}: ${Math.round(state.objectiveHP / 10)}%` : '';


  return (
    <div className="battle">
      <header className="top-menu">
        <Dropdown title="Items" />
        <Dropdown title="Spells" options={monk.spells} />
      </header>

      <Room
        enemyWord={state.enemyWord}
        onComplete={state.onCompleteWord}
        onEnemyComplete={state.onCompleteEnemyWord}
        onKeyStroke={state.onKeyStroke}
        monster={mission.monster}
        monsterDistance={state.monsterDistance}
        monk={monk}
      />

      <div className="bottom-menu">
        <div className="bottom-menu__hp">
          HP: {state.hp}/{monk.hp}
        </div>
        <div className="bottom-menu__objective-data">
          Enemy HP: {state.monsterHp}
        </div>
        <div className="bottom-menu__objective">
          {missionObj} DEBUG {state.monsterDistance}
        </div>
        <ul className="bottom-menu__log">
          {state.log.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
