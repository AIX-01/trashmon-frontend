'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { MonsterRank } from '@/types';
import { useTTS } from '@/hooks/useTTS';
import LoadingMiniGame from './LoadingMiniGame';

type ModalStep = 'loading' | 'naming' | 'guide' | 'complete' | 'error';

// 말풍선 컴포넌트
const SpeechBubble = ({ text }: { text: string }) => (
  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-gray-800 px-4 py-2 rounded-2xl shadow-md text-center font-jua text-base animate-fade-in-up whitespace-nowrap z-20">
    {text}
    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white" />
  </div>
);

// 랭크별 색상
const RANK_COLORS: Record<MonsterRank, string> = {
  S: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white',
  A: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
  B: 'bg-gradient-to-r from-blue-400 to-blue-500 text-white',
  C: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white',
};

interface CaptureModalProps {
  isOpen: boolean;
  step: ModalStep;
  loadingMessage: string;
  capturedImage: string;
  category: string;
  monsterImage: string;
  monsterName: string;
  monsterRank: MonsterRank;
  tips: string[];
  currentTipIndex: number;
  errorMessage: string;
  onNameChange: (name: string) => void;
  onNameSubmit: () => void;
  onNextTip: () => void;
  onRelease: () => void;
  onGoToCollection: () => void;
  onCaptureAgain: () => void;
}

export default function CaptureModal({
  isOpen,
  step,
  loadingMessage,
  capturedImage,
  category,
  monsterImage,
  monsterName,
  monsterRank,
  tips,
  currentTipIndex,
  errorMessage,
  onNameChange,
  onNameSubmit,
  onNextTip,
  onRelease,
  onGoToCollection,
  onCaptureAgain,
}: CaptureModalProps) {
  const { speak, startNewSession, isAvailable } = useTTS();
  const hasStartedSessionRef = useRef(false);
  const lastSpokenTipIndexRef = useRef(-1);
  const [showThanksBubble, setShowThanksBubble] = useState(false);

  // 이름 입력 단계 진입 시 감사 말풍선 및 TTS 출력
  useEffect(() => {
    if (step === 'naming') {
      const thanksMessage = "구해줘서 고마워!";
      setShowThanksBubble(true);
      if (isAvailable) {
        // 새로운 목소리로 감사인사
        startNewSession();
        speak(thanksMessage);
      }
      const timer = setTimeout(() => setShowThanksBubble(false), 4000); // 4초 후 사라짐
      return () => clearTimeout(timer);
    }
  }, [step, isAvailable, startNewSession, speak]);

  // guide 단계 진입 시 새 TTS 세션 시작
  useEffect(() => {
    if (step === 'guide' && !hasStartedSessionRef.current && isAvailable) {
      startNewSession();
      hasStartedSessionRef.current = true;
      lastSpokenTipIndexRef.current = -1;
    }
    if (step !== 'guide') {
      hasStartedSessionRef.current = false;
    }
  }, [step, startNewSession, isAvailable]);

  // 각 tip이 표시될 때 TTS로 음성 출력
  useEffect(() => {
    if (step === 'guide' && isAvailable && tips.length > 0 && currentTipIndex >= 0 && currentTipIndex !== lastSpokenTipIndexRef.current) {
      const currentTip = tips[currentTipIndex];
      if (currentTip) {
        lastSpokenTipIndexRef.current = currentTipIndex;
        speak(currentTip);
      }
    }
  }, [step, currentTipIndex, tips, speak, isAvailable]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 로딩 단계일 때는 미니게임 전체 화면 표시 */}
      {step === 'loading' ? (
        <LoadingMiniGame loadingMessage={loadingMessage} capturedImage={capturedImage} />
      ) : (
        <>
          {/* 블러 처리된 촬영 이미지 배경 */}
          {capturedImage && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${capturedImage})`, filter: 'blur(20px) brightness(0.5)', transform: 'scale(1.1)' }}
            />
          )}
          {!capturedImage && <div className="absolute inset-0 bg-black/70" />}

          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-fade-in relative z-10">
            {/* 이름 입력 단계 */}
            {step === 'naming' && (
              <div className="p-6 flex flex-col items-center">
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">{category}</span>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${RANK_COLORS[monsterRank]}`}>{monsterRank} Rank</span>
                </div>

                <div className="w-40 h-40 relative mb-4">
                  {/* 감사 말풍선 */}
                  {showThanksBubble && <SpeechBubble text="구해줘서 고마워!" />}
                  
                  <Image src={monsterImage} alt="새로운 몬스터" fill className="object-contain animate-bounce-gentle" unoptimized />
                </div>

                <p className="text-gray-600 text-center mb-2">새로운 친구를 발견했어요!</p>
                <p className="text-gray-800 font-bold text-lg mb-4">이름을 지어주세요</p>

                <input
                  type="text" value={monsterName} onChange={(e) => onNameChange(e.target.value)}
                  placeholder="몬스터 이름 (필수)"
                  className="w-full px-4 py-3 border-2 border-green-300 rounded-xl text-center text-xl font-bold focus:outline-none focus:border-green-500 mb-4"
                  maxLength={10}
                />

                <div className="w-full space-y-3">
                  <button
                    onClick={onNameSubmit} disabled={!monsterName.trim()}
                    className={`w-full text-xl font-bold py-4 rounded-2xl shadow-lg transition-all ${monsterName.trim() ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >이름 정하기</button>
                  <button onClick={onRelease} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-600 text-lg font-bold py-3 rounded-2xl transition-all">놓아주기 🌿</button>
                </div>
              </div>
            )}

            {/* 분리수거 가이드 단계 */}
            {step === 'guide' && (
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
            )}

            {/* 완료 단계 */}
            {step === 'complete' && (
              <div className="p-6 flex flex-col items-center">
                <div className="text-6xl mb-4">🎉</div>
                <p className="text-gray-800 text-2xl font-bold text-center mb-2">{monsterName}</p>
                <p className="text-gray-600 text-center mb-8">도감에 등록되었어요!</p>
                <div className="w-full space-y-3">
                  <button onClick={onCaptureAgain} className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xl font-bold py-4 rounded-2xl shadow-lg transition-all">🔍 더 포획하기</button>
                  <Link href="/collection" className="block">
                    <button onClick={onGoToCollection} className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold py-4 rounded-2xl shadow-lg transition-all">📚 도감 보기</button>
                  </Link>
                </div>
              </div>
            )}

            {/* 에러 단계 */}
            {step === 'error' && (
              <div className="p-6 flex flex-col items-center">
                <div className="text-red-600 text-6xl mb-4">❌</div>
                <p className="text-gray-800 text-2xl font-bold text-center mb-2">오류가 발생했어요</p>
                <p className="text-gray-600 text-center mb-8">{errorMessage}</p>
                <button onClick={onCaptureAgain} className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xl font-bold py-4 rounded-2xl shadow-lg transition-all">다시 시도하기</button>
              </div>
            )}
          </div>
        </>
      )}
      <style jsx>{`
        @keyframes bounce-gentle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
        @keyframes fadeInUp { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}