import {
  useEffect,
  useState,
} from "react";
import { useLocalStorage } from 'usehooks-ts';
import {
  CharacterContainer,
  ErrorContainer,
  ErrorMessage,
  InfoContainer,
  SelectedContainer,
  ScrollState,
} from './components';
import {
  Characters,
  CharacterProperties,
} from "./characters";
import { RootFontSizeProvider } from "./context";
import { shuffleArray } from "./utils/array";

import { kanji1 } from './characters/kanji/kanji-1';
import { kanji2 } from './characters/kanji/kanji-2';
import { kanji3 } from './characters/kanji/kanji-3';

const LS_KEY_SAVED_CHARACTERS = 'saved-characters';

function formatCharacters(
  characters: CharacterProperties[],
): Characters {
  return shuffleArray(characters)
    .reduce<Characters>((acc, c) => {
      acc[c.literal] = c;
      return acc;
    }, {});
}

const INITIAL_CHARACTERS = {
  ...formatCharacters(kanji1),
  ...formatCharacters(kanji2),
  ...formatCharacters(kanji3),
}

const CHARACTERS_TO_LOAD = [
  '/kanji-explorer/kanji-4.json',
  '/kanji-explorer/kanji-5.json',
  '/kanji-explorer/kanji-6.json',
  '/kanji-explorer/kanji-8.json',
  '/kanji-explorer/kanji-9.json',
  '/kanji-explorer/kanji-10.json',
  '/kanji-explorer/kanji-no-grade.json',
];

export const App = () => {
  const [error, setError] = useState<ErrorMessage | null>(null);
  const [allCharacters, setAllCharacters] = useState<Characters>(INITIAL_CHARACTERS);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [scrollState, setScrollState] = useState<ScrollState>({ atBottom: false, grade: 1 });
  const [savedCharacters, setSavedCharacters] = useLocalStorage<string[]>(LS_KEY_SAVED_CHARACTERS, []);
  
  useEffect(() => {
    async function sequentiallyLoadCharacters() {
      for (const path of CHARACTERS_TO_LOAD) {
        try {
          const response = await fetch(path);
          if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
          }
      
          const json = await response.json();
          setAllCharacters(prev => ({
            ...prev,
            ...formatCharacters(json),
          }));
        } catch (error) {
          console.error(error);
          setError(ErrorMessage.KANJI_FETCH_ERROR);
        }
      }
    }

    sequentiallyLoadCharacters();
  }, []);

  return (
    <RootFontSizeProvider>
      <SelectedContainer 
        allCharacters={allCharacters}
        savedCharacters={savedCharacters}
        setSavedCharacters={setSavedCharacters}
        selectedCharacter={selectedCharacter}
      />
      <CharacterContainer
        allCharacters={allCharacters}
        savedCharacters={savedCharacters}
        setScrollState={setScrollState}
        selectedCharacter={selectedCharacter}
        setSelectedCharacter={setSelectedCharacter}
      />
      <InfoContainer 
        scrollState={scrollState}
      />
      <ErrorContainer error={error} />
    </RootFontSizeProvider>
  );
}
