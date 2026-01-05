'use client';

import React, { useEffect, useState } from 'react';
import { useTTS } from '@/hooks/useTTS';
import LoadingMiniGame from './LoadingMiniGame';
import IntroStep from './steps/IntroStep';
import GuideStep from './steps/GuideStep';
import NamingStep from './steps/NamingStep';
import CompleteStep from './steps/CompleteStep';
import ErrorStep from './steps/ErrorStep';
import { MonsterRank } from '@/types';
import { ModalStep } from '@/hooks/useClassification';

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
  onStartGuide: () => void;
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
  onStartGuide,
  onNextTip,
  onRelease,
  onGoToCollection,
  onCaptureAgain,
}: CaptureModalProps) {
  const { speak, startNewSession, isAvailable } = useTTS();
  const [showHelpBubble, setShowHelpBubble] = useState(false);
  const [showThanksBubble, setShowThanksBubble] = useState(false);

  // 말풍선 및 TTS 로직
  useEffect(() => {
    if (!isAvailable) return;

    const messages: Record<ModalStep, string> = {
      intro: "가이드를 따라서 나를 도와줘!",
      naming: "나를 도와줘서 고마워!",
      complete: "고마워~!",
      loading: '', guide: '', error: '', // Add other steps to satisfy type
    };

    const message = messages[step];
    if (message) {
      startNewSession();
      speak(message);
      
      const bubbleSetter = step === 'intro' || step === 'naming' ? setShowHelpBubble : setShowThanksBubble;
      bubbleSetter(true);
      const timer = setTimeout(() => bubbleSetter(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [step, isAvailable, startNewSession, speak]);

  useEffect(() => {
    if (step === 'guide' && isAvailable && tips.length > 0 && currentTipIndex >= 0) {
      const currentTip = tips[currentTipIndex];
      if (currentTip) {
        speak(currentTip);
      }
    }
  }, [step, currentTipIndex, tips, speak, isAvailable]);

  if (!isOpen) return null;

  const totalTips = tips.length > 0 ? tips.length : 1;
  const dirtOpacity = step === 'guide' ? Math.max(0, 1 - (currentTipIndex + 1) / totalTips) : 0;

  const renderContent = () => {
    if (step === 'loading') {
      return <LoadingMiniGame loadingMessage={loadingMessage} capturedImage={capturedImage} />;
    }

    return (
      <>
        {capturedImage && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${capturedImage})`, filter: 'blur(20px) brightness(0.5)', transform: 'scale(1.1)' }}
          />
        )}
        {!capturedImage && <div className="absolute inset-0 bg-black/70" />}
        <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-fade-in relative z-10 flex flex-col min-h-[80vh] sm:min-h-0">
          <div className="p-8 flex-grow flex flex-col">
            {step === 'intro' && (
              <IntroStep
                monsterImage={monsterImage}
                onStartGuide={onStartGuide}
              />
            )}
            {step === 'guide' && (
              <GuideStep
                category={category}
                tips={tips}
                currentTipIndex={currentTipIndex}
                onNextTip={onNextTip}
                monsterImage={monsterImage}
                dirtOpacity={dirtOpacity}
                showHelpBubble={false} // 말풍선은 Modal에서 직접 제어
              />
            )}
            {step === 'naming' && (
              <NamingStep
                category={category}
                monsterImage={monsterImage}
                monsterName={monsterName}
                monsterRank={monsterRank}
                onNameChange={onNameChange}
                onNameSubmit={onNameSubmit}
                onRelease={onRelease}
                showHelpBubble={showHelpBubble}
              />
            )}
            {step === 'complete' && (
              <CompleteStep
                monsterName={monsterName}
                monsterImage={monsterImage}
                showThanksBubble={showThanksBubble}
                onCaptureAgain={onCaptureAgain}
                onGoToCollection={onGoToCollection}
              />
            )}
            {step === 'error' && (
              <ErrorStep
                errorMessage={errorMessage}
                onCaptureAgain={onCaptureAgain}
              />
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {renderContent()}
      <style jsx>{`
        @keyframes bounce-gentle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
        @keyframes wiggle { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
        .animate-wiggle { animation: wiggle 0.5s ease-in-out infinite; }
        @keyframes fadeInUp { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}