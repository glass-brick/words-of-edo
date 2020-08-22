import React, { useEffect, useState, useCallback } from "react";
import "./Battle.scss";
import data from "./data.js";
import useBattleState from "./useBattleState";

function Room({
  wordToTell,
  onComplete = () => {},
  enemyWord,
  onEnemyComplete = () => {},
}) {
  const [input, setInput] = useState("");

  const leftoverWord = wordToTell.substring(input.length);

  useEffect(() => {
    const handler = (e) => {
      if (
        leftoverWord &&
        e.key.toLowerCase() === leftoverWord[0].toLowerCase()
      ) {
        setInput((input) => `${input}${leftoverWord[0]}`);
        if (leftoverWord.length === 1) {
          setInput("");
          onComplete();
        }
      }
    };

    document.addEventListener("keydown", handler);

    return () => document.removeEventListener("keydown", handler);
  }, [leftoverWord, onComplete]);

  const [enemyInput, setEnemyInput] = useState("");

  const leftoverEnemyWord = enemyWord.substring(enemyInput.length);

  useEffect(() => {
    let id;
    if (leftoverEnemyWord) {
      id = setTimeout(() => {
        setEnemyInput((enemyInput) => `${enemyInput}${leftoverEnemyWord[0]}`);
        if (leftoverEnemyWord.length === 1) {
          setEnemyInput("");
          onEnemyComplete();
        }
      }, 500);
    }
    return () => {
      if (id) clearTimeout(id);
    };
  }, [leftoverEnemyWord, onEnemyComplete]);

  return (
    <div className="room">
      <div className="room__player">
        {wordToTell && (
          <div className="room__speech">
            <span className="room__speech__said">{input}</span>
            <span className="room__speech__leftover">{leftoverWord}</span>
          </div>
        )}
      </div>
      <div className="room__enemy">
        {enemyWord && (
          <div className="room__speech">
            <span className="room__speech__said">{enemyInput}</span>
            <span className="room__speech__leftover">{leftoverEnemyWord}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Battle(props) {
  const state = useBattleState({ monster: data.monsters[0] });

  return (
    <div className="battle">
      <header className="top-menu">
        <button className="top-menu__button">Items</button>
        <button className="top-menu__button">Spells</button>
      </header>

      <Room
        wordToTell="Azrath mithrion sinthos"
        enemyWord="Awante bokita"
        onComplete={() => {}}
        onEnemyComplete={() => {}}
      />

      <div className="bottom-menu">
        <div className="bottom-menu__hp">HP: 9/10</div>
        <div className="bottom-menu__objective-data">House: 100%</div>
        <div className="bottom-menu__objective">
          Objective: Don't burn the house
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
