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
    result,
    monsterName,
    currentTipIndex,
    error,
    handleCapture,
    handleNameChange,
    handleNameSubmit,
    handleNextTip,
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
        error={error}
        onErrorDismiss={handleErrorDismiss}
      />

      <CaptureModal
        isOpen={isModalOpen}
        step={modalStep}
        loadingMessage={loadingMessage}
        category={result?.category || ''}
        monsterImage={result?.monster_image || ''}
        monsterName={monsterName}
        tips={result?.guide.tips || []}
        binColor={result?.guide.bin_color || ''}
        message={result?.guide.message || ''}
        currentTipIndex={currentTipIndex}
        onNameChange={handleNameChange}
        onNameSubmit={handleNameSubmit}
        onNextTip={handleNextTip}
        onGoToCollection={handleGoToCollection}
        onCaptureAgain={handleCaptureAgain}
      />
    </>
  );
}