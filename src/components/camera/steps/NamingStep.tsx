'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MonsterRank } from '@/types';
import { SpeechBubble, RANK_COLORS } from '../ui';

interface NamingStepProps {
  category: string;
  monsterImage: string;
  monsterName: string;
  monsterRank: MonsterRank;
  showThanksBubble: boolean;
  onNameChange: (name: string) => void;
  onNameSubmit: () => void;
  onRelease: () => void;
}

const NamingStep: React.FC<NamingStepProps> = ({
  category,
  monsterImage,
  monsterName,
  monsterRank,
  showThanksBubble,
  onNameChange,
  onNameSubmit,
  onRelease,
}) => {
  return (
    <div className="p-6 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">{category}</span>
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${RANK_COLORS[monsterRank]}`}>{monsterRank} Rank</span>
      </div>

      <div className="w-40 h-40 relative mb-4">
        {showThanksBubble && <SpeechBubble text="구해줘서 고마워!" />}
        <Image src={monsterImage} alt="새로운 몬스터" fill className="object-contain animate-bounce-gentle" unoptimized />
      </div>

      <p className="text-gray-600 text-center mb-2">새로운 친구를 발견했어요!</p>
      <p className="text-gray-800 font-bold text-lg mb-4">이름을 지어주세요</p>

      <input
        type="text"
        value={monsterName}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="몬스터 이름 (필수)"
        className="w-full px-4 py-3 border-2 border-green-300 rounded-xl text-center text-xl font-bold focus:outline-none focus:border-green-500 mb-4"
        maxLength={10}
      />

      <div className="w-full space-y-3">
        <button
          onClick={onNameSubmit}
          disabled={!monsterName.trim()}
          className={`w-full text-xl font-bold py-4 rounded-2xl shadow-lg transition-all ${monsterName.trim() ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          이름 정하기
        </button>
        <button onClick={onRelease} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-600 text-lg font-bold py-3 rounded-2xl transition-all">
          놓아주기 🌿
        </button>
      </div>
    </div>
  );
};

export default NamingStep;