export const Tag = [1, 2, 3, 4, null] as const;
export type Tag = typeof Tag[number];

export type TaggedCharacters = Record<string, Tag>;