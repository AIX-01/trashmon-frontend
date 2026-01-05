'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTTS } from '@/hooks/useTTS';
import LoadingMiniGame from './LoadingMiniGame';
import NamingStep from './steps/NamingStep';
import GuideStep from './steps/GuideStep';
import CompleteStep from './steps/CompleteStep';
import ErrorStep from './steps/ErrorStep';
import { MonsterRank } from '@/types';

type ModalStep = 'loading' | 'naming' | 'guide' | 'complete' | 'error';

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

  // TTS 관련 로직
  useEffect(() => {
    if (step === 'naming') {
      const thanksMessage = "구해줘서 고마워!";
      setShowThanksBubble(true);
      if (isAvailable) {
        startNewSession();
        speak(thanksMessage);
      }
      const timer = setTimeout(() => setShowThanksBubble(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [step, isAvailable, startNewSession, speak]);

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

  const renderStep = () => {
    switch (step) {
      case 'naming':
        return (
          <NamingStep
            category={category}
            monsterImage={monsterImage}
            monsterName={monsterName}
            monsterRank={monsterRank}
            showThanksBubble={showThanksBubble}
            onNameChange={onNameChange}
            onNameSubmit={onNameSubmit}
            onRelease={onRelease}
          />
        );
      case 'guide':
        return (
          <GuideStep
            category={category}
            tips={tips}
            currentTipIndex={currentTipIndex}
            onNextTip={onNextTip}
          />
        );
      case 'complete':
        return (
          <CompleteStep
            monsterName={monsterName}
            onCaptureAgain={onCaptureAgain}
            onGoToCollection={onGoToCollection}
          />
        );
      case 'error':
        return (
          <ErrorStep
            errorMessage={errorMessage}
            onCaptureAgain={onCaptureAgain}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {step === 'loading' ? (
        <LoadingMiniGame loadingMessage={loadingMessage} capturedImage={capturedImage} />
      ) : (
        <>
          {capturedImage && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${capturedImage})`, filter: 'blur(20px) brightness(0.5)', transform: 'scale(1.1)' }}
            />
          )}
          {!capturedImage && <div className="absolute inset-0 bg-black/70" />}

          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-fade-in relative z-10">
            {renderStep()}
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