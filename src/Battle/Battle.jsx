import React, { useState } from "react";
import "./Battle.scss";
import useBattleState from "./useBattleState";
import Room from "./Room";
import SpellBook from "./SpellBook";
import Dropdown from "./Dropdown";

export default function Battle({ monk, mission, onMissionEnd }) {
  const state = useBattleState({ monk, mission, onMissionEnd });
  let missionObj = "";
  if (mission.type === "protect")
    missionObj = mission.type
      ? `${mission.displayObjective}: ${Math.round(
          (state.objectiveHP / mission.objectiveHP) * 100
        )}%`
      : "";
  const [spellBookOpen, setSpellBookOpen] = useState(false);

  return (
    <div className="battle">
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
        monsterDistance={state.monsterDistance}
        monk={monk}
        mission={mission}
      />

      <div className="bottom-menu">
        <div
          className="bottom-menu__square bottom-menu__spell"
          onClick={() => setSpellBookOpen(true)}
        >
          <div className="bottom-menu__button">Open spellbook</div>
        </div>
        <div className="bottom-menu__square bottom-menu__hp">
          <div className="bottom-menu__text">
            HP: {Math.max(state.hp, 0)}/{monk.hp}
          </div>
        </div>
        <div className="bottom-menu__square bottom-menu__objective-data">
          <div className="bottom-menu__text">
            Enemy HP: {Math.max(state.monsterHp, 0)}
          </div>
        </div>
        <div className="bottom-menu__square bottom-menu__objective">
          <div className="bottom-menu__text">{missionObj}</div>
        </div>
        <ul className="bottom-menu__log">
          {state.log.map((line, i) => (
            <li className="bottom-menu__log__line" key={i}>
              {line}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
