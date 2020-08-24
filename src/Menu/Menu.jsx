import React, { useState, useEffect } from "react";
import edo from "../assets/edo.png";
import "./Menu.scss";
import data from "../data";
import SpellBook from "../Battle/SpellBook";
import { Howl } from "howler";
import mainMenuTheme from "../assets/main_menu.mp3";
import WordBubble from "../WordBubble";

const mainMenuMusic = new Howl({ src: mainMenuTheme, loop: true });

export default function Menu({ onMissionStart = () => {}, missions, monk }) {
  const [resetGame, setResetGame] = useState(false);
  const [spellBookOpen, setSpellBookOpen] = useState(false);

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
        <h1 className="main__menu__title">Words of Edo</h1>
        <div className="main__menu__list">
          {missions.map((mission, i) => (
            <div
              className="main__menu__list__item"
              onClick={() => onMissionStart(mission)}
              key={i}
            >
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
        <div
          className="main__menu__button"
          onClick={() => setSpellBookOpen(true)}
        >
          Open SpellBook
        </div>

        <div
          className="main__menu__button"
          onClick={() => setResetGame(!resetGame)}
        >
          Reset game
        </div>
      </div>
    </div>
  );
}
