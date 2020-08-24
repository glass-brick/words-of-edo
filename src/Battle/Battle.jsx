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
      ? `${mission.displayObjective}: ${Math.round(state.objectiveHP / 10)}%`
      : "";
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
        <Dropdown
          title="Items"
          options={state.monkItems}
          onSelect={(item) => state.onItemUse(item)}
        />
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
        <div className="bottom-menu__square bottom-menu__hp">
          <div className="bottom-menu__text">
            HP: {state.hp}/{monk.hp}
          </div>
        </div>
        <div className="bottom-menu__square bottom-menu__objective-data">
          <div className="bottom-menu__text">Enemy HP: {state.monsterHp}</div>
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
