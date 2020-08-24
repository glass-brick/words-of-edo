import React from "react";
import edo from "../assets/edo.png";
import "./Menu.scss";
import data from "../data";

export default function Menu({ onMissionStart = () => {} }) {
  return (
    <div className="main">
      <img src={edo} alt="Edo" />
      <div className="main__menu">
        <h1 className="main__menu__title">Words of Edo</h1>
        <div className="main__menu__list">
          {data.missions.map((mission, i) => (
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
      </div>
    </div>
  );
}
