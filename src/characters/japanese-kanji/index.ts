// Characters from https://jlptsensei.com/jlpt-n1-kanji-list/

import { Characters } from '..';
import { KANJI_N5 } from './kanji-n5';
import { KANJI_N4 } from './kanji-n4';
import { KANJI_N3 } from './kanji-n3';
import { KANJI_N2 } from './kanji-n2';
import { KANJI_N1 } from './kanji-n1';

export function getAllKanji(): Characters {
  return {
    ...KANJI_N5,
    ...KANJI_N4,
    ...KANJI_N3,
    ...KANJI_N2,
    ...KANJI_N1,
  };
}





