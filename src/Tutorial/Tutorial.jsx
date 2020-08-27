import React, { useState, useEffect, useCallback } from "react";
import "./Tutorial.scss";
import arrowLeft from "../assets/icons/arrow_left.png";
import WordBubble from "../WordBubble";
import bgMusic from "../assets/music/intro.mp3";
import { Howl } from "howler";
import TextCrawl from "../TextCrawl";
import { useGlobalKeypress } from "../hooks";

const bgMusicHowl = new Howl({ src: bgMusic });

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

export default function Tutorial({ onTutorialEnd = () => {} }) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [arrowEnabled, setArrowEnabled] = useState(false);

  useEffect(() => {
    bgMusicHowl.play();

    return () => bgMusicHowl.stop();
  }, []);

  useGlobalKeypress(
    useCallback(() => {
      if (currentTextIndex < introTexts.length - 1) {
        if (arrowEnabled) {
          setCurrentTextIndex(currentTextIndex + 1);
        }
        setArrowEnabled(!arrowEnabled);
      }
    }, [arrowEnabled, currentTextIndex])
  );

  const writeEnabled = currentTextIndex === introTexts.length - 1;

  return (
    <div className="intro">
      <div className="intro__text-box">
        <p className="intro__text-box__text">
          {currentTextIndex < introTexts.length - 1 ? (
            <TextCrawl onFinish={() => setArrowEnabled(true)}>
              {introTexts[currentTextIndex]}
            </TextCrawl>
          ) : (
            introTexts[currentTextIndex]
          )}
        </p>
        <div className="intro__text-box__arrow">
          {arrowEnabled && (
            <img
              onClick={() => {
                setArrowEnabled(false);
                setCurrentTextIndex(currentTextIndex + 1);
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
          )}
        </div>
        {writeEnabled && (
          <WordBubble
            wordToWrite={initialWord}
            onFinish={onTutorialEnd}
            pos={{ right: 390, top: 120 }}
          />
        )}
      </div>
    </div>
  );
}
