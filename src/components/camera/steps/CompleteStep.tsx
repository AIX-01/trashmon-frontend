'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SpeechBubble } from '../ui';

interface CompleteStepProps {
  monsterName: string;
  monsterImage: string;
  showThanksBubble: boolean;
  onCaptureAgain: () => void;
  onGoToCollection: () => void;
}

const CompleteStep: React.FC<CompleteStepProps> = ({
  monsterName,
  monsterImage,
  showThanksBubble,
  onCaptureAgain,
  onGoToCollection,
}) => {
  return (
    <div className="flex flex-col items-center text-center flex-grow justify-center">
      <div className="w-48 h-48 relative mb-6">
        {showThanksBubble && <SpeechBubble text="고마워~!" />}
        <Image src={monsterImage} alt={monsterName} fill className="object-contain animate-wiggle" unoptimized />
      </div>

      {/* ✨ FIX: "도감 획득!" 메시지로 변경 */}
      <h2 className="text-3xl font-bold text-gray-800 mb-2">도감 획득!</h2>
      <p className="text-gray-600 text-lg mb-8">
        <span className="font-bold text-green-600">{monsterName}</span>이(가) 도감에 등록되었어요.
      </p>
      
      <div className="w-full max-w-xs space-y-3">
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