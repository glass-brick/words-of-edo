import React, { useEffect, useState, useRef } from "react";
import "./Room.scss";
import data from "../data.js";
import priest from "../assets/priest.png";
import { createPortal } from "react-dom";

export default function Room({
  onComplete = () => {},
  enemyWord,
  onEnemyComplete = () => {},
  onKeyStroke,
  monster,
  monsterDistance,
}) {
  const scale = monsterDistance * -0.1875 + 2.3125;
  const enemyRef = useRef(null);
  const enemyPos = enemyRef.current
    ? enemyRef.current.getBoundingClientRect()
    : {};

  const [input, setInput] = useState("");

  useEffect(() => {
    const handler = (e) => {
      if (e.code.startsWith("Key") || e.code === "Space") {
        onKeyStroke();
        setInput((input) => `${input}${e.key}`);
      }
      if (e.code === "Backspace") {
        setInput((input) => input.slice(0, -1));
      }
      if (e.code === "Enter") {
        const matchedSpell = data.spellList.find(
          (spell) => spell.displayName.toLowerCase() === input.toLowerCase()
        );
        // matchedSpell can be null
        onComplete(matchedSpell);
        setInput("");
      }
    };

    document.addEventListener("keydown", handler);

    return () => document.removeEventListener("keydown", handler);
  }, [input, onComplete, onKeyStroke]);

  const [enemyInput, setEnemyInput] = useState("");

  const leftoverEnemyWord =
    enemyWord && enemyWord.displayName.substring(enemyInput.length);

  useEffect(() => {
    let id;
    if (leftoverEnemyWord) {
      id = setTimeout(() => {
        setEnemyInput((enemyInput) => `${enemyInput}${leftoverEnemyWord[0]}`);
        if (leftoverEnemyWord.length === 1) {
          setEnemyInput("");
          onEnemyComplete(enemyWord);
        }
      }, monster.msperkeystroke);
    }
    return () => {
      if (id) clearTimeout(id);
    };
  }, [enemyWord, monster, leftoverEnemyWord, onEnemyComplete]);

  return (
    <div className="room">
      <div
        className="room__enemy"
        ref={enemyRef}
        style={{
          transform: `translate(${130 * monsterDistance - 910}px, ${
            -60 * monsterDistance + 420
          }px) scale(${scale})`,
        }}
      >
        {enemyWord &&
          createPortal(
            <div
              className="room__speech"
              style={{
                position: "absolute",
                left: enemyPos.left - enemyWord.displayName.length * 5 * scale,
                top: enemyPos.top,
              }}
            >
              <span className="room__speech__said">{enemyInput}</span>
              <span className="room__speech__leftover">
                {leftoverEnemyWord}
              </span>
            </div>,
            document.getElementById("portal-root")
          )}
        <img
          alt={monster.name}
          src={monster.sprite}
          style={{
            height: "300px",
          }}
        />
      </div>
      <div className="room__player">
        {input && (
          <div className="room__speech">
            <span className="room__speech__said">{input}</span>
          </div>
        )}
        <img alt="Priest" src={priest} />
      </div>
    </div>
  );
}
