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
    error,
    handleCapture,
    handleNameChange,
    handleNameSubmit,
    handleNextTip,
    handleRelease,
    handleCaptureAgain,
    handleGoToCollection,
    handleErrorDismiss,
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
        tips={result?.guide.tips || []}
        currentTipIndex={currentTipIndex}
        errorMessage={error}
        onNameChange={handleNameChange}
        onNameSubmit={handleNameSubmit}
        onNextTip={handleNextTip}
        onRelease={handleRelease}
        onGoToCollection={handleGoToCollection}
        onCaptureAgain={handleCaptureAgain}
      />
    </>
  );
}