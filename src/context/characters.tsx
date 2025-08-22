import {
  createContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useSearchParams } from 'react-router';
import { shuffleArray } from '../utils/array';
import { kanji1, kanji2, kanji3 } from '../characters';
import {
  Characters,
  CharacterProperties,
  FetchError,
  JMDictProperties,
} from '../types';
import { jmdictIndex } from '../characters';

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

const CHARACTERS_TO_FETCH = [
  '/yomi/kanji-4.json',
  '/yomi/kanji-5.json',
  '/yomi/kanji-6.json',
  '/yomi/kanji-8.json',
  '/yomi/kanji-9.json',
  '/yomi/kanji-10.json',
  '/yomi/kanji-no-grade.json',
];

const SP_KEY_SELECTED_CHARACTER = 'c';

type CharactersContext = {
  allCharacters:Characters,
  selectedCharacter: string | null,
  setSelectedCharacter: (character: string) => void; 
  selectedCharacterDict: JMDictProperties[] | null;
  error: FetchError | null,
};

export const CharactersContext = createContext<CharactersContext>({
  allCharacters: {},
  selectedCharacterDict: null,
  selectedCharacter: null,
  setSelectedCharacter: () => null,
  error: null,
});

type CharactersProvider = {
  children: ReactNode;
};

export const CharactersProvider = ({
  children,
}: CharactersProvider) => {
  const [allCharacters, setAllCharacters] = useState<Characters>(INITIAL_CHARACTERS);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCharacter = searchParams.get(SP_KEY_SELECTED_CHARACTER) || '水';
  const setSelectedCharacter = (character: string) => {
    setSearchParams({ [SP_KEY_SELECTED_CHARACTER]: character });
  }
  const [selectedCharacterDict, setSelectedCharacterDict] = useState<JMDictProperties[] | null>(null);
  const [error, setError] = useState<FetchError | null>(null);

  // Sequentially fetch all characters
  useEffect(() => {
    async function sequentiallyFetchCharacters() {
      for (const path of CHARACTERS_TO_FETCH) {
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
          setError(FetchError.Characters);
        }
      }
    }

    sequentiallyFetchCharacters();
  }, []);

  // Fetch selected character jmdict if it exists
  useEffect(() => {
    if (!selectedCharacter) {
      return;
    };

    if (!jmdictIndex.includes(selectedCharacter)) {
      setSelectedCharacterDict(null);
      return;
    }

    async function fetchDict() {
      try {
        const response = await fetch(`/yomi/jmdict/${selectedCharacter}.json`);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
    
        const json = await response.json();
        setSelectedCharacterDict(json);
      } catch (error) {
        console.error(error);
        setError(FetchError.Dict);
      }
    }

    fetchDict();
  }, [
    selectedCharacter
  ]);

  const value = {
    allCharacters,
    selectedCharacterDict,
    selectedCharacter,
    setSelectedCharacter,
    error,
  };

  return (
    <CharactersContext.Provider value={value}>
      {children}
    </CharactersContext.Provider>
  );
}