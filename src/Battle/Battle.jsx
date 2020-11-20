import "./Battle.scss";
import useBattleState from "./useBattleState";
import Room from "./Room";
import BattleMenu from "./BattleMenu";

export default function Battle({ monk, mission, onMissionEnd }) {
  const state = useBattleState({ monk, mission, onMissionEnd });

  return (
    <div className="battle">
      <Room battleState={state} monk={monk} mission={mission} />
      <BattleMenu state={state} monk={monk} mission={mission} />
    </div>
  );
}
