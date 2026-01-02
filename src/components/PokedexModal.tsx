// src/components/PokedexModal.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { CollectionItem } from '@/types';
import { createImageUrl } from '@/lib/collectionStorage';

interface MonsterWithUrl {
  id: number;
  category: string;
  monsterName: string;
  imageUrl: string;
}

interface PokedexModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: CollectionItem[];
}

const PokedexModal: React.FC<PokedexModalProps> = ({ isOpen, onClose, collection }) => {
  const [monstersWithUrls, setMonstersWithUrls] = useState<MonsterWithUrl[]>([]);

  useEffect(() => {
    if (isOpen && collection.length > 0) {
      const monsters = collection.map(item => ({
        id: item.id!,
        category: item.category,
        monsterName: item.monsterName,
        imageUrl: createImageUrl(item.monsterImage),
      }));
      setMonstersWithUrls(monsters);

      return () => {
        monsters.forEach(m => URL.revokeObjectURL(m.imageUrl));
      };
    }
  }, [isOpen, collection]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm m-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">쓰레기 도감</h2>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>

        {monstersWithUrls.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-4xl mb-2">📭</p>
            <p>아직 수집한 몬스터가 없어요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {monstersWithUrls.map((monster) => (
              <div key={monster.id} className="text-center">
                <div className="w-20 h-20 mx-auto mb-2 relative">
                  <Image
                    src={monster.imageUrl}
                    alt={monster.monsterName}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <p className="text-sm font-medium truncate">{monster.monsterName}</p>
                <p className="text-xs text-gray-500">{monster.category}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PokedexModal;