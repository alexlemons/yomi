import { useEffect } from 'react';
import { BrowserRouter } from 'react-router';
import { useLocalStorage } from 'usehooks-ts';
import {
  CharacterContainer,
  ErrorContainer,
  MiddleContainer,
  SelectedContainer,
} from './components';
import {
  CharactersProvider,
  CharacterContainerListRefProvider,
  ScreenSizeProvider,
} from "./context";
import {
  TaggedCharacters,
} from "./types";

const CSS_HUE = '--hue';
const LS_KEY_HUE = 'hue';
const LS_KEY_TAGGED_CHARACTERS = 'tagged-characters';

export const App = () => {
  const [hue, _setHue] = useLocalStorage<number | null>(LS_KEY_HUE, null);
  const [taggedCharacters, setTaggedCharacters] = useLocalStorage<TaggedCharacters>(LS_KEY_TAGGED_CHARACTERS, {});

  useEffect(() => {
    if (hue) {
      document.documentElement.style.setProperty(CSS_HUE, String(hue));
    }
  }, [hue]);
    
  return (
    <BrowserRouter>
      <ScreenSizeProvider>
        <CharacterContainerListRefProvider>
          <CharactersProvider>
              <SelectedContainer 
                taggedCharacters={taggedCharacters}
                setTaggedCharacters={setTaggedCharacters}
              />
              <MiddleContainer />
              <CharacterContainer
                taggedCharacters={taggedCharacters}
              />
              <ErrorContainer />
          </CharactersProvider>
        </CharacterContainerListRefProvider>
      </ScreenSizeProvider>
    </BrowserRouter>
  );
}
