import React, { useEffect, useState } from "react";
import Battle from "./Battle";
import "./BattleWrapper.scss";
import gameOverTheme from "../assets/game_over.mp3";
import winTheme from "../assets/you_win.mp3";
import { Howl } from "howler";
import WordBubble from "../WordBubble";
import { useTransitionState } from "../hooks";

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

  let rewards = [];
  if (battleState === "win") {
    if (
      savedMissionResult.missionObjectivePassed > 0 &&
      savedMissionResult.mission.rewards.spells
    ) {
      savedMissionResult.mission.rewards.spells.forEach((spell) => {
        rewards.push(
          `You can see a vision where ${spell.description.toLowerCase()}`
        );
        rewards.push(`You learned ${spell.displayName.toUpperCase()}!`);
      });
    }
    if (
      savedMissionResult.missionObjectivePassed > 0 &&
      savedMissionResult.mission.rewards.items
    ) {
      savedMissionResult.mission.rewards.items.forEach((item) => {
        rewards.push(
          `For your services to the people, they gave you a thing called ${item.displayName}!`
        );
        rewards.push(
          `Holding it, can see a vision where ${item.spell.description.toLowerCase()}`
        );
      });
    }
  }

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
          <div className="battle__title">
            You defeated {props.mission.monster.displayName}!
          </div>
          <div className="battle__subtitle">
            {savedMissionResult.missionObjectivePassed > 0
              ? "You also passed the objective!"
              : "But you didn't manage to accomplish the objective..."}
          </div>
          {rewards.map((line, i) => (
            <div key={i} className="battle__subtitle">
              {line}
            </div>
          ))}
          <button
            className="button"
            onClick={() => onMissionEnd(savedMissionResult)}
          >
            Continue
          </button>
        </div>
      );
      break;
    case "lose":
      element = (
        <div className="battle--lose-screen">
          <div className="battle__title">You lost!</div>
          <button
            className="button"
            onClick={async () => {
              await setBattleState("intro");
              setSavedMissionResult(null);
            }}
          >
            Try again
          </button>
          <button
            className="button"
            onClick={() => onMissionEnd(savedMissionResult)}
          >
            Return to mission select
          </button>
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
