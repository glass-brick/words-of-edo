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
    const handler = (e) => {
      e.preventDefault();
      onPress(e);
    };

    document.addEventListener("keydown", handler);

    return () => document.removeEventListener("keydown", handler);
  }, [onPress]);
}

export const useLocalStorageObjectState = (key, initialState = {}) => {
  const valueString = window.localStorage.getItem(key);
  const valueObject = valueString ? JSON.parse(valueString) : initialState;
  const [valueState, setValueState] = useState(valueObject);

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(valueState));
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

export function useTransitionState(initialState, delay = 1000) {
  const [state, setState] = useState(initialState);
  const [transition, setTransition] = useState(false);

  useEffect(() => {
    let id1;
    if (transition) {
      id1 = setTimeout(() => {
        setTransition(false);
      }, delay);
    }
    return () => {
      clearTimeout(id1);
    };
  }, [transition, delay]);

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

export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return isMounted;
}
