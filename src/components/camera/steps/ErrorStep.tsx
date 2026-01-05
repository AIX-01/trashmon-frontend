'use client';

import React from 'react';

interface ErrorStepProps {
  errorMessage: string;
  onCaptureAgain: () => void;
}

const ErrorStep: React.FC<ErrorStepProps> = ({ errorMessage, onCaptureAgain }) => {
  return (
    <div className="p-6 flex flex-col items-center">
      <div className="text-red-600 text-6xl mb-4">❌</div>
      <p className="text-gray-800 text-2xl font-bold text-center mb-2">오류가 발생했어요</p>
      <p className="text-gray-600 text-center mb-8">{errorMessage}</p>
      <button onClick={onCaptureAgain} className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xl font-bold py-4 rounded-2xl shadow-lg transition-all">
        다시 시도하기
      </button>
    </div>
  );
};

export default ErrorStep;