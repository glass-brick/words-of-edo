import React, { forwardRef, useState, useImperativeHandle } from "react";
import "./Attacks.scss";

const attackSpeeds = {
  cutting: 500,
  fire: 1000,
  kinetic: 1000,
  psi: 1500,
  seal: 1500,
  water: 1000,
};

let Attack = ({ enemyPos }, ref) => {
  const [attackOnPlayer, setAttackOnPlayer] = useState(null);
  const [attackOnEnemy, setAttackOnEnemy] = useState(null);

  useImperativeHandle(ref, () => ({
    triggerAttack: (spell, playerCasted) => {
      if (playerCasted === "player") {
        setAttackOnPlayer(spell.condition);
        setTimeout(() => {
          setAttackOnPlayer(null);
        }, attackSpeeds[spell.condition] || 1000);
      } else if (playerCasted === "enemy") {
        setAttackOnEnemy(spell.condition);
        setTimeout(() => {
          setAttackOnEnemy(null);
        }, attackSpeeds[spell.condition] || 1000);
      }
    },
  }));

  return (
    <>
      <div
        className="attack"
        id={attackOnPlayer}
        style={{
          top: enemyPos.top,
          left: enemyPos.left,
        }}
      />
      <div
        className="attack"
        id={attackOnEnemy}
        style={{
          bottom: 40,
          left: 200,
        }}
      />
    </>
  );
};

Attack = forwardRef(Attack);

export default Attack;
