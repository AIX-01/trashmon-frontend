'use client';

import React from 'react';
import Image from 'next/image';
import { SpeechBubble } from '../ui';

interface GuideStepProps {
  category: string;
  tips: string[];
  currentTipIndex: number;
  onNextTip: () => void;
  monsterImage: string;
  dirtOpacity: number;
  showHelpBubble: boolean;
}

const GuideStep: React.FC<GuideStepProps> = ({
  category,
  tips,
  currentTipIndex,
  onNextTip,
  monsterImage,
  dirtOpacity,
  showHelpBubble,
}) => {
  const currentTip = tips[currentTipIndex];

  const getHelperImage = (category: string) => {
    switch (category) {
      case '종이':
        return '/Paper.png';
      case '유리':
        return '/Glass.png';
      case '플라스틱':
        return '/Plastic.png';
      case '캔':
        return '/Can.png';
      case '일반쓰레기':
        return '/General_Waste.png';
      default:
        return '';
    }
  };

  const helperImage = getHelperImage(category);

  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-48 h-48 relative mb-4">
        <div 
          className="w-full h-full relative"
          style={{
            maskImage: 'radial-gradient(circle, white 50%, rgba(255, 255, 255, 0.5) 65%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(circle, white 50%, rgba(255, 255, 255, 0.5) 65%, transparent 80%)',
          }}
        >
          <Image src={monsterImage} alt="몬스터" fill className="object-contain" unoptimized />
          <div 
            className="absolute inset-0 transition-opacity duration-500 pointer-events-none z-10"
            style={{ 
              opacity: dirtOpacity,
              background: `
                radial-gradient(circle at 20% 30%, rgba(60, 50, 40, 0.9) 0%, transparent 30%),
                radial-gradient(circle at 70% 60%, rgba(70, 60, 50, 0.8) 0%, transparent 35%),
                radial-gradient(circle at 40% 80%, rgba(50, 40, 30, 0.9) 0%, transparent 25%)
              `,
              mixBlendMode: 'multiply'
            }}
          />
          <div 
            className="absolute inset-0 bg-stone-700/50 mix-blend-hard-light transition-opacity duration-500 pointer-events-none z-10"
            style={{ opacity: dirtOpacity }}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 bg-gradient-to-r from-green-400 to-green-500 w-full p-4 rounded-xl mb-4">
        <div className="w-32 h-32 relative animate-float">
          {helperImage && <Image src={helperImage} alt={`${category} 도우미`} fill className="object-contain" />}
          {showHelpBubble && <SpeechBubble text="가이드를 따라 분리수거를 도와주자!" />}
        </div>
        <p className="text-white font-bold text-xl">가이드를 따라 분리수거를 도와주자!</p>
      </div>

      <div className="w-full flex-1 min-h-[120px] mb-4 flex items-center justify-center bg-gray-50 p-6 rounded-xl border-l-4 border-green-400">
        {currentTip && (
          <p key={currentTipIndex} className="text-gray-800 text-lg animate-fade-in font-semibold">
            {currentTip}
          </p>
        )}
      </div>
      
      <div className="text-center text-gray-500 font-semibold mb-4">
        {currentTipIndex + 1} / {tips.length}
      </div>
      
      <button onClick={onNextTip} className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold py-4 rounded-2xl shadow-lg transition-all">
        {currentTipIndex < tips.length - 1 ? '다음' : '깨끗해졌다!'}
      </button>
    </div>
  );
};

export default GuideStep;