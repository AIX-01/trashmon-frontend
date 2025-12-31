'use client';

import { useEffect, useState } from 'react';

interface MonsterCharacterProps {
  category: string;
  monsterColor: string;
}

export default function MonsterCharacter({
  category,
  monsterColor,
}: MonsterCharacterProps) {

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
        {/* 눈 */}
        <div className="flex items-center justify-center gap-5 z-10">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center animate-eye-blink">
            <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
          </div>
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center animate-eye-blink">
            <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
          </div>
        </div>

        {/* 입 */}
        <div className="absolute bottom-6 w-10 h-5 bg-white/30 rounded-full z-10"></div>

        {/* 팔 */}
        <div
          className="absolute -left-5 top-1/2 w-8 h-8 rounded-full animate-wave-arm"
          style={{
            backgroundColor: monsterColor,
            transformOrigin: 'bottom right',
          }}
        ></div>
        <div
          className="absolute -right-5 top-1/2 w-8 h-8 rounded-full animate-wave-arm"
          style={{
            backgroundColor: monsterColor,
            transformOrigin: 'bottom left',
            animationDelay: '-0.5s',
          }}
        ></div>
      </div>
    </div>
  );
}
