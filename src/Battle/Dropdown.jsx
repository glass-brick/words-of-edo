import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./Dropdown.scss";

export default function Dropdown({ title, options = [] }) {
  const [open, setOpen] = useState(false);
  const disabled = options.length === 0;

  const buttonRef = useRef(null);
  const boundingRect = buttonRef.current
    ? buttonRef.current.getBoundingClientRect()
    : {};

  return (
    <button
      ref={buttonRef}
      onMouseLeave={() => setOpen(false)}
      onMouseEnter={() => setOpen(true)}
      disabled={disabled}
      className="dropdown-button"
    >
      <span>{title}</span>
      {open &&
        createPortal(
          <div
            className="dropdown-portal"
            style={{
              top: boundingRect.bottom + window.scrollY,
              left: boundingRect.left + window.scrollX,
            }}
          >
            <ul className="dropdown-portal__list">
              {options.map((option) => (
                <li key={option.name} className="dropdown-portal__list__item">
                  {option.displayName}
                </li>
              ))}
            </ul>
          </div>,
          document.getElementById("portal-root")
        )}
    </button>
  );
}
