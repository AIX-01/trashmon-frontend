'use client';

import React from 'react';
import Image from 'next/image';
import { MonsterRank } from '@/types';
import { RANK_COLORS } from '../ui';
import { SpeechBubble } from '../ui';

interface NamingStepProps {
  category: string;
  monsterImage: string;
  monsterName: string;
  monsterRank: MonsterRank;
  onNameChange: (name: string) => void;
  onNameSubmit: () => void;
  onRelease: () => void;
  showHelpBubble: boolean; // Renamed for clarity
}

const NamingStep: React.FC<NamingStepProps> = ({
  category,
  monsterImage,
  monsterName,
  monsterRank,
  onNameChange,
  onNameSubmit,
  onRelease,
  showHelpBubble,
}) => {
  return (
    <div className="flex flex-col items-center text-center flex-grow justify-center">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">{category}</span>
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${RANK_COLORS[monsterRank]}`}>{monsterRank} Rank</span>
      </div>

      <div className="w-48 h-48 relative mb-6">
        {/* ✨ FIX: "나를 도와줘서 고마워" 말풍선 추가 */}
        {showHelpBubble && <SpeechBubble text="나를 도와줘서 고마워!" />}
        <Image src={monsterImage} alt="깨끗해진 몬스터" fill className="object-contain animate-bounce-gentle" unoptimized />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">이제 내 이름을 지어줘!</h2>

      <input
        type="text"
        value={monsterName}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="몬스터 이름 (필수)"
        className="w-full max-w-xs px-4 py-3 border-2 border-green-300 rounded-xl text-center text-xl font-bold focus:outline-none focus:border-green-500 mb-4"
        maxLength={10}
      />

      <div className="w-full max-w-xs space-y-3">
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