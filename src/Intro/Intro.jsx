import React, { useState } from "react";
import edo from "../assets/edo.png";
import "./Intro.scss";
import data from "../data";
import arrowLeft from "../assets/arrow_left.png";

const introTexts = [
  "I don't yet know the words of Edo",
  "The only words I know here are Kanae, Roku and Mamoku",
  "With Roku I can burn them",
  "With Kanae I can hit them",
  "With Mamoku I can protect myself from them at the last minute",
  "The demons can use them too",
  "Their spells get stronger the closer they get",
  "But they can only move when they hear me chanting",
  "It is my duty to hunt these monsters and to take care of Edo's people",
];

export default function Intro({ onIntroEnd = () => {} }) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  return (
    <div className="intro">
      <div className="intro__text-box">
        <p className="intro__text-box__text">{introTexts[currentTextIndex]}</p>
        <div className="intro__text-box__arrow">
          <img
            onClick={() => {
              if (currentTextIndex < introTexts.length - 1) {
                setCurrentTextIndex(currentTextIndex + 1);
              } else {
                onIntroEnd();
              }
            }}
            src={arrowLeft}
            alt="Right"
            style={{
              transform: "scaleX(-1)",
              gridColumn: 3,
              float: "right",
              cursor: "pointer",
            }}
          />
        </div>
      </div>
    </div>
  );
}
