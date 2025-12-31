// src/components/Collection.tsx
'use client';

import React, { useEffect, useState } from 'react';
import MonsterCharacter from './MonsterCharacter'; // Assuming this can be reused

const COLLECTION_KEY = 'trash-collection';

// This is the structure of the data stored in localStorage
export type CollectionItem = {
  category: string;
  monsterColor: string;
  timestamp: number;
};

export type CollectionData = {
  [category: string]: CollectionItem;
};

interface CollectionProps {
  isOpen: boolean;
  onClose: () => void;
}

const Collection: React.FC<CollectionProps> = ({ isOpen, onClose }) => {
  const [collection, setCollection] = useState<CollectionData>({});

  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem(COLLECTION_KEY);
        if (saved) {
          setCollection(JSON.parse(saved));
        }
      } catch (e) {
        console.error('도감 불러오기 실패:', e);
        setCollection({});
      }
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const collectedItems = Object.values(collection);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">도감</h2>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>
        {collectedItems.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {collectedItems.map((item) => (
              <div key={item.category} className="text-center">
                <div className="w-20 h-20 mx-auto mb-2">
                    <MonsterCharacter category={item.category} monsterColor={item.monsterColor} />
                </div>
                <p className="text-sm font-medium">{item.category}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>아직 수집한 몬스터가 없어요!</p>
        )}
      </div>
    </div>
  );
};

export default Collection;