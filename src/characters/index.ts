export type CharacterProperties = {
    literal: string;
    meanings?: {
        lang: 'en';
        value: string;
    }[];
    misc: {
      grade: number | null;
      stroke_count: number | null;
      freq: number | null;
      jlpt: number | null;
    },
    readings?: {
        type: 'ja_on' | 'ja_kun' | 'pinyin';
        value: string;
    }[];
  };
  
  export type Characters = Record<string, CharacterProperties>;