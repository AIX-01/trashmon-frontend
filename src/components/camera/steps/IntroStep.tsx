'use client';

import React from 'react';
import Image from 'next/image';
import { SpeechBubble } from '../ui';

interface IntroStepProps {
  monsterImage: string;
  onStartGuide: () => void;
  category: string;
  showHelpBubble: boolean;
  blurLevel: number;
}

const IntroStep: React.FC<IntroStepProps> = ({ monsterImage, onStartGuide, category, showHelpBubble, blurLevel }) => {
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
    <div className="flex flex-col items-center text-center flex-grow justify-center">
      <div className="w-48 h-48 relative mb-6">
        <div
          className="w-full h-full relative transition-all duration-500"
          style={{
            filter: `blur(${blurLevel}px)`,
            maskImage: 'radial-gradient(circle, white 50%, rgba(255, 255, 255, 0.5) 65%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(circle, white 50%, rgba(255, 255, 255, 0.5) 65%, transparent 80%)',
          }}
        >
          <Image src={monsterImage} alt="몬스터" fill className="object-contain" unoptimized />
        </div>
      </div>

      <div className="flex items-center gap-4 w-full p-4 rounded-xl mb-4">
        <div className="w-48 h-48 relative animate-float">
          {helperImage && <Image src={helperImage} alt={`${category} 도우미`} fill className="object-contain" />}
          {showHelpBubble && <SpeechBubble text="가이드를 따라서 나를 도와줘!" />}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">가이드를 따라서 나를 도와줘!</h2>
          <p className="text-gray-500">분리수거 방법을 배우고 몬스터를 깨끗하게 만들어주세요.</p>
        </div>
      </div>
      
      <button onClick={onStartGuide} className="w-full max-w-xs bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-4 rounded-2xl shadow-lg transition-all">
        시작하기
      </button>
    </div>
  );
};

export default IntroStep;