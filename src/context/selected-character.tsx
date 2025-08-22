import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { useSearchParams } from 'react-router';
import {
  FetchError,
  JMDictProperties,
} from '../types';
import { jmdictIndex } from '../characters';

const SP_KEY_SELECTED_CHARACTER = 'c';

type SelectedCharacterContext = {
  dict: JMDictProperties[] | null;
  selectedCharacter: string | null,
  setSelectedCharacter: (character: string) => void;
  error: FetchError | null,
};

export const SelectedCharacterContext = createContext<SelectedCharacterContext>({
  dict: null,
  selectedCharacter: null,
  setSelectedCharacter: () => null,
  error: null,
});

type SelectedCharacterProvider = {
  children: ReactNode;
};

export const SelectedCharacterProvider = ({
  children,
}: SelectedCharacterProvider) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCharacter = searchParams.get(SP_KEY_SELECTED_CHARACTER) || '水';

  const setSelectedCharacter = useCallback((character: string) => {
    setSearchParams({ [SP_KEY_SELECTED_CHARACTER]: character });
  }, [setSearchParams]);
  
  const [dict, setDict] = useState<JMDictProperties[] | null>(null);
  const [error, setError] = useState<FetchError | null>(null);

  useEffect(() => {
    if (!selectedCharacter) {
      return;
    };

    if (!jmdictIndex.includes(selectedCharacter)) {
      setDict(null);
      return;
    }

    async function fetchDict() {
      try {
        const response = await fetch(`/yomi/jmdict/${selectedCharacter}.json`);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
    
        const json = await response.json();
        setDict(json);
      } catch (error) {
        console.error(error);
        setError(FetchError.Dict);
      }
    }

    fetchDict();
  }, [selectedCharacter]);

  const value = useMemo(() => ({
    dict,
    selectedCharacter,
    setSelectedCharacter,
    error
  }), [
    dict,
    selectedCharacter,
    setSelectedCharacter,
    error
  ]);

  return (
    <SelectedCharacterContext.Provider value={value}>
      {children}
    </SelectedCharacterContext.Provider>
  );
}