import {
  forwardRef,
  memo,
  useContext,
  useEffect,
  useMemo,
  CSSProperties,
  Dispatch,
  SetStateAction,
} from "react";
import classNames from "classnames";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from 'react-window';
import { RootFontSizeContext } from "../../context";
import { Characters } from "../../characters";
import classes from './index.module.css';

const ROW_LENGTH = 15;
const ROWS_PER_BLOCK = 12;
const BLOCK_LENGTH = ROW_LENGTH * ROWS_PER_BLOCK;
const ROW_HEIGHT_REM = 3.4;

export type ScrollState = {
  atBottom: boolean;
  grade: number | null;
};

type BlockProps = {
  data: {
    blocks: string[][];
    savedCharacters: string[];
    selectedCharacter: string | null;
    setSelectedCharacter: Dispatch<SetStateAction<string | null>>;
  };
  index: number;
  style: CSSProperties;
};

const Block = memo(({ data, index, style }: BlockProps) => {
  const {
    blocks,
    savedCharacters,
    selectedCharacter,
    setSelectedCharacter,
  } = data;

  const characters = blocks[index];
  const rootFontSize = useContext(RootFontSizeContext);

  return (
    <div
      className={classes.block}
      style={{
        ...style,
        top: `${Number(style.top) + (rootFontSize * ROW_HEIGHT_REM)}px`,
      }}
    >
      <div className={classes.blockInner}>
        {characters.map(character => {
          return (
            <div
              aria-label="select character"
              className={classNames(
                classes.character,
                {
                  [classes.characterSelected]: character === selectedCharacter,
                  [classes.characterSaved]: savedCharacters.includes(character),
                }
              )}
              key={character}
              onClick={() => setSelectedCharacter(character)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  setSelectedCharacter(character);
                }
              }}
              role="button"
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
  allCharacters: Characters;
  savedCharacters: string[];
  setScrollState: Dispatch<SetStateAction<ScrollState>>;
  selectedCharacter: string | null;
  setSelectedCharacter: Dispatch<SetStateAction<string | null>>;
}

const innerElementType = forwardRef<
  HTMLDivElement,
  { style: CSSProperties }
>(({ style, ...rest }, ref) => {
  const rootFontSize = useContext(RootFontSizeContext);
  return (
    <div
      ref={ref}
      style={{
        ...style,
        height: `${Number(style.height) + (rootFontSize * ROW_HEIGHT_REM)}px`
      }}
      {...rest}
    />
  );
})

export const CharacterContainer = ({
  allCharacters,
  savedCharacters,
  setScrollState,
  selectedCharacter,
  setSelectedCharacter,
}: CharacterContainerProps) => {
  const rootFontSize = useContext(RootFontSizeContext);

  // Characters split into subset blocks.
  // Blocks rendered by react-window.
  const blocks = useMemo(() => {    
    return Object.keys(allCharacters)
      .reduce<string[][]>((acc, character, idx) => {
        const blockIndex = Math.floor(idx/BLOCK_LENGTH);

        if(!acc[blockIndex]) {
          acc[blockIndex] = [];
        }
      
        acc[blockIndex].push(character);

        return acc;
      }, []);
  }, [allCharacters]);

  // Select first character on mount.
  useEffect(() => {
    setSelectedCharacter(blocks[0][0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const itemData = {
    blocks,
    savedCharacters,
    selectedCharacter,
    setSelectedCharacter,
  };

  return (
    <div className={classes.root}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            innerElementType={innerElementType}
            itemCount={blocks.length}
            itemData={itemData}
            itemSize={rootFontSize * ROW_HEIGHT_REM * ROWS_PER_BLOCK}
            overscanCount={2}
            onItemsRendered={({
              visibleStartIndex,
              visibleStopIndex
            }) => {
              setScrollState({
                atBottom: (visibleStopIndex + 1) === blocks.length,
                grade: allCharacters[blocks[visibleStartIndex][0]].misc.grade,
              });
            }}
            width={width}
          >
            {Block}
          </List>
        )}
      </AutoSizer>
    </div>
  );
}