import React, { useState, useEffect } from "react";
import cursor from "../assets/icons/cursor.png";
import "./Cursor.scss";
import { useGlobalKeypress } from "../hooks";

const cursorSize = {
  width: 48,
  height: 36,
  leftBob: 20,
};

function useCursorState(enterHandlers, disabled) {
  const orderedItems = Object.keys(enterHandlers);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const selectedItem = orderedItems[selectedItemIndex];
  const [pos, setPos] = useState({});

  useEffect(() => {
    const tm = setTimeout(() => {
      setSelectedItemIndex(0);
    }, 100);
    return () => clearTimeout(tm);
  }, []);

  useEffect(() => {
    if (!disabled && selectedItem) {
      const elementToTarget = document.querySelector(
        `[data-cursor-id=${selectedItem}]`
      );
      if (!elementToTarget) {
        setTimeout(() => {}, 250);
        return;
      }
      const rect = elementToTarget.getBoundingClientRect();
      setPos({
        left: rect.left - cursorSize.width - cursorSize.leftBob,
        top: rect.top + rect.height / 2 - cursorSize.height / 2,
      });
    }
  }, [selectedItem, disabled]);

  useGlobalKeypress((e) => {
    if (!disabled) {
      if (["ArrowLeft", "ArrowUp"].includes(e.code)) {
        setSelectedItemIndex(
          selectedItemIndex - 1 < 0
            ? orderedItems.length - 1
            : selectedItemIndex - 1
        );
      } else if (["ArrowRight", "ArrowDown"].includes(e.code)) {
        setSelectedItemIndex((selectedItemIndex + 1) % orderedItems.length);
      } else if (["Enter", "Space"].includes(e.code)) {
        const handler = enterHandlers[selectedItem];
        if (handler) handler();
      }
    }
  });

  return pos;
}

export default function Cursor({ enterHandlers, disabled }) {
  const pos = useCursorState(enterHandlers, disabled);

  return (
    <img
      className="cursor"
      alt="Cursor"
      src={cursor}
      style={{
        ...pos,
        opacity: disabled ? 0 : 1,
      }}
    />
  );
}
