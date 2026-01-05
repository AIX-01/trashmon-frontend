'use client';

import React from 'react';
import Image from 'next/image';

interface IntroStepProps {
  monsterImage: string;
  onStartGuide: () => void;
}

const IntroStep: React.FC<IntroStepProps> = ({ monsterImage, onStartGuide }) => {
  return (
    <div className="flex flex-col items-center text-center flex-grow justify-center">
      <div className="w-48 h-48 relative mb-6">
        <div 
          className="w-full h-full relative"
          style={{
            maskImage: 'radial-gradient(circle, white 50%, rgba(255, 255, 255, 0.5) 65%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(circle, white 50%, rgba(255, 255, 255, 0.5) 65%, transparent 80%)',
          }}
        >
          <Image src={monsterImage} alt="몬스터" fill className="object-contain" unoptimized />
          {/* 흙먼지 효과 (가장 더러운 상태) */}
          <div 
            className="absolute inset-0 transition-opacity duration-500 pointer-events-none z-10"
            style={{ 
              opacity: 1,
              background: `
                radial-gradient(circle at 20% 30%, rgba(60, 50, 40, 0.9) 0%, transparent 30%),
                radial-gradient(circle at 70% 60%, rgba(70, 60, 50, 0.8) 0%, transparent 35%)
              `,
              mixBlendMode: 'multiply'
            }}
          />
          <div 
            className="absolute inset-0 bg-stone-700/50 mix-blend-hard-light transition-opacity duration-500 pointer-events-none z-10"
            style={{ opacity: 1 }}
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">가이드를 따라서 나를 도와줘!</h2>
      <p className="text-gray-500 mb-8">분리수거 방법을 배우고 몬스터를 깨끗하게 만들어주세요.</p>
      
      <button onClick={onStartGuide} className="w-full max-w-xs bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-4 rounded-2xl shadow-lg transition-all">
        시작하기
      </button>
    </div>
  );
};

export default IntroStep;