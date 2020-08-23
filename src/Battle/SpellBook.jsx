import React, { useState, useEffect, useRef } from "react";
import cx from "classnames";
import "./SpellBook.scss";

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
  const pages = Math.floor(spells.length / (SPELLS_PER_FACE * 2));

  const face1Spells = spells.slice(
    currentPage * (SPELLS_PER_FACE * 2),
    currentPage * (SPELLS_PER_FACE * 2) + SPELLS_PER_FACE
  );
  const face2Spells = spells.slice(
    currentPage * (SPELLS_PER_FACE * 2) + SPELLS_PER_FACE,
    (currentPage + 1) * (SPELLS_PER_FACE * 2)
  );

  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!ref.current.contains(e.target) && show) {
        onClose();
      }
    };
    document.addEventListener("click", handler);
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("click", handler);
      document.removeEventListener("keydown", handler);
    };
  }, [onClose, show]);
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
      </div>
      <div className="spellbook__face">
        {face2Spells.map((spell, i) => (
          <Spell key={i} spell={spell} />
        ))}
      </div>
    </div>
  );
}
