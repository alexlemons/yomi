import {
  useContext,
  useEffect,
  useRef,
} from 'react';
import { CharactersContext } from '../../context';
import { Word } from '../word';
import classes from './index.module.css';

export const MiddleContainer = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { selectedCharacterDict } = useContext(CharactersContext);

  useEffect(() => {
    rootRef.current?.scrollTo(0, 0);
  }, [selectedCharacterDict]);

  const dictFiltered = selectedCharacterDict?.filter(word => word.k_ele[0].keb.length > 1) ?? [];

  return (
    <div
      className={classes.root}
      ref={rootRef}
    >
      <ul className={classes.words}>
        {dictFiltered
          .map(word => (
            <Word
              key={word.ent_seq}
              word={word}
            />
          ))}
      </ul>
    </div>
  );
}