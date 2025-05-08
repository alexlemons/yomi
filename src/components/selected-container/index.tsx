import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import {
  Characters,
  CharacterProperties,
} from "../../characters";
import { BookmarkIcon } from '../bookmark-icon';
import classes from "./index.module.css";

const MAX_YOMI = 6;

type SelectedCharacterContainerProps = {
  allCharacters: Characters;
  savedCharacters: string[];
  setSavedCharacters: Dispatch<SetStateAction<string[]>>
  selectedCharacter: string | null;
};

export const SelectedContainer = ({
  allCharacters,
  savedCharacters,
  setSavedCharacters,
  selectedCharacter,
}: SelectedCharacterContainerProps) => {
  const [character, setCharacter] = useState<CharacterProperties | null>(null);

  useEffect(() => {
    if (!selectedCharacter) return;

    // Transition character in/out
    setTimeout(() => {
      setCharacter(allCharacters[selectedCharacter]);
    }, 400);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCharacter, setCharacter]);

  const handleSaveCharacter = (character: string) => {
    setSavedCharacters(prev => {
      return prev.includes(character)
        ? prev.filter(c => c !== character)
        : [...prev, character];
    });
  } 

  if (!character) return null;

  const [kunyomi, onyomi] = character.readings
    ? character.readings
      .reduce<[string[], string[]]>((acc, reading) => {
        if (reading.type === 'ja_kun') {
          acc[0].push(reading.value);
        } else if (reading.type === 'ja_on') {
          acc[1].push(reading.value);
        }
        return acc;
      }, [[], []])
    : [[], []];
    
  const literal = character.literal;
  const transition = literal !== selectedCharacter;
  const isSaved = savedCharacters.includes(literal);

  return (
    <div
      className={[
        classes.root,
        !transition ? classes.show : '',
      ].join(' ')}
    >
      <h3>{literal}</h3>
      {character.meanings 
        ? (
          <div className={classes.meanings}>
            {character.meanings.map(({ value }) => (
              <div key={value}>
                {value}
              </div>
            ))}
          </div>
        ) : null}
      <div>
        {kunyomi.length 
          ? (
            <div className={classes.readings}>
              <h4>K</h4>
              {kunyomi.slice(0, MAX_YOMI).map(kun => (
                <div key={kun}>
                  {kun}
                </div>
              ))}
            </div>
          ) : null}
        {onyomi.length 
          ? (
            <div className={classes.readings}>
              <h4>O</h4>
              {onyomi.slice(0, MAX_YOMI).map(on => (
                <div key={on}>
                  {on}
                </div>
              ))}
            </div>
          ) : null}
      </div>

      <BookmarkIcon
        active={isSaved}
        onClick={() => handleSaveCharacter(literal)}
      />
    </div>
  );
}