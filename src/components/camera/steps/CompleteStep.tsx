'use client';

import React from 'react';
import HoloCard from '@/app/collection/HoloCard';
import { MonsterRank } from '@/types';
import { Camera, BookOpen, Home } from 'lucide-react';

interface CompleteStepProps {
  monsterName: string;
  monsterImage: string;
  category: string;
  monsterRank: MonsterRank;
  onCaptureAgain: () => void;
  onGoToCollection: () => void;
  onGoToFarm: () => void; // 새로 추가
}

const CompleteStep: React.FC<CompleteStepProps> = ({
  monsterName,
  monsterImage,
  category,
  monsterRank,
  onCaptureAgain,
  onGoToCollection,
  onGoToFarm, // 새로 추가
}) => {
  return (
    <div className="flex flex-col items-center text-center w-full h-full justify-around">
      <style jsx>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-100%) rotateZ(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotateZ(360deg); opacity: 0; }
        }
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          background-color: #f00;
          animation: confetti-fall 5s linear infinite;
        }
        @keyframes card-appear {
          0% { transform: scale(0.5) rotate(-15deg); opacity: 0; }
          60% { transform: scale(1.1) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .card-animation {
          animation: card-appear 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
      
      <div className="relative flex-grow flex items-center justify-center w-full">
        <div className="card-animation max-w-xs sm:max-w-sm">
          <HoloCard
            category={category}
            monsterName={monsterName}
            imageUrl={monsterImage}
            rank={monsterRank}
          />
        </div>
      </div>

      <div className="w-full pt-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 animate-pulse">
          ✨ 새로운 몬스터 획득! ✨
        </h2>
        <p className="text-gray-500 mb-6">도감에 {monsterName}이(가) 추가되었어요!</p>
        
        <div className="grid grid-cols-3 gap-3 w-full">
          <button
            onClick={onCaptureAgain}
            className="flex flex-col items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-2xl shadow-lg transition-all"
          >
            <Camera size={24} />
            <span className="text-sm">더 찾아보기</span>
          </button>
          <button
            onClick={onGoToCollection}
            className="flex flex-col items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-2xl shadow-lg transition-all"
          >
            <BookOpen size={24} />
            <span className="text-sm">도감 보기</span>
          </button>
          <button
            onClick={onGoToFarm}
            className="flex flex-col items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-2xl shadow-lg transition-all"
          >
            <Home size={24} />
            <span className="text-sm">팜 가기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteStep;