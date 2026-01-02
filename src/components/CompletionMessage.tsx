'use client';

/**
 * 완료 메시지 컴포넌트
 * 도감 등록 완료 후 표시되는 메시지
 */

interface CompletionMessageProps {
  onReset: () => void;
}

export default function CompletionMessage({ onReset }: CompletionMessageProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="card p-8 text-center max-w-sm w-full">
        <p className="text-5xl mb-4">🎉</p>
        <h2 className="text-2xl font-bold text-dark-text">도감에 등록했어요!</h2>
        <p className="text-dark-text/60 mt-2 mb-8">새로운 쓰레기 친구를 찾아볼까요?</p>
        <button
          onClick={onReset}
          className="w-full px-8 py-4 bg-brand-green text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform active:scale-95"
        >
          다른 쓰레기 찍기
        </button>
      </div>
    </div>
  );
}