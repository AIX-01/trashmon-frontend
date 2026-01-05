import Dexie, { Table } from 'dexie';
import { CollectionItem } from '@/types';

/**
 * TrashMon 데이터베이스
 * Dexie.js를 사용한 IndexedDB 래퍼
 */
class TrashMonDB extends Dexie {
  collection!: Table<CollectionItem, number>;

  constructor() {
    super('trashmon-db');

    this.version(4).stores({
      collection: '++id, category, rank, capturedAt',
    });
  }
}

export const db = new TrashMonDB();