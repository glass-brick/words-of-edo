import React, { useEffect, useState, useCallback, useRef } from "react";
import "./Battle.scss";
import data from "./data.js";
import useBattleState from "./useBattleState";
import Dropdown from "./Battle/Dropdown";
import Room from "./Battle/Room";

function Header(props) {
  return (
    <header className="top-menu">
      <Dropdown title="Items" />
      <Dropdown title="Spells" options={data.spellList} />
    </header>
  );
}

export default function Battle({ monster = data.monsters.monster_prototype }) {
  const state = useBattleState({ monster });

  return (
    <div className="battle">
      <Header />

      <Room
        enemyWord={state.enemyWord}
        onComplete={state.onCompleteWord}
        onEnemyComplete={state.onCompleteEnemyWord}
        onKeyStroke={state.onKeyStroke}
        monster={monster}
        monsterDistance = {state.monsterDistance}
      />

      <div className="bottom-menu">
        <div className="bottom-menu__hp">HP: {state.hp}/1000</div>
        <div className="bottom-menu__objective-data">
          Enemy HP: {state.monsterHp}
        </div>
        <div className="bottom-menu__objective">TBD DEBUG {state.monsterDistance}</div>
        <ul className="bottom-menu__log">
          {state.log.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
