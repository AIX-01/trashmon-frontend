// src/app/collection/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CollectionData } from '@/types';
import HoloCard from './HoloCard';

const COLLECTION_KEY = 'trash-collection';

// 1. Character Model
// Character Model removed



// Farm Component
const FarmPage = () => {
  const [collectionData, setCollectionData] = useState<CollectionData>({});

  useEffect(() => {
    const saved: CollectionData = JSON.parse(localStorage.getItem(COLLECTION_KEY) || '{}');
    setCollectionData(saved);
  }, []);

  const characters = Object.values(collectionData);

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
            {characters.map((char) => (
               <HoloCard 
                  key={char.category} 
                  id={char.category}
                  category={char.category} 
                  monsterColor={char.monsterColor} 
                  // Using partial actual data, fallback to defaults for unused fields
               />
            ))}
         </div>
      )}
    </div>
  );
};

export default FarmPage;
