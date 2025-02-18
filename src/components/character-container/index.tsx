import {
  useEffect,
  useMemo,
  useRef,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import {
  getRandomItemFromStringArray,
  shuffleArray,
} from "../../utils/array";
import { Characters, LanguageLevel } from "../../characters";
import { WindowSize } from "../../hooks/use-window-size";
import { Perlin } from "../../utils/perlin";
import './index.css';


type CharacterContainerProps = {
  allCharacters: Characters;
  level: LanguageLevel;
  setScore: Dispatch<SetStateAction<number>>;
  target: string | null;
  setTarget: Dispatch<SetStateAction<string | null>>;
  windowSize: WindowSize;
}

function getContainerLengthByScreenWidth(screenWidth: number) {
  if (screenWidth < 500) {
    return 40;
  }
  return 69;
}

export const CharacterContainer = ({
  allCharacters,
  level,
  setScore,
  target,
  setTarget,
  windowSize
}: CharacterContainerProps) => {
  const [disabled, setDisabled] = useState(false);

  const reset = () => {
    setTarget(getRandomItemFromStringArray(characters));
    setDisabled(false);
  }

  // Save timeout callback so reference to it and it's scope
  // is not lost between renders.
  const savedResetCallback = useRef(reset);
  
  // Character number reduced to fit screen width.
  // Filtered by LanguageLevel
  // Randomly shuffled.
  const characters = useMemo(() => {    
    return shuffleArray(
      Object.entries(allCharacters).filter(([_k, v]) => v.level === level)
    )
      .slice(0, getContainerLengthByScreenWidth(windowSize.x))
      .map(([k, _v]) => k);
  }, [allCharacters, level, windowSize.x]);
  
  // Set the initial target
  useEffect(() => {
    setTarget(null);
    setDisplayedCharacters([]);
    
    setTimeout(() => {
      setTarget(
        getRandomItemFromStringArray(characters)
      );
    }, 750);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characters])
  
  // From characters, only a random subset are displayed to user to guess from.
  const [displayedCharacters, setDisplayedCharacters] = useState<string[]>([]);

  useEffect(() => {
    if (!target) return;

    const noise = new Perlin(Math.random());
    const LINE_LENGTH = 23;

    // Simplex noise calculated using character x/y position in container.
    // If noise value above threshold it is displayed.
    setDisplayedCharacters([
      ...characters.filter(
        (_, idx) => Math.abs(noise.simplex2((idx + 1) % LINE_LENGTH, Math.floor((idx + 1) / LINE_LENGTH))) > 0.75
      ),
      target,
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  const handleGuess = (character: string) => {
    if (!target) return;
    
    // Disable interactions.
    // Fade all characters out except target.
    // Update score
    // Reset target after timeout.
    setDisabled(true);
    setDisplayedCharacters([target]);
    setScore(prev => character === target
      ? prev + (LanguageLevel.length - allCharacters[target].level + 1) 
      : 0
    );
    
    savedResetCallback.current = reset;
    
    // setTimeout(() => {
    //   savedResetCallback.current();
    // }, 1500);
  }

  // Show result after guess: incorrect guess and/or target
  const isResult = displayedCharacters.length === 1 || displayedCharacters.length === 2;

  return (
    <div className="character-container">
      {characters.map(c => {
        const displayed = displayedCharacters.includes(c);

        return (
          <div 
            className={[
              'character',
              displayed ? 'character-displayed' : '',
              isResult &&  c === target ? 'character-correct' : '',
              displayedCharacters.length === 0 ? 'no-transition' : '',
            ].join(' ')}
            key={c}
            onClick={() => displayed && !disabled && handleGuess(c)}
          >
            {c}
          </div>
        );
      })}
    </div>
  );
}