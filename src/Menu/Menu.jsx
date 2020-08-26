import React, { useState, useEffect } from "react";
import edo from "../assets/edo.png";
import "./Menu.scss";
import SpellBook from "../Battle/SpellBook";
import { Howl } from "howler";
import mainMenuTheme from "../assets/main_menu.mp3";
import WordBubble from "../WordBubble";
import cursor from "../assets/cursor.png";
import { useGlobalKeypress } from "../hooks";

const mainMenuMusic = new Howl({ src: mainMenuTheme, loop: true });

const cursorPositions = {
  mission1: {
    top: 100,
    right: 460,
  },
  mission2: {
    top: 200,
    right: 460,
  },
  mission3: {
    top: 300,
    right: 460,
  },
  spellBook: {
    bottom: 65,
    right: 325,
  },
  reset: {
    bottom: 18,
    right: 315,
  },
};

export default function Menu({ onMissionStart = () => {}, missions, monk }) {
  const [resetGame, setResetGame] = useState(false);
  const [spellBookOpen, setSpellBookOpen] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const orderedItems = [
    ...missions.map((_, i) => `mission${i + 1}`),
    "spellBook",
    "reset",
  ];
  const selectedItem = orderedItems[selectedItemIndex];

  const enterHandlers = {
    mission1: () => onMissionStart(missions[0]),
    mission2: () => onMissionStart(missions[1]),
    mission3: () => onMissionStart(missions[2]),
    spellBook: () => setSpellBookOpen(true),
    reset: () => setResetGame(!resetGame),
  };
  const screenFrozen = resetGame || spellBookOpen;

  useGlobalKeypress((e) => {
    if (!screenFrozen) {
      if (["ArrowLeft", "ArrowUp"].includes(e.code)) {
        setSelectedItemIndex(
          selectedItemIndex - 1 < 0
            ? orderedItems.length - 1
            : selectedItemIndex - 1
        );
      } else if (["ArrowRight", "ArrowDown"].includes(e.code)) {
        setSelectedItemIndex((selectedItemIndex + 1) % orderedItems.length);
      } else if (e.code === "Enter") {
        enterHandlers[selectedItem]();
      }
    }
  });

  useEffect(() => {
    mainMenuMusic.play();

    return () => mainMenuMusic.stop();
  }, []);

  return (
    <div className="main">
      <SpellBook
        spells={monk.spells}
        show={spellBookOpen}
        onClose={() => setSpellBookOpen(false)}
      />
      {resetGame && (
        <WordBubble
          wordToWrite="I want to reset everything"
          onFinish={() => {
            localStorage.clear();
            window.location.reload(false);
          }}
          pos={{
            top: 300,
            left: 300,
          }}
          onEscape={() => {
            setResetGame(false);
          }}
        />
      )}
      <img src={edo} alt="Edo" />
      <div className="main__menu">
        <img
          className="main__menu__cursor"
          alt="Cursor"
          src={cursor}
          style={{
            ...cursorPositions[selectedItem],
            opacity: screenFrozen ? 0 : 1,
          }}
        />
        <h1 className="main__menu__title">Words of Edo</h1>
        <div className="main__menu__list">
          {missions.map((mission, i) => (
            <div className="main__menu__list__item" key={i}>
              <h2 className="main__menu__list__item__title">{mission.title}</h2>
              <p className="main__menu__list__item__description">
                {mission.description}
              </p>
              <img
                className="main__menu__list__item__img"
                alt="Monster"
                src={mission.image}
              />
            </div>
          ))}
        </div>
        <div className="main__menu__button">Open SpellBook</div>
        <div className="main__menu__button">Reset game</div>
      </div>
    </div>
  );
}
