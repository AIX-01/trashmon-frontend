'use client';

import React, { useState } from 'react';
import './HoloCard.css';
import MonsterCharacter from '@/components/MonsterCharacter';

interface HoloCardProps {
  id: string;
  category: string;
  monsterColor: string;
  name?: string;     // Optional data as requested "don't worry about data"
  date?: string;
  rank?: string;
}

export default function HoloCard({ id, category, monsterColor, name = 'Unknown Monster', date = '2024-01-01', rank = 'B' }: HoloCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Toggle flip on click
  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="holo-card-container" onClick={handleClick}>
      <div className={`holo-card ${isFlipped ? 'flipped' : ''}`}>
        
        {/* FRONT */}
        <div className="holo-card-face holo-card-front">
          {/* Card Frame/Background - mimicking the Pokemon card layout */}
          <div className="w-full h-full relative bg-gray-900 border-8 border-yellow-500 rounded-xl overflow-hidden flex flex-col">
            
            {/* Header / Name */}
            <div className="h-12 bg-gray-800 flex items-center justify-between px-3 border-b-2 border-yellow-600 z-10">
              <span className="text-yellow-400 font-bold text-lg">{category.toUpperCase()}</span>
              <span className="text-white text-xs bg-red-600 px-1 rounded">HP 120</span>
            </div>

            {/* ARTWORK AREA - Where MonsterCharacter lives */}
            <div className="flex-1 relative bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center p-4">
               {/* 
                 We put a simplified shimmer overlay here from CSS
                 and the MonsterCharacter on top
               */}
               <div className="card__shine"></div>
               <div className="z-20 scale-125">
                 <MonsterCharacter category={category} monsterColor={monsterColor} />
               </div>
            </div>

            {/* Footer / Stats */}
            <div className="h-24 bg-gray-100 p-2 z-10 text-xs text-gray-800 relative">
               <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
               <p className="font-bold mb-1">Status</p>
               <p>Discovered in the wild. Likes recycling.</p>
               <div className="mt-2 flex justify-between text-gray-500">
                 <span>Weakness: Fire</span>
                 <span>Retreat: **</span>
               </div>
            </div>

          </div>
        </div>

        {/* BACK */}
        <div className="holo-card-face holo-card-back bg-white border-8 border-blue-800">
          <h2 className="text-2xl font-bold text-center mb-4 text-blue-900">Trashmon Entry</h2>
          
          <div className="space-y-4">
             <div>
                <label className="block text-sm text-gray-500 font-bold">Category</label>
                <div className="text-lg text-black">{category}</div>
             </div>
             
             <div>
                <label className="block text-sm text-gray-500 font-bold">Date Collected</label>
                <div className="text-lg text-black">{date}</div>
             </div>

             <div>
                <label className="block text-sm text-gray-500 font-bold">Rareness</label>
                <div className="text-blue-600 font-bold text-xl">{rank} Rank</div>
             </div>

             <div className="mt-8 p-3 bg-blue-50 rounded text-sm text-blue-800">
               "Recycling this item correctly saves the planet one step at a time."
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
