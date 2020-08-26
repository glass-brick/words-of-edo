import { useState, useEffect, useRef, useCallback } from "react";

export function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export function useGlobalKeypress(onPress) {
  useEffect(() => {
    document.addEventListener("keydown", onPress);

    return () => document.removeEventListener("keydown", onPress);
  }, [onPress]);
}

export const useLocalStorageObjectState = (key, initialState = {}) => {
  const valueString = window.localStorage.getItem(key);
  const valueArray = valueString ? JSON.parse(valueString) : initialState;
  const [valueState, setValueState] = useState(valueArray);

  useEffect(() => {
    if (valueState.length === 0) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(valueState));
  }, [key, valueState]);

  return [valueState, setValueState];
};

export const useLocalStorageArrayState = (key, initialState) => {
  const valueString = window.localStorage.getItem(key);
  const valueArray = valueString ? valueString.split(";") : initialState;
  const [valueState, setValueState] = useState(valueArray);

  useEffect(() => {
    if (valueState.length === 0) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, valueState.join(";"));
  }, [key, valueState]);

  return [valueState, setValueState];
};

export function useTransitionState(initialState) {
  const [state, setState] = useState(initialState);
  const [transition, setTransition] = useState(false);

  useEffect(() => {
    let id1;
    if (transition) {
      id1 = setTimeout(() => {
        setTransition(false);
      }, 1000);
    }
    return () => {
      clearTimeout(id1);
    };
  }, [transition]);

  const transitionTo = useCallback(
    (newState) =>
      new Promise((resolve) => {
        if (!transition) setTransition(true);
        setTimeout(() => {
          setState(newState);
          resolve();
        }, 500);
      }),
    [transition]
  );

  return [state, transitionTo, transition];
}
