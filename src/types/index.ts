// src/types/index.ts
export type CollectionItem = {
  category: string;
  monsterColor: string;
  timestamp: number;
};

export type CollectionData = {
  [category: string]: CollectionItem;
};
