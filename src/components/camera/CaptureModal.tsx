'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type ModalStep = 'loading' | 'naming' | 'guide' | 'complete';

interface CaptureModalProps {
  isOpen: boolean;
  step: ModalStep;
  loadingMessage: string;
  category: string;
  monsterImage: string;
  monsterName: string;
  tips: string[];
  binColor: string;
  message: string;
  currentTipIndex: number;
  onNameChange: (name: string) => void;
  onNameSubmit: () => void;
  onNextTip: () => void;
  onGoToCollection: () => void;
  onCaptureAgain: () => void;
}

export default function CaptureModal({
  isOpen,
  step,
  loadingMessage,
  category,
  monsterImage,
  monsterName,
  tips,
  binColor,
  message,
  currentTipIndex,
  onNameChange,
  onNameSubmit,
  onNextTip,
  onGoToCollection,
  onCaptureAgain,
}: CaptureModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-fade-in">

        {/* 로딩 단계 */}
        {step === 'loading' && (
          <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
            <div className="relative">
              <p className="text-7xl animate-bounce">🎨</p>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-black/10 rounded-full blur-sm animate-pulse"></div>
            </div>
            <p className="text-gray-800 text-xl font-bold mt-6 text-center">
              {loadingMessage}
            </p>
            <div className="mt-6 flex gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
            <p className="text-gray-400 text-sm mt-4">몬스터 생성에 10~20초 정도 걸려요</p>
          </div>
        )}

        {/* 이름 입력 단계 */}
        {step === 'naming' && (
          <div className="p-6 flex flex-col items-center">
            <div className="text-center mb-4">
              <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                {category}
              </span>
            </div>

            <div className="w-40 h-40 relative mb-4">
              <Image
                src={monsterImage}
                alt="새로운 몬스터"
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            <p className="text-gray-600 text-center mb-2">새로운 친구를 발견했어요!</p>
            <p className="text-gray-800 font-bold text-lg mb-4">이름을 지어주세요</p>

            <input
              type="text"
              value={monsterName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="몬스터 이름"
              className="w-full px-4 py-3 border-2 border-green-300 rounded-xl text-center text-xl font-bold focus:outline-none focus:border-green-500 mb-4"
              maxLength={10}
            />

            <button
              onClick={onNameSubmit}
              className="w-full bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-4 rounded-2xl shadow-lg transition-all"
            >
              이름 정하기
            </button>
          </div>
        )}

        {/* 분리수거 가이드 단계 */}
        {step === 'guide' && (
          <div className="p-6 flex flex-col">
            <div className="bg-gradient-to-r from-green-400 to-green-500 -mx-6 -mt-6 px-6 py-4 mb-6">
              <p className="text-white text-center font-bold text-lg">{message}</p>
              <p className="text-green-100 text-center text-sm mt-1">
                {binColor} 분리수거함에 버려주세요
              </p>
            </div>

            <div className="flex-1 min-h-[200px]">
              <p className="text-gray-500 text-sm mb-3">💡 분리수거 팁</p>
              <div className="space-y-3">
                {tips.slice(0, currentTipIndex + 1).map((tip, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 p-4 rounded-xl animate-fade-in border-l-4 border-green-400"
                  >
                    <p className="text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onNextTip}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold py-4 rounded-2xl shadow-lg transition-all mt-6"
            >
              {currentTipIndex < tips.length - 1 ? '다음' : '완료'}
            </button>
          </div>
        )}

        {/* 완료 단계 */}
        {step === 'complete' && (
          <div className="p-6 flex flex-col items-center">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-gray-800 text-2xl font-bold text-center mb-2">
              {monsterName}
            </p>
            <p className="text-gray-600 text-center mb-8">
              도감에 등록되었어요!
            </p>

            <div className="w-full space-y-3">
              <button
                onClick={onCaptureAgain}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xl font-bold py-4 rounded-2xl shadow-lg transition-all"
              >
                🔍 더 포획하기
              </button>
              <Link href="/collection" className="block">
                <button
                  onClick={onGoToCollection}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold py-4 rounded-2xl shadow-lg transition-all"
                >
                  📚 도감 보기
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}