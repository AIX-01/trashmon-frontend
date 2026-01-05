'use client';

import React from 'react';
import Link from 'next/link';

interface CompleteStepProps {
  monsterName: string;
  onCaptureAgain: () => void;
  onGoToCollection: () => void;
}

const CompleteStep: React.FC<CompleteStepProps> = ({ monsterName, onCaptureAgain, onGoToCollection }) => {
  return (
    <div className="p-6 flex flex-col items-center">
      <div className="text-6xl mb-4">🎉</div>
      <p className="text-gray-800 text-2xl font-bold text-center mb-2">{monsterName}</p>
      <p className="text-gray-600 text-center mb-8">도감에 등록되었어요!</p>
      <div className="w-full space-y-3">
        <button onClick={onCaptureAgain} className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xl font-bold py-4 rounded-2xl shadow-lg transition-all">
          🔍 더 포획하기
        </button>
        <Link href="/collection" className="block">
          <button onClick={onGoToCollection} className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold py-4 rounded-2xl shadow-lg transition-all">
            📚 도감 보기
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CompleteStep;