'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import HoloCard from '@/app/collection/HoloCard';
import { FarmMonster } from '@/types/farm';

interface FarmUIProps {
  monsterCount: number;
  selectedMonster: FarmMonster | null;
  onCloseModal: () => void;
}

const FarmUI: React.FC<FarmUIProps> = ({ monsterCount, selectedMonster, onCloseModal }) => {
  return (
    <>
      {/* UI: 헤더 */}
      <div className="absolute top-0 left-0 w-full p-6 z-50 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto">
          <Link href="/app" className="bg-white/90 hover:bg-white text-green-700 p-3 rounded-2xl shadow-lg border-2 border-green-200 inline-flex items-center gap-2 transition-transform hover:scale-105">
             <ArrowLeft size={24} />
             <span className="font-bold text-lg">나가기</span>
          </Link>
        </div>
        
        <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl border-2 border-white shadow-md">
           <h1 className="text-2xl font-bold text-green-800 flex items-center gap-2">
             🌱 몬스터 농장
             <span className="text-sm bg-green-100 text-green-600 px-2 py-1 rounded-lg ml-2">
               {monsterCount}마리
             </span>
           </h1>
        </div>
      </div>

      {/* 몬스터 상세 정보 모달 */}
      {selectedMonster && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onCloseModal}>
          <div 
            className="transform transition-all scale-100 animate-bounce-gentle"
            onClick={(e) => e.stopPropagation()}
          >
            <HoloCard
              id={selectedMonster.id}
              category={selectedMonster.category}
              monsterName={selectedMonster.name}
              imageUrl={selectedMonster.imageUrl}
              date={selectedMonster.capturedAt.toLocaleDateString()}
              rank={selectedMonster.rank}
            />
            <button 
              onClick={onCloseModal}
              className="w-full bg-white/90 hover:bg-white text-green-600 font-bold py-3 rounded-2xl shadow-lg mt-4 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FarmUI;