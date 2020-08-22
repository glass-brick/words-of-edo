import React from "react";
import "./Battle.css";

export default function Battle(props) {
  return (
    <div>
      <header>
        <button>Items</button>
        <button>Spells</button>
      </header>

      <div className="room">
        <div className="room__player">
          <div className="room__player__speech"></div>
        </div>
        <div className="room__enemy">
          <div className="room__enemy__speech"></div>
        </div>
      </div>

      <div className="bottom-menu">
        <div className="bottom-menu__hp"></div>
        <div className="bottom-menu__enemy-hp"></div>
        <div className="bottom-menu__objective"></div>
        <div className="bottom-menu__log"></div>
      </div>
    </div>
  );
}
