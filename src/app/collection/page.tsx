// src/app/collection/page.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { CollectionData } from '@/types';
import { MONSTER_DATA } from '@/lib/monsters';
import MonsterCharacter from '@/components/MonsterCharacter';

const COLLECTION_KEY = 'trash-collection';

// 1. Character Model
interface Character {
  id: string;
  category: string;
  monsterColor: string;
  x: number;
  y: number;
  speed: number;
  targetX: number;
  targetY: number;
}

// Custom hook for game loop
const useGameLoop = (callback: (deltaTime: number) => void) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const loop = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(loop);
  }, [callback]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [loop]);
};

// Character Component
const CharacterComponent: React.FC<{ character: Character }> = ({ character }) => {
  return (
    <div
      className="absolute transition-transform duration-1000 ease-linear"
      style={{
        left: `${character.x}px`,
        top: `${character.y}px`,
        width: '100px',
        height: '100px',
      }}
    >
      <MonsterCharacter category={character.category} monsterColor={character.monsterColor} />
    </div>
  );
};


// Farm Component
const FarmPage = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const farmRef = useRef<HTMLDivElement>(null);

  // 2. Unlock Flow (Initialize characters from localStorage)
  useEffect(() => {
    const saved: CollectionData = JSON.parse(localStorage.getItem(COLLECTION_KEY) || '{}');
    const farmBounds = farmRef.current?.getBoundingClientRect();

    const initialCharacters: Character[] = Object.values(saved).map(item => ({
      id: item.category,
      category: item.category,
      monsterColor: item.monsterColor,
      x: farmBounds ? Math.random() * (farmBounds.width - 100) : 300,
      y: farmBounds ? Math.random() * (farmBounds.height - 100) : 300,
      speed: 0.05 + Math.random() * 0.05,
      targetX: farmBounds ? Math.random() * (farmBounds.width - 100) : 300,
      targetY: farmBounds ? Math.random() * (farmBounds.height - 100) : 300,
    }));
    setCharacters(initialCharacters);
  }, []);

  // 3. Autonomous Movement & 4. Interaction
  const updateCharacters = useCallback((deltaTime: number) => {
    const farmBounds = farmRef.current?.getBoundingClientRect();
    if (!farmBounds) return;

    setCharacters(prevChars =>
      prevChars.map(char => {
        const dx = char.targetX - char.x;
        const dy = char.targetY - char.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let newX = char.x;
        let newY = char.y;

        if (distance > 1) {
          newX += (dx / distance) * char.speed * deltaTime;
          newY += (dy / distance) * char.speed * deltaTime;
        } else {
          // New random target when reached
           if (char.id !== selectedCharacterId) {
             return {
                ...char,
                targetX: Math.random() * (farmBounds.width - 100),
                targetY: Math.random() * (farmBounds.height - 100),
             }
           }
        }
        
        // 3. Stay within farm boundaries
        newX = Math.max(0, Math.min(newX, farmBounds.width - 100));
        newY = Math.max(0, Math.min(newY, farmBounds.height - 100));

        return { ...char, x: newX, y: newY };
      })
    );
  }, [selectedCharacterId]);

  useGameLoop(updateCharacters);
  
  // 4. Interaction
  const handleFarmClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedCharacterId && farmRef.current) {
      const farmBounds = farmRef.current.getBoundingClientRect();
      const newTargetX = e.clientX - farmBounds.left - 50; // Center of character
      const newTargetY = e.clientY - farmBounds.top - 50;

      setCharacters(chars =>
        chars.map(c =>
          c.id === selectedCharacterId ? { ...c, targetX: newTargetX, targetY: newTargetY } : c
        )
      );
      setSelectedCharacterId(null); // Deselect after setting target
    }
  };

  const handleCharacterClick = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedCharacterId(id);
  }


  return (
    // 5. Visual Feel
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-sky-300 to-sky-100">
        {/* Back Button */}
        <Link href="/" className="absolute top-4 left-4 z-20 bg-yellow-400 text-white p-3 rounded-full shadow-lg hover:bg-yellow-500 transition">
            🏠
        </Link>
      
      {/* Farm Area */}
      <div 
        ref={farmRef} 
        className="relative w-full h-full"
        onClick={handleFarmClick}
      >
        {/* Grass */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-green-600 to-green-400" />
        
        {characters.map(char => (
          <div key={char.id} onClick={(e) => handleCharacterClick(char.id, e)}>
            <CharacterComponent character={char} />
          </div>
        ))}

        {characters.length === 0 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80 p-8 rounded-2xl shadow-xl text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">팜이 비어있어요!</h2>
                <p className="text-gray-600">쓰레기를 촬영하고 몬스터를 수집해보세요.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default FarmPage;
