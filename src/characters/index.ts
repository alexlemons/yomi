export * from './chinese';
export * from './japanese-kanji';

export type CharacterProperties = {
  level: LanguageLevel;
  meaning: string;
};

export type Characters = Record<string, CharacterProperties>;

export const LanguageLevel = [5, 4, 3, 2, 1] as const;
export type LanguageLevel = typeof LanguageLevel[number];
