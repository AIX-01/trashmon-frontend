'use client';

/**
 * 결과 표시 컴포넌트
 * 분류 결과를 몬스터 캐릭터와 재활용 가이드로 표시합니다.
 */

import MonsterCharacter from './MonsterCharacter';
import RecyclingGuide from './RecyclingGuide';

interface ResultDisplayProps {
  category: string;
  monsterName: string;
  monsterImage: string;
  binColor: string;
  message: string;
  tips: string[];
  isGuideComplete: boolean;
  onGuideComplete: () => void;
}

export default function ResultDisplay({
  category,
  monsterName,
  monsterImage,
  binColor,
  message,
  tips,
  isGuideComplete,
  onGuideComplete,
}: ResultDisplayProps) {
  if (isGuideComplete) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center justify-center p-4 bg-brand-yellow-light/95 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm flex flex-col space-y-6">
        <MonsterCharacter
          monsterName={monsterName}
          monsterImage={monsterImage}
        />
        <RecyclingGuide
          category={category}
          binColor={binColor}
          message={message}
          tips={tips}
          onComplete={onGuideComplete}
        />
      </div>
    </div>
  );
}