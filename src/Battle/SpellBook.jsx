import React, { useState, useEffect, useRef } from "react";
import arrowLeft from "../assets/arrow_left.png";
import cx from "classnames";
import "./SpellBook.scss";
import { useGlobalKeypress } from "../hooks";

function Spell({ spell }) {
  return (
    <div className="spellbook__spell">
      <div className="spellbook__spell__title">{spell.displayName}</div>
      <div className="spellbook__spell__data">
        Level {spell.level}, {spell.condition} type
      </div>
      <div className="spellbook__spell__description">{spell.description}</div>
    </div>
  );
}

const SPELLS_PER_FACE = 3;
export default function SpellBook({ spells, show, onClose }) {
  // a "page" represents everything that can be seen at the same time. it might look like two pages, but they're counted as one
  // they're also 0-indexed (first page is 0)
  const [currentPage, setCurrentPage] = useState(0);
  const faces = Math.ceil(spells.length / SPELLS_PER_FACE);

  const face1Spells = spells.slice(
    currentPage * (SPELLS_PER_FACE * 2),
    currentPage * (SPELLS_PER_FACE * 2) + SPELLS_PER_FACE
  );
  const face2Spells = spells.slice(
    currentPage * (SPELLS_PER_FACE * 2) + SPELLS_PER_FACE,
    (currentPage + 1) * (SPELLS_PER_FACE * 2)
  );

  const canGoLeft = currentPage > 0;
  const canGoRight = (currentPage + 1) * SPELLS_PER_FACE * 2 < spells.length;

  const ref = useRef(null);

  useGlobalKeypress((e) => {
    if (e.code === "Escape") onClose();
    if (e.code === "ArrowLeft" && canGoLeft) setCurrentPage(currentPage - 1);
    if (e.code === "ArrowRight" && canGoRight) setCurrentPage(currentPage + 1);
  });
  return (
    <div
      className={cx("spellbook", {
        "spellbook--hidden": !show,
      })}
      ref={ref}
    >
      <div className="spellbook__face">
        {face1Spells.map((spell, i) => (
          <Spell key={i} spell={spell} />
        ))}
        <div className="spellbook__face__bottom">
          <img
            src={arrowLeft}
            alt="Left"
            style={{
              display: canGoLeft ? "block" : "none",
              gridColumn: 1,
              justifySelf: "flex-start",
            }}
          />
          <span style={{ gridColumn: 2, justifySelf: "center" }}>
            {currentPage * 2 + 1} of {faces}
          </span>
        </div>
      </div>
      <div className="spellbook__face">
        {face2Spells.map((spell, i) => (
          <Spell key={i} spell={spell} />
        ))}
        <div className="spellbook__face__bottom">
          <span
            style={{
              gridColumn: 2,
              display: face2Spells.length > 0 ? "block" : "none",
              justifySelf: "center",
            }}
          >
            {currentPage * 2 + 2} of {faces}
          </span>
          <img
            src={arrowLeft}
            alt="Right"
            style={{
              transform: "scaleX(-1)",
              gridColumn: 3,
              display: canGoRight ? "block" : "none",
              justifySelf: "flex-end",
            }}
          />
        </div>
      </div>
    </div>
  );
}
