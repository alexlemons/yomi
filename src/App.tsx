import {
  useEffect,
  useState,
} from "react";
import {
  CharacterContainer,
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

import { kanji1 } from './characters/kanji/kanji-1'
import { kanji2 } from './characters/kanji/kanji-2'
import { kanji3 } from './characters/kanji/kanji-3'

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
  '/kanji-4.json',
  '/kanji-5.json',
  '/kanji-6.json',
  '/kanji-8.json',
  '/kanji-9.json',
  '/kanji-10.json',
  '/kanji-no-grade.json',
  // '/kanji-ghost.json',
];

export const App = () => {
  const [allCharacters, setAllCharacters] = useState<Characters>(INITIAL_CHARACTERS);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [scrollState, setScrollState] = useState<ScrollState>([0, 0, 0, null]);

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
        }
      }
    }

    sequentiallyLoadCharacters();
  }, []);

  return (
    <RootFontSizeProvider>
      <SelectedContainer 
        allCharacters={allCharacters}
        selectedCharacter={selectedCharacter}
      />
      <InfoContainer 
        scrollState={scrollState}
      />
      <CharacterContainer
        allCharacters={allCharacters}
        setScrollState={setScrollState}
        selectedCharacter={selectedCharacter}
        setSelectedCharacter={setSelectedCharacter}
      />
    </RootFontSizeProvider>
  );
}
