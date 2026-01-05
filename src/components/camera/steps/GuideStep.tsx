'use client';

import React from 'react';

interface GuideStepProps {
  category: string;
  tips: string[];
  currentTipIndex: number;
  onNextTip: () => void;
}

const GuideStep: React.FC<GuideStepProps> = ({ category, tips, currentTipIndex, onNextTip }) => {
  return (
    <div className="p-6 flex flex-col">
      <div className="bg-gradient-to-r from-green-400 to-green-500 -mx-6 -mt-6 px-6 py-4 mb-6">
        <p className="text-white text-center font-bold text-lg">🌱 {category} 분리수거 방법</p>
      </div>
      <div className="flex-1 min-h-[200px]">
        <div className="space-y-3">
          {tips.slice(0, currentTipIndex + 1).map((tip, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-xl animate-fade-in border-l-4 border-green-400">
              <p className="text-gray-700">{tip}</p>
            </div>
          ))}
        </div>
      </div>
      <button onClick={onNextTip} className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold py-4 rounded-2xl shadow-lg transition-all mt-6">
        {currentTipIndex < tips.length - 1 ? '다음' : '완료'}
      </button>
    </div>
  );
};

export default GuideStep;