import { useContext } from "react";
import { Label } from "../label";
import {
  CharactersContext,
  CharacterContainerListRefContext,
} from "../../context";
import { JMDictProperties } from "../../types";
import classes from "./index.module.css";

type WordProps = {
  word: JMDictProperties;
};

export const Word = ({
  word,
}: WordProps) => {
  const listRef = useContext(CharacterContainerListRefContext);
  const {
    allCharacters,
    setSelectedCharacter,
  } = useContext(CharactersContext);

  const firstREle = word.r_ele[0];
  const firstKEle = word.k_ele[0];
  const isCommon = firstKEle.ke_pri.some(p => p === 'ichi1' || p === 'news1');

  return (
    <li className={classes.root}>
      <div className={classes.ele}>
        <div className={classes.reading}>
          {firstREle.reb}
        </div>
        <div className={classes.keb}>
          {[...firstKEle.keb].map((character, idx) => {
            // First character will always be selectedCharacter
            const canSelect = idx !== 0 && Object.prototype.hasOwnProperty.call(allCharacters, character);
            return (
              <span
                className={canSelect ? classes.canSelect : undefined}
                key={idx + character}
                onClick={() => {
                  if (!canSelect) {
                    return;
                  }
                  setSelectedCharacter(character);
                  listRef.current?.scrollToCharacter(character);
                }}
              >
                {character}
              </span>
            );
          })}
        </div>
      </div>
      <ul className={classes.sense}>
        {word.sense
          .map((sense, idx) => (
            <li
              key={idx + sense.gloss[0].value}
            >
              <h4>{idx + 1}</h4>
              {sense.gloss[0].value}
            </li>
          ))}
      </ul>
      {isCommon ? (
        <Label
          className={classes.commonWord}
          text="C"
          title="common"
        />
      ) : null}
    </li>
  );
}