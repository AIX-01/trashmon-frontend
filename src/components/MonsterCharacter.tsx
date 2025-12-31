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
  monsterColor, 
  isVisible 
}: MonsterCharacterProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

  // 몬스터 정보 가져오기
  const monster = MONSTER_FACES[category] || MONSTER_FACES['일반쓰레기'];

  // 표시 시 애니메이션 시작
  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      // 스파클 효과 생성
      const newSparkles = Array.from({ length: 6 }, (_, i) => ({
        id: i,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
      }));
      setSparkles(newSparkles);
    }
  }, [isVisible, category]);

  if (!isVisible) return null;

  return (
    <div className="relative flex flex-col items-center justify-center py-8">
      {/* 스파클 효과 */}
      {sparkles.map((sparkle, index) => (
        <span
          key={sparkle.id}
          className="absolute text-2xl sparkle"
          style={{
            left: `calc(50% + ${sparkle.x}px)`,
            top: `calc(50% + ${sparkle.y}px)`,
            animationDelay: `${index * 0.2}s`,
          }}
        >
          ✨
        </span>
      ))}

      {/* 몬스터 본체 */}
      <div
        className={`relative w-40 h-40 rounded-blob flex items-center justify-center monster-bounce ${
          isAnimating ? 'monster-wiggle' : ''
        }`}
        style={{
          backgroundColor: monsterColor,
          boxShadow: `0 20px 60px ${monsterColor}66`,
        }}
      >
        {/* 몬스터 얼굴 */}
        <div className="flex flex-col items-center">
          {/* 눈 */}
          <div className="flex gap-4 mb-2">
            <span className="text-3xl float" style={{ animationDelay: '0s' }}>
              👁️
            </span>
            <span className="text-3xl float" style={{ animationDelay: '0.5s' }}>
              👁️
            </span>
          </div>
          {/* 입 */}
          <span className="text-4xl">{monster.mouth}</span>
        </div>

        {/* 몬스터 팔 (왼쪽) */}
        <div
          className="absolute -left-6 top-1/2 -translate-y-1/2 text-4xl"
          style={{
            animation: 'wiggle 0.8s ease-in-out infinite',
            animationDelay: '0.2s',
          }}
        >
          👋
        </div>

        {/* 몬스터 팔 (오른쪽) - 분류된 쓰레기 들고 있음 */}
        <div
          className="absolute -right-6 top-1/2 -translate-y-1/2 text-4xl"
          style={{
            animation: 'wiggle 0.8s ease-in-out infinite',
            animationDelay: '0.4s',
          }}
        >
          {monster.face}
        </div>
      </div>

      {/* 몬스터 발 */}
      <div className="flex gap-4 -mt-2">
        <div
          className="w-8 h-4 rounded-full"
          style={{ backgroundColor: monsterColor }}
        />
        <div
          className="w-8 h-4 rounded-full"
          style={{ backgroundColor: monsterColor }}
        />
      </div>

      {/* 몬스터 대사 말풍선 */}
      <div className="relative mt-6">
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45"
          style={{ backgroundColor: 'white' }}
        />
        <div className="bg-white rounded-2xl px-6 py-3 shadow-xl">
          <p className="text-gray-800 font-bold text-lg text-center">
            {category === '종이' && '나는 종이 몬스터! 📄'}
            {category === '유리' && '반짝반짝 유리 몬스터예요! ✨'}
            {category === '플라스틱' && '플라스틱 몬스터 등장! 🥤'}
            {category === '캔' && '쨍그랑! 캔 몬스터야! 🥫'}
            {category === '일반쓰레기' && '일반쓰레기 몬스터예요! 🗑️'}
          </p>
        </div>
      </div>
    </div>
  );
}
