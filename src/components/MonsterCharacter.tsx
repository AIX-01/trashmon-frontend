'use client';

import Image from 'next/image';

interface MonsterCharacterProps {
  category: string;
  monsterImage: string;  // Base64 이미지 또는 Object URL
}

export default function MonsterCharacter({
  category,
  monsterImage,
}: MonsterCharacterProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* 몬스터 캐릭터 이미지 */}
      <div className="relative w-48 h-48 animate-float">
        <Image
          src={monsterImage}
          alt={`${category} 몬스터`}
          fill
          className="object-contain"
          unoptimized
        />
      </div>
      {/* 카테고리 이름 */}
      <p className="mt-4 text-2xl font-bold text-dark-text">{category}</p>
    </div>
  );
}