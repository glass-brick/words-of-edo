import React, { useState, useEffect } from "react";
import "./Intro.scss";
import data from "../data";
import arrowLeft from "../assets/arrow_left.png";
import { createPortal } from "react-dom";

const initialWord = "Gambatte";

const introTexts = [
  "I don't yet know the words of Edo",
  <>
    The only words I know here are <b>Roku</b>, <b>Osumaki</b> and <b>Mamoku</b>
  </>,
  <>
    With <b>Roku</b> I can burn them
  </>,
  <>
    With <b>Osumaki</b> I can push them away
  </>,
  <>
    With <b>Mamoku</b> I can protect myself from them at the last minute
  </>,
  "The demons can use them too",
  "Their spells get stronger the closer they get",
  "But they can only move when they hear me chanting",
  "It is my duty to hunt these monsters and to take care of Edo's people",
  "...",
  "There is also another word my master used",
  "It held no power, but he always told me it was good luck to use it before a fight",
  <>
    I should press <b>[ENTER]</b> when I'm sure this is what I want to say
  </>,
];

export default function Intro({ onIntroEnd = () => {} }) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [input, setInput] = useState("");

  const leftoverWord = initialWord.substring(input.length);

  useEffect(() => {
    let handler = () => {};
    if (currentTextIndex === introTexts.length - 1) {
      handler = (e) => {
        if (e.code === "Enter") {
          if (leftoverWord.length === 0) {
            onIntroEnd();
          } else {
            setInput("");
          }
        } else if (
          e.key &&
          e.key.toLowerCase() === leftoverWord[0].toLowerCase()
        ) {
          setInput((input) => `${input}${leftoverWord[0]}`);
        }
      };
    }

    document.addEventListener("keydown", handler);

    return () => document.removeEventListener("keydown", handler);
  }, [currentTextIndex, input, leftoverWord, onIntroEnd]);

  return (
    <div className="intro">
      <div className="intro__text-box">
        <p className="intro__text-box__text">{introTexts[currentTextIndex]}</p>
        <div className="intro__text-box__arrow">
          {currentTextIndex < introTexts.length - 1 && (
            <img
              onClick={() => setCurrentTextIndex(currentTextIndex + 1)}
              src={arrowLeft}
              alt="Right"
              style={{
                transform: "scaleX(-1)",
                gridColumn: 3,
                float: "right",
                cursor: "pointer",
              }}
            />
          )}
        </div>
        {currentTextIndex === introTexts.length - 1 &&
          createPortal(
            <div
              className="room__speech"
              style={{
                position: "absolute",
                right: 390,
                top: 120,
                fontSize: 40,
              }}
            >
              <span className="room__speech__said">{input}</span>
              <span className="room__speech__leftover">{leftoverWord}</span>
            </div>,
            document.getElementById("portal-root")
          )}
      </div>
    </div>
  );
}
