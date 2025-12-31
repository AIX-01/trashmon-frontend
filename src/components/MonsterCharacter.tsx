'use client';

/**
 * 몬스터 캐릭터 컴포넌트
 * 분류 결과에 따른 귀여운 몬스터 캐릭터를 표시합니다.
 */

import { useEffect, useState } from 'react';

interface MonsterCharacterProps {
  category: string;       // 분류 카테고리 (종이, 유리, 플라스틱, 캔, 일반쓰레기)
  monsterColor: string;   // 몬스터 색상
  isVisible: boolean;     // 표시 여부
}

// 카테고리별 몬스터 이모지와 표정
const MONSTER_FACES: Record<string, { face: string; eyes: string; mouth: string }> = {
  '종이': { face: '📄', eyes: '👀', mouth: '😊' },
  '유리': { face: '🍾', eyes: '✨', mouth: '😄' },
  '플라스틱': { face: '🥤', eyes: '🌟', mouth: '😁' },
  '캔': { face: '🥫', eyes: '⭐', mouth: '😆' },
  '일반쓰레기': { face: '🗑️', eyes: '💫', mouth: '🙂' },
};

export default function MonsterCharacter({ 
  category, 
  monsterColor
}: MonsterCharacterProps) {
  // 몬스터 정보 (얼굴 이모지만 사용)
  const monster = MONSTER_FACES[category] || MONSTER_FACES['일반쓰레기'];

  return (
    <div className="w-full flex flex-col items-center justify-center -mb-8">
      {/* 몬스터 캐릭터 */}
      <div
        className="relative w-40 h-40 flex items-center justify-center animate-float"
        style={{
          backgroundColor: monsterColor,
          borderRadius: '55% 45% 60% 40% / 40% 60% 45% 55%',
          boxShadow: `0 12px 30px -10px ${monsterColor}99`,
        }}
      >
        {/* 얼굴 */}
        <div className="flex flex-col items-center z-10">
          <div className="flex gap-5">
            <span className="text-4xl">👁️</span>
            <span className="text-4xl">👁️</span>
          </div>
          <span className="text-5xl mt-1">{monster.mouth}</span>
        </div>
        
        {/* 팔 */}
        <div
          className="absolute -left-5 top-1/2 text-5xl transform -translate-y-1/2 -rotate-12 animate-wiggle"
        >
          {monster.face}
        </div>
        <div
          className="absolute -right-5 top-1/2 text-5xl transform -translate-y-1/2 rotate-12 animate-wiggle"
          style={{ animationDirection: 'reverse' }}
        >
          👋
        </div>
      </div>
    </div>
  );
}
