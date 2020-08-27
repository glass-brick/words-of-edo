import React, { useEffect, useState } from "react";
import Battle from "./Battle";
import "./BattleWrapper.scss";
import gameOverTheme from "../assets/music/game_over.mp3";
import winTheme from "../assets/music/you_win.mp3";
import { Howl } from "howler";
import WordBubble from "../WordBubble";
import { useTransitionState } from "../hooks";
import Cursor from "../Cursor";

const gameOverMusic = new Howl({ src: gameOverTheme });
const winMusic = new Howl({ src: winTheme });

export default function BattleWrapper({ onMissionEnd, ...props }) {
  const [battleState, setBattleState, transition] = useTransitionState("intro");
  const [savedMissionResult, setSavedMissionResult] = useState(null);

  const handleMissionEnd = (missionResult) => {
    setBattleState(missionResult.monkDead ? "lose" : "win");
    setSavedMissionResult(missionResult);
  };

  useEffect(() => {
    if (battleState === "lose") {
      gameOverMusic.play();
    }
    return () => gameOverMusic.stop();
  }, [battleState]);

  useEffect(() => {
    if (battleState === "win") {
      winMusic.play();
    }
    return () => winMusic.stop();
  }, [battleState]);

  let element;
  switch (battleState) {
    case "intro":
      element = (
        <div className="battle--intro">
          <div className="battle__title">
            Battle against {props.mission.monster.displayName}
          </div>
          <WordBubble
            wordToWrite="Gambatte"
            onFinish={() => setBattleState("battle")}
            pos={{ left: 430, top: 300 }}
          />
        </div>
      );
      break;
    case "win":
      element = (
        <div className="battle--win-screen">
          <Cursor
            enterHandlers={{
              returnToMenu: () => onMissionEnd(savedMissionResult),
            }}
          />
          <div className="battle__title">
            You defeated {props.mission.monster.displayName}!
          </div>
          <div className="battle__subtitle">
            {savedMissionResult.missionObjectivePassed > 0
              ? "You also passed the objective!"
              : "But you didn't manage to accomplish the objective..."}
          </div>
          {savedMissionResult.mission.rewards.spells.map((spell, i) => (
            <React.Fragment key={i}>
              <div className="battle__subtitle">
                You can see a vision where {spell.description.toLowerCase()}
              </div>
              <div className="battle__subtitle">
                You learned {spell.displayName.toUpperCase()}!
              </div>
            </React.Fragment>
          ))}
          <div data-cursor-id="returnToMenu" className="button">
            Continue
          </div>
        </div>
      );
      break;
    case "lose":
      element = (
        <div className="battle--lose-screen">
          <Cursor
            enterHandlers={{
              tryAgain: async () => {
                await setBattleState("intro");
                setSavedMissionResult(null);
              },
              returnToMenu: () => onMissionEnd(savedMissionResult),
            }}
          />
          <div className="battle__title">You lost!</div>
          <div data-cursor-id="tryAgain" className="button">
            Try again
          </div>
          <div data-cursor-id="returnToMenu" className="button">
            Return to mission select
          </div>
        </div>
      );
      break;
    case "battle":
    default:
      element = <Battle {...props} onMissionEnd={handleMissionEnd} />;
      break;
  }

  return (
    <>
      {transition && <div className="transition" />}
      {element}
    </>
  );
}
