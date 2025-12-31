// src/components/PokedexModal.tsx
'use client';

import React from 'react';
import { CollectionData } from '@/types';
import { ALL_MONSTERS, MONSTER_DATA } from '@/lib/monsters';
import MonsterCharacter from './MonsterCharacter';

interface PokedexModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: CollectionData;
}

const PokedexModal: React.FC<PokedexModalProps> = ({ isOpen, onClose, collection }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">쓰레기 도감</h2>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {ALL_MONSTERS.map((category) => {
            const collectedItem = collection[category];
            const isCollected = !!collectedItem;
            const monsterColor = isCollected ? collectedItem.monsterColor : '#E0E0E0';

            return (
              <div key={category} className={`text-center ${!isCollected && 'opacity-50'}`}>
                <div className="w-20 h-20 mx-auto mb-2">
                  <MonsterCharacter category={category} monsterColor={monsterColor} />
                </div>
                <p className="text-sm font-medium">{isCollected ? category : '???'}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PokedexModal;
