import React, { useEffect, useState } from "react";
import Battle from "../Battle";
import { useTransitionState } from "../Game";
import "./BattleWrapper.scss";

export default function BattleWrapper({ onMissionEnd, ...props }) {
  const [battleState, setBattleState, transition] = useTransitionState("intro");
  const [savedMissionResult, setSavedMissionResult] = useState(null);

  const handleMissionEnd = (missionResult) => {
    setBattleState(missionResult.monkDead ? "lose" : "win");
    setSavedMissionResult(missionResult);
  };

  let element;
  switch (battleState) {
    case "intro":
      element = (
        <div className="battle--intro">
          <div className="battle__title">
            Battle against {props.mission.monster.displayName}
          </div>
          <button className="button" onClick={() => setBattleState("battle")}>
            Start the match
          </button>
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
            {savedMissionResult.missionObjectivePassed
              ? "You also passed the objective!"
              : "But you didn't manage to accomplish the objective..."}
          </div>
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
