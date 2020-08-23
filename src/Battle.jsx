import React, { useState } from "react";
import "./Battle.scss";
import useBattleState from "./useBattleState";
import Room from "./Battle/Room";
import SpellBook from "./Battle/SpellBook";

export default function Battle({ monk, mission, onMissionEnd }) {
  const state = useBattleState({ monk, mission, onMissionEnd });
  let missionObj = '';
  if(mission.type === 'protect')
    missionObj = mission.type ? `${mission.displayObjective}: ${Math.round(state.objectiveHP / 10)}%` : '';
  const [spellBookOpen, setSpellBookOpen] = useState(false);

  return (
    <div className="battle">
      <header className="top-menu">
        <span
          className="top-menu__button"
          onClick={() => setSpellBookOpen(true)}
        >
          Spells
        </span>
      </header>

      <SpellBook
        spells={monk.spells}
        show={spellBookOpen}
        onClose={() => setSpellBookOpen(false)}
      />

      <Room
        enemySpell={state.enemyWord}
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
        <div className="bottom-menu__objective">{missionObj}</div>
        <ul className="bottom-menu__log">
          {state.log.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
