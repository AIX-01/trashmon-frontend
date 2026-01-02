// src/types/index.ts
export type CollectionItem = {
  category: string;
  monsterColor: string;
  timestamp: number;
  rank?: string;      // Optional: S, A, B, C...
  id?: string;        // UUID or similar
};

export type CollectionData = {
  [category: string]: CollectionItem;
};
