'use client';

import React, { useEffect, useState } from 'react';

interface ErrorStepProps {
  onCaptureAgain: () => void;
}

const helperImages = [
  '/Can.png',
  '/Glass.png',
  '/Paper.png',
  '/Plastic.png',
  '/General_Waste.png',
];

const ErrorStep: React.FC<ErrorStepProps> = ({ onCaptureAgain }) => {
  const [randomHelper, setRandomHelper] = useState('');

  useEffect(() => {
    setRandomHelper(helperImages[Math.floor(Math.random() * helperImages.length)]);
  }, []);

  return (
    <div className="p-6 flex flex-col items-center">
      {randomHelper && <img src={randomHelper} alt="Helper" className="w-48 h-48 mb-4" />}
      <p className="text-gray-800 text-2xl font-bold text-center mb-2">몬스터를 찾지 못했어요!</p>
      <p className="text-gray-600 text-center mb-8">다시 시도해주세요!</p>
      <button onClick={onCaptureAgain} className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xl font-bold py-4 rounded-2xl shadow-lg transition-all">
        다시 시도하기
      </button>
    </div>
  );
};

export default ErrorStep;