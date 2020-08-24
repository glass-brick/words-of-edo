import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export function useWriteWord({ wordToWrite, onFinish, onEscape }) {
  const [input, setInput] = useState("");

  const leftoverWord = wordToWrite.substring(input.length);

  useEffect(() => {
    const handler = (e) => {
      if (e.code === "Enter") {
        if (leftoverWord.length === 0) {
          onFinish();
        } else {
          setInput("");
        }
      } else if (
        e.key &&
        e.key.toLowerCase() === leftoverWord[0].toLowerCase()
      ) {
        setInput((input) => `${input}${leftoverWord[0]}`);
      }
      if (onEscape && e.code === "Escape") {
        onEscape();
      }
    };

    document.addEventListener("keydown", handler);

    return () => document.removeEventListener("keydown", handler);
  }, [input, leftoverWord, onFinish, onEscape]);

  return [input, leftoverWord];
}

export default function WordBubble({ wordToWrite, onFinish, pos, onEscape }) {
  const [input, leftoverWord] = useWriteWord({
    wordToWrite,
    onFinish,
    onEscape,
  });

  return createPortal(
    <div
      className="room__speech"
      style={{
        ...pos,
        position: "absolute",
        fontSize: 40,
      }}
    >
      <span className="room__speech__said">{input}</span>
      <span className="room__speech__leftover">{leftoverWord}</span>
    </div>,
    document.getElementById("portal-root")
  );
}
