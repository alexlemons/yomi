import {
  createContext,
  RefObject,
  ReactNode,
} from 'react';

import {
  ListImperativeAPI,
  useListRef,
} from "react-window";
  
export type CharacterContainerListRef = RefObject<ListImperativeAPI & {
  scrollToCharacter: (character: string) => void;
} | null>

export const CharacterContainerListRefContext = createContext<CharacterContainerListRef>({ 
  current: null 
});

type CharacterContainerListRefProvider = {
  children: ReactNode;
};

export const CharacterContainerListRefProvider = ({
  children
}: CharacterContainerListRefProvider) => {
  const characterContainerListRef = useListRef(null) as CharacterContainerListRef;

  return (
    <CharacterContainerListRefContext.Provider 
      value={characterContainerListRef}
    >
      {children}
    </CharacterContainerListRefContext.Provider>
  );
}