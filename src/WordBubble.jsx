import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useGlobalKeypress, useIsMounted } from "./hooks";

export function useWriteWord({ wordToWrite, onFinish, onEscape }) {
  const [input, setInput] = useState("");

  const leftoverWord = wordToWrite.substring(input.length);

  useGlobalKeypress(
    useCallback(
      (e) => {
        console.log(e);
        if (e.code === "Enter") {
          if (leftoverWord.length === 0) {
            onFinish();
          } else {
            setInput("");
          }
        } else if (e.code === "Backspace") {
          setInput((input) => input.substring(0, input.length - 1));
        } else if (
          e.key?.length === 1 &&
          e.key.toLowerCase() === leftoverWord[0].toLowerCase()
        ) {
          setInput((input) => `${input}${leftoverWord[0]}`);
        }
        if (onEscape && e.code === "Escape") {
          onEscape();
        }
      },
      [leftoverWord, onEscape, onFinish]
    )
  );

  return [input, leftoverWord];
}

export default function WordBubble({ wordToWrite, onFinish, pos, onEscape }) {
  const [input, leftoverWord] = useWriteWord({
    wordToWrite,
    onFinish,
    onEscape,
  });
  const isMounted = useIsMounted();
  if (!isMounted) return null;

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
