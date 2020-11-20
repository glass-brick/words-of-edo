import { isValidElement, useState, useEffect, useCallback } from "react";
import * as ReactIs from "react-is";
import { useGlobalKeypress, useInterval, usePrevious } from "../hooks";

function getTextLength(text) {
  if (typeof text === "undefined") return 0;
  if (typeof text === "string") return text.length;
  if (isValidElement(text) && typeof text.props.children === "string")
    return text.props.children.length;

  console.error(text);
  throw new Error(`Can't get length of text`, text);
}

function getCurrentArrPos(texts, children) {
  const len = texts.length;
  if (len === 0) return 0;
  if (getTextLength(texts[len - 1]) < getTextLength(children[len - 1]))
    return len - 1;
  return len;
}

function ArrayCrawl({ children, speed, onFinish, disableSkip }) {
  const [texts, setTexts] = useState([]);
  const [running, setRunning] = useState(true);
  useGlobalKeypress(() => {
    if (!disableSkip) {
      setTexts(children);
      setRunning(false);
      onFinish();
    }
  });

  const crawl = useCallback(() => {
    const arrPos = getCurrentArrPos(texts, children);
    const currentText = children[arrPos];
    if (
      children.length >= arrPos &&
      getTextLength(currentText) > getTextLength(texts[arrPos])
    ) {
      setTexts((texts) => {
        if (texts[arrPos] === undefined) {
          if (typeof currentText === "string") {
            return [...texts, currentText[0]];
          } else {
            return [
              ...texts,
              <currentText.type key={arrPos}>
                {currentText.props.children[0]}
              </currentText.type>,
            ];
          }
        }

        let newTexts = [...texts];
        if (typeof currentText === "string") {
          const currentChar = texts[arrPos].length;
          newTexts[arrPos] = newTexts[arrPos] + currentText[currentChar];
        } else {
          const currentChar = texts[arrPos].props.children.length + 1;
          newTexts[arrPos] = (
            <currentText.type key={arrPos}>
              {currentText.props.children.substring(0, currentChar)}
            </currentText.type>
          );
        }
        return newTexts;
      });
    } else {
      setRunning(false);
      onFinish();
    }
  }, [children, texts, onFinish]);

  useInterval(crawl, running ? speed : null);

  const prevChildren = usePrevious(children);

  useEffect(() => {
    if (prevChildren !== children) {
      setTexts([]);
      setRunning(true);
    }
  }, [children, prevChildren]);

  return texts;
}

function StringCrawl({ children, speed, onFinish, disableSkip }) {
  const [text, setText] = useState("");
  const [running, setRunning] = useState(true);
  useGlobalKeypress(() => {
    if (!disableSkip) {
      setText(children);
      setRunning(false);
      onFinish();
    }
  });

  const crawl = useCallback(() => {
    const pos = text.length;
    if (children.length > pos) {
      setText((text) => text + children[pos]);
    } else {
      setRunning(false);
      onFinish();
    }
  }, [children, text, onFinish]);

  useInterval(crawl, running ? speed : null);

  const prevChildren = usePrevious(children);

  useEffect(() => {
    if (prevChildren !== children) {
      setText("");
      setRunning(true);
    }
  }, [children, prevChildren]);

  return text;
}

export default function TextCrawl({
  children,
  speed = 25,
  onFinish = () => {},
  disableSkip = false,
}) {
  if (ReactIs.isFragment(children)) {
    return (
      <ArrayCrawl speed={speed} onFinish={onFinish} disableSkip={disableSkip}>
        {children.props.children}
      </ArrayCrawl>
    );
  }
  if (Array.isArray(children)) {
    return (
      <ArrayCrawl speed={speed} onFinish={onFinish} disableSkip={disableSkip}>
        {children}
      </ArrayCrawl>
    );
  }
  if (typeof children === "string") {
    return (
      <StringCrawl speed={speed} onFinish={onFinish} disableSkip={disableSkip}>
        {children}
      </StringCrawl>
    );
  }
}
