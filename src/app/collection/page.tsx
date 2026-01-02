// src/app/collection/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CollectionItem } from '@/types';
import { getAllCollection, createImageUrl, seedDummyData } from '@/lib/collectionStorage';
import HoloCard from './HoloCard';

// 이미지 URL이 포함된 캐릭터 타입
interface CharacterWithUrl {
  id: number;
  category: string;
  monsterName: string;
  imageUrl: string;
  date: string;
  rank: string;
}

// Farm Component
const FarmPage = () => {
  const [characters, setCharacters] = useState<CharacterWithUrl[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCollection = async () => {
      try {
        // 도감이 비어있으면 더미 데이터 추가
        await seedDummyData();

        const items = await getAllCollection();

        // Blob을 URL로 변환하여 캐릭터 목록 생성
        const charactersWithUrls: CharacterWithUrl[] = items.map(item => ({
          id: item.id!,
          category: item.category,
          monsterName: item.monsterName,
          imageUrl: createImageUrl(item.monsterImage),
          date: item.capturedAt.toLocaleDateString(),
          rank: 'B', // 기본 랭크
        }));

        setCharacters(charactersWithUrls);
      } catch (e) {
        console.error('도감 로드 실패:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadCollection();

    // 컴포넌트 언마운트 시 URL 해제
    return () => {
      characters.forEach(char => URL.revokeObjectURL(char.imageUrl));
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

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
            <Link href="/camera" className="mt-4 text-yellow-400 hover:underline">Go catch some!</Link>
         </div>
      ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto justify-items-center">
            {characters.map((char) => (
               <HoloCard
                  key={char.id}
                  id={String(char.id)}
                  category={char.category}
                  monsterName={char.monsterName}
                  imageUrl={char.imageUrl}
                  date={char.date}
                  rank={char.rank}
               />
            ))}
         </div>
      )}
    </div>
  );
};

export default FarmPage;