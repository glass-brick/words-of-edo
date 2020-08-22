import React, { useEffect, useState, useCallback, useRef } from "react";
import "./Battle.scss";
import data from "./data.js";
import useBattleState from "./useBattleState";
import Dropdown from "./Battle/Dropdown";

function Room({
  onComplete = () => {},
  enemyWord,
  onEnemyComplete = () => {},
  onKeyStroke,
  monster,
}) {
  const [input, setInput] = useState("");

  useEffect(() => {
    const handler = (e) => {
      console.log(e);
      if (e.code.startsWith("Key") || e.code === "Space") {
        onKeyStroke();
        setInput((input) => `${input}${e.key}`);
      }
      if (e.code === "Enter") {
        onComplete(input);
        setInput("");
      }
    };

    document.addEventListener("keydown", handler);

    return () => document.removeEventListener("keydown", handler);
  }, [input, onComplete, onKeyStroke]);

  const [enemyInput, setEnemyInput] = useState("");

  const leftoverEnemyWord = enemyWord && enemyWord.substring(enemyInput.length);

  useEffect(() => {
    let id;
    if (leftoverEnemyWord) {
      id = setTimeout(() => {
        setEnemyInput((enemyInput) => `${enemyInput}${leftoverEnemyWord[0]}`);
        if (leftoverEnemyWord.length === 1) {
          setEnemyInput("");
          onEnemyComplete();
        }
      }, monster.msperkeystroke);
    }
    return () => {
      if (id) clearTimeout(id);
    };
  }, [monster, leftoverEnemyWord, onEnemyComplete]);

  return (
    <div className="room">
      <div className="room__player">
        <div className="room__speech">
          <span className="room__speech__said">{input}</span>
        </div>
      </div>
      <div className="room__enemy">
        {enemyWord && (
          <div className="room__speech">
            <span className="room__speech__said">{enemyInput}</span>
            <span className="room__speech__leftover">{leftoverEnemyWord}</span>
          </div>
        )}
        <img
          alt={monster.name}
          src={monster.sprite}
          style={{
            height: "300px",
          }}
        />
      </div>
    </div>
  );
}

function Header(props) {
  return (
    <header className="top-menu">
      <Dropdown title="Items" />
      <Dropdown title="Spells" options={Object.values(data.spells)} />
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
      />

      <div className="bottom-menu">
        <div className="bottom-menu__hp">HP: {state.hp}/1000</div>
        <div className="bottom-menu__objective-data">TBD</div>
        <div className="bottom-menu__objective">TBD</div>
        <ul className="bottom-menu__log">
          {state.log.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
