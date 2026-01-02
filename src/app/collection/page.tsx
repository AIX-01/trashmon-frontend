// src/app/collection/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CollectionData } from '@/types';
import HoloCard from './HoloCard';

const COLLECTION_KEY = 'trash-collection';

// 1. Character Model
// Character Model removed



const DUMMY_DATA = [
  // Common
  { id: '1', category: 'plastic', monsterColor: '#60A5FA', date: '2024-01-15', rank: 'A' },
  { id: '2', category: 'can', monsterColor: '#F87171', date: '2024-01-20', rank: 'B' },
  { id: '3', category: 'paper', monsterColor: '#FBBF24', date: '2024-02-01', rank: 'S' },
  { id: '4', category: 'glass', monsterColor: '#34D399', date: '2024-02-10', rank: 'A' },
  { id: '5', category: 'vinyl', monsterColor: '#A78BFA', date: '2024-02-15', rank: 'B' },
  // Rare / Special
  { id: '6', category: 'battery', monsterColor: '#EF4444', date: '2024-02-20', rank: 'SS' },
  { id: '7', category: 'clothing', monsterColor: '#EC4899', date: '2024-02-22', rank: 'A' },
  { id: '8', category: 'metal', monsterColor: '#9CA3AF', date: '2024-02-25', rank: 'B' },
  { id: '9', category: 'oil', monsterColor: '#1F2937', date: '2024-02-28', rank: 'S' },
  { id: '10', category: 'lightbulb', monsterColor: '#FEF3C7', date: '2024-03-01', rank: 'A' },
  { id: '11', category: 'food', monsterColor: '#10B981', date: '2024-03-05', rank: 'C' },
  { id: '12', category: 'trash', monsterColor: '#6B7280', date: '2024-03-10', rank: 'D' },
];

// Farm Component
const FarmPage = () => {
  const [collectionData, setCollectionData] = useState<CollectionData>({});

  useEffect(() => {
    // Load real data
    const saved: CollectionData = JSON.parse(localStorage.getItem(COLLECTION_KEY) || '{}');
    setCollectionData(saved);
  }, []);

  // Merge real data with dummy data for visualization purposes
  const realCharacters = Object.values(collectionData);
  const characters = [...realCharacters, ...DUMMY_DATA];

  return (
    <div className="min-h-screen bg-neutral-900 p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 max-w-7xl mx-auto">
         <div className="flex items-center gap-4">
            <Link href="/" className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-full transition shadow-lg">
               🏠
            </Link>
            <h1 className="text-4xl font-bold text-white tracking-wider">MY COLLECTION</h1>
         </div>
         <div className="text-gray-400">
            Total: {characters.length}
         </div>
      </div>

      {/* Grid Area */}
      {characters.length === 0 ? (
         <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl">No monsters collected yet.</p>
            <Link href="/" className="mt-4 text-yellow-400 hover:underline">Go catch some!</Link>
         </div>
      ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto justify-items-center">
            {characters.map((char: any) => {
               // Convert timestamp to date string if needed
               const formattedDate = char.date || (char.timestamp ? new Date(char.timestamp).toLocaleDateString() : 'Unknown Date');
               
               return (
               <HoloCard 
                  key={char.id || char.category} 
                  id={char.id || char.category}
                  category={char.category} 
                  monsterColor={char.monsterColor}
                  date={formattedDate}
                  rank={char.rank || 'B'} // Default rank if missing
               />
               );
            })}
         </div>
      )}
    </div>
  );
};

export default FarmPage;
