import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Background } from "./components/background";
import { CharacterContainer } from "./components/character-container";
import { useWindowSize } from "./hooks/use-window-size";
import { getAllKanji, LanguageLevel } from "./characters";

const ALL_KANJI = getAllKanji();

// const x = Object.entries(ALL_KANJI)
//   .filter(([_k, v]) => v.level === 2)
//   .filter(([_k, v]) => v.meaning.split(', ').length > 2)
//   .reduce<Record<string, string>>((acc, [k, v]) => {
//     acc[k] = v.meaning;
//     return acc;
//   }, {});

// console.log(x)

export const App = () => {
  const stateId = useRef(0);

  // The target character that the user is trying to guess from the meaning.
  const [target, setTarget] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [levelIndex, setLevelIndex] = useLocalStorage('level', 0);
  const [highScore, setHighScore] = useLocalStorage('high-score', 0);
  const { windowSize, resizeInProgress } = useWindowSize();

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score])

  const handleLevelClick = () => {
    setLevelIndex((levelIndex + 1) % LanguageLevel.length);
  }

  const meaning = target && ALL_KANJI[target].meaning;
  const level = LanguageLevel[levelIndex];

  //// shuffle characters in sentence
  //// button to rearrange on left
  /// button to select on right


  return (
    <>
      {resizeInProgress ? null : <Background />}
      {meaning ? <div className="meaning">{target}</div> : null}
      <CharacterContainer
        allCharacters={ALL_KANJI}
        level={level}
        setScore={setScore}
        setTarget={setTarget}
        target={target}
        windowSize={windowSize}
      />
      {/* <div>未だ解決していない殺人事件がある</div> */}
      <div className="controls">
        <div
          className="level"
          onClick={handleLevelClick}
        >{`N${level}`}</div>

        <div>I</div>
        {/* <div>{score} ★ {highScore}</div> */}
      </div>
    </>
  );
}
