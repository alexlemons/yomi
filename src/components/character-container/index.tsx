import {
  CSSProperties,
  memo,
  useContext,
  useEffect,
  useMemo,
} from "react";
import {
  List,
  RowComponentProps,
} from 'react-window';
import {
  CharactersContext,
  CharacterContainerListRefContext,
  ScreenSizeContext,
} from "../../context";
import {
  DESKTOP_MIN_WIDTH,
  TaggedCharacters,
} from "../../types";
import classes from './index.module.css';

const ROWS_PER_BLOCK = 12;
const CELL_SIZE_REM = 3.4;

const getRowLength = (screenWidth: number): number => {
  const MIN_DESKTOP_ROWS = 18;
  const MAX_DESKTOP_ROWS = 27;

  if (screenWidth >= 1800) {
    return MAX_DESKTOP_ROWS;
  };
  if (screenWidth >= DESKTOP_MIN_WIDTH && screenWidth < 1800) {
    return MIN_DESKTOP_ROWS + Math.floor((screenWidth - DESKTOP_MIN_WIDTH) / 37.5);
  };
  return MIN_DESKTOP_ROWS;
}

type CharacterProps = {
  taggedCharacters: TaggedCharacters;
  selectedCharacter: string | null;
  setSelectedCharacter: (character: string) => void;
};

type BlockProps = RowComponentProps<CharacterProps & {
  blocks: string[][];
  rowLength: number;
}>

const Block = memo(({
  ariaAttributes,
  blocks,
  index,
  rowLength,
  taggedCharacters,
  selectedCharacter,
  setSelectedCharacter,
  style,
}: BlockProps) => {
  const characters = blocks[index];
  const { rootFontSize } = useContext(ScreenSizeContext);

  return (
    <div
      className={classes.block}
      style={{
        ...style,
        top: `${Number(style.top) + (rootFontSize * CELL_SIZE_REM)}px`,
      }}
      {...ariaAttributes}
    >
      <div
        className={classes.blockInner}
        style={{ maxWidth: `${rowLength * CELL_SIZE_REM}rem` }}
      >
        {characters.map(character => {
          const tag = taggedCharacters[character];
          const isDarkTag = tag === 1;
          const isSelected = character === selectedCharacter;

          const characterStyle: CSSProperties = {
            backgroundColor: tag ? `var(--tag${tag})` : 'inherit',
            ...(isSelected && {
                border: `1.5px solid ${isDarkTag ? 'var(--mid)' : 'var(--dark)'}`,
                color: isDarkTag ? `var(--light)` : `var(--dark)`,
            })
          };

          return (
            <div
              aria-label="select character"
              className={classes.character}
              key={character}
              onClick={() => setSelectedCharacter(character)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  setSelectedCharacter(character);
                }
              }}
              role="button"
              style={characterStyle}
              tabIndex={0}
            >
              {character}
            </div>
          );
        })}
      </div>
    </div>
  );
})

type CharacterContainerProps = {
  taggedCharacters: TaggedCharacters;
}

export const CharacterContainer = ({
  taggedCharacters,
}: CharacterContainerProps) => {
  const { rootFontSize, width } = useContext(ScreenSizeContext);
  const listRef = useContext(CharacterContainerListRefContext);
  const {
    allCharacters,
    selectedCharacter,
    setSelectedCharacter,
  } = useContext(CharactersContext);

  const rowLength = getRowLength(width);

  // Characters split into subset blocks.
  // Blocks rendered by react-window.
  const blocks = useMemo(() => {
    const blockLength = rowLength * ROWS_PER_BLOCK;
    return Object.keys(allCharacters)
      .reduce<string[][]>((acc, character, idx) => {
        const blockIndex = Math.floor(idx/blockLength);

        if(!acc[blockIndex]) {
          acc[blockIndex] = [];
        }
      
        acc[blockIndex].push(character);

        return acc;
      }, []);
  }, [allCharacters, rowLength]);

  const paddingSize = `${rootFontSize * CELL_SIZE_REM}px`;

  const rootStyle = useMemo(() => ({
    // row width + padding
    width: `${rowLength * CELL_SIZE_REM + 4.2}rem`,
  }), [rowLength]);

  useEffect(() => {
    if (!listRef.current) {
      return;
    }

    listRef.current.scrollToCharacter = (character: string) => {
      const blockIndex = blocks.findIndex(block => block.includes(character));
      if (blockIndex > -1) {
        listRef.current?.scrollToRow({
          align: 'center',
          index: blockIndex,
        })
      }
    }
  }, [
    blocks,
    listRef,
  ]);

  return (
    <div
      className={classes.root}
      style={rootStyle}
    >
      <List
        listRef={listRef}
        overscanCount={2}
        rowComponent={Block}
        rowCount={blocks.length}
        rowHeight={rootFontSize * CELL_SIZE_REM * ROWS_PER_BLOCK}
        rowProps={{
          blocks,
          rowLength,
          taggedCharacters,
          selectedCharacter,
          setSelectedCharacter,
        }}
        style={{
          paddingTop: paddingSize,
          paddingBottom: paddingSize,
        }}
      />
    </div>
  );
}