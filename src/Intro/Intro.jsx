import React from "react";
import edo from "../assets/edo.png";
import "./Intro.scss";
import data from "../data";

export default function Intro({ onMissionStart = () => {} }) {
  return (
    <div className="intro">
      <img src={edo} alt="Edo" />
      <div className="intro__menu">
        <h1 className="intro__menu__title">Words of Edo</h1>
        <div className="intro__menu__list">
          {data.missions.map((mission) => (
            <div
              className="intro__menu__list__item"
              onClick={() => onMissionStart(mission)}
            >
              <h2 className="intro__menu__list__item__title">
                {mission.title}
              </h2>
              <p className="intro__menu__list__item__description">
                {mission.description}
              </p>
              <img
                className="intro__menu__list__item__img"
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
