import { useEffect, useState } from 'react';
import {
  Characters,
  CharacterProperties,
} from "../../characters";
import classes from "./index.module.css";

const MAX_YOMI = 6;

type SelectedCharacterContainerProps = {
  allCharacters: Characters;
  selectedCharacter: string | null;
};

export const SelectedContainer = ({
  allCharacters,
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
        {kunyomi.length ? (
          <div className={classes.readings}>
            <h4>K</h4>
            {kunyomi.slice(0, MAX_YOMI).map(k => (
              <div key={k}>
                {k}
              </div>
            ))}
          </div>
        ) : null}
        {onyomi.length ? (
          <div className={classes.readings}>
            <h4>O</h4>
            {onyomi.slice(0, MAX_YOMI).map(o => (
              <div key={o}>
                {o}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}