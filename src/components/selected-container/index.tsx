import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { CharactersContext } from '../../context';
import { TagSelect } from '../tag-select';
import { Tag, TaggedCharacters } from '../../types';
import classes from "./index.module.css";

const MAX_MEANINGS = 10;
const MAX_YOMI = 8;

type SelectedCharacterContainerProps = {
  taggedCharacters: TaggedCharacters;
  setTaggedCharacters: Dispatch<SetStateAction<TaggedCharacters>>;
};

export const SelectedContainer = ({
  taggedCharacters,
  setTaggedCharacters,
}: SelectedCharacterContainerProps) => {
  const {
    allCharacters,
    selectedCharacter,
  } = useContext(CharactersContext);
  const [tagSelectOpen, setTagSelectOpen] = useState(false);

  const characterProperties = selectedCharacter 
    ? allCharacters[selectedCharacter]
    : null;

  useEffect(() => {
    if (!selectedCharacter) {
      return;
    };
    setTagSelectOpen(false);
  }, [selectedCharacter]);

  const handleTagCharacter = useCallback((tag: Tag | null) => {
    if (!characterProperties) {
      return;
    };
    
    setTaggedCharacters(prev => ({ 
      ...prev,
      [characterProperties.literal]: tag
    }));
  }, [characterProperties, setTaggedCharacters]);

  const [kunyomi, onyomi] = characterProperties?.readings
    ? characterProperties.readings
      .reduce<[string[], string[]]>((acc, reading) => {
        if (reading.type === 'ja_kun') {
          acc[0].push(reading.value);
        } else if (reading.type === 'ja_on') {
          acc[1].push(reading.value);
        }
        return acc;
      }, [[], []])
    : [[], []];
    
  const literal = characterProperties?.literal;
  const tag = literal ? taggedCharacters[literal] ?? null : null;

  return (
    <div className={classes.root}>
      {literal ? (
        <h2>{literal}</h2>
      ) : null}
      {characterProperties?.meanings 
        ? (
          <ul className={classes.meanings}>
            {characterProperties.meanings
              .slice(0, MAX_MEANINGS)
              .map(({ value }, idx) => (
                <li key={value}>
                  <h4>{idx + 1}</h4>
                  {value}
                </li>
              ))}
          </ul>
        ) : null}
      <div>
        {kunyomi.length 
          ? (
            <ul className={classes.readings}>
              <h4>K</h4>
              {kunyomi.slice(0, MAX_YOMI).map(kun => (
                <li key={kun}>
                  {kun}
                </li>
              ))}
            </ul>
          ) : null}
        {onyomi.length 
          ? (
            <ul className={classes.readings}>
              <h4>O</h4>
              {onyomi.slice(0, MAX_YOMI).map(on => (
                <li key={on}>
                  {on}
                </li>
              ))}
            </ul>
          ) : null}
      </div>
      <TagSelect
        onTagClick={handleTagCharacter}
        open={tagSelectOpen}
        setOpen={setTagSelectOpen}
        selectedTag={tag}
      />
    </div>
  );
}