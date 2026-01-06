'use client';

import CameraCapture from '@/components/camera/CameraCapture';
import CaptureModal from '@/components/camera/CaptureModal';
import { useClassification } from '@/hooks/useClassification';

export default function CameraPage() {
  const {
    isModalOpen,
    modalStep,
    loadingMessage,
    shouldRestartCamera,
    capturedImage,
    result,
    monsterName,
    monsterRank,
    currentTipIndex,
    handleCapture,
    handleNameChange,
    handleNameSubmit,
    handleStartGuide, // ✨ FIX: 누락된 핸들러 추가
    handleNextTip,
    handleRelease,
    handleCaptureAgain,
    handleGoToCollection,
  } = useClassification();

  return (
    <>
      <CameraCapture
        onCapture={handleCapture}
        isDisabled={isModalOpen}
        shouldRestart={shouldRestartCamera}
      />

      <CaptureModal
        isOpen={isModalOpen}
        step={modalStep}
        loadingMessage={loadingMessage}
        capturedImage={capturedImage}
        category={result?.category || ''}
        monsterImage={result?.monster_image || ''}
        monsterName={monsterName}
        monsterRank={monsterRank}
        tips={result?.guide?.tips || []}
        currentTipIndex={currentTipIndex}
        onNameChange={handleNameChange}
        onNameSubmit={handleNameSubmit}
        onStartGuide={handleStartGuide} // ✨ FIX: prop으로 전달
        onNextTip={handleNextTip}
        onRelease={handleRelease}
        onGoToCollection={handleGoToCollection}
        onCaptureAgain={handleCaptureAgain}
      />
    </>
  );
}