'use client';

import { useState } from 'react';

/**
 * 분리수거 안내 컴포넌트
 * 어린이 친화적인 분리수거 방법을 단계별로 안내합니다.
 */

interface RecyclingGuideProps {
  category: string;
  binColor: string;
  message: string;
  tips: string[];
  onComplete: () => void; // 부모에게 완료를 알리는 콜백
}

// 분리수거함 색상에 따른 Tailwind CSS 클래스
const BIN_COLORS_KR: Record<string, string> = {
  '파란색': 'bg-blue-500',
  '초록색': 'bg-green-500',
  '노란색': 'bg-yellow-400',
  '빨간색': 'bg-red-500',
  '검은색': 'bg-gray-700',
};

export default function RecyclingGuide({
  category,
  binColor,
  message,
  tips,
  onComplete,
}: RecyclingGuideProps) {
  const [step, setStep] = useState(0);
  const binColorClass = BIN_COLORS_KR[binColor] || 'bg-gray-500';

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      onComplete(); // 마지막 단계에서 완료 콜백 호출
    }
  };

  const buttonText = step < 2 ? '다음으로' : '알겠어요!';

  return (
    <div className="card p-6 pt-16 text-center flex flex-col justify-between min-h-[400px]">
      {/* 정보가 표시되는 부분 */}
      <div className="flex-grow">
        {/* Step 0: 결과 발표 */}
        {step === 0 && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-black text-dark-text mb-1">
              이 친구는 <span className="text-brand-blue">{category}!</span>
            </h2>
            <p className="text-lg font-bold text-dark-text/70">{message}</p>
          </div>
        )}

        {/* Step 1: 버리는 곳 안내 */}
        {step === 1 && (
          <div className="text-left animate-fade-in">
            <h3 className="text-xl font-bold text-dark-text mb-3 flex items-center gap-2">
              <span className="text-3xl">👉</span>
              어디에 버릴까?
            </h3>
            <div className="flex items-center gap-4 p-4 bg-brand-yellow-light rounded-2xl">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-white text-4xl ${binColorClass}`}>
                🗑️
              </div>
              <div>
                <p className="font-bold text-lg text-dark-text">{binColor} 분리수거함</p>
                <p className="text-dark-text/70 font-medium">{category}를 여기에 쏙!</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: 버리는 법 (꿀팁) */}
        {step === 2 && (
          <div className="text-left animate-fade-in">
            <h3 className="text-xl font-bold text-dark-text mb-4 flex items-center gap-2">
              <span className="text-3xl">💡</span>
              어떻게 버릴까?
            </h3>
            <ul className="space-y-3">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-xl pt-0.5">✔️</span>
                  <span className="font-medium text-md text-dark-text/80">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 다음 버튼 */}
      <div className="mt-6">
        <button
          onClick={handleNext}
          className="w-full px-8 py-4 bg-brand-green text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform"
        >
          {buttonText}
        </button>
      </div>
      
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

