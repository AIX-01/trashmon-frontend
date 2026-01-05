'use client';

import CameraCapture from '@/components/camera/CameraCapture';
import ResultDisplay from '@/components/camera/ResultDisplay';
import CompletionMessage from '@/components/camera/CompletionMessage';
import { useClassification } from '@/hooks/useClassification';

export default function CameraPage() {
  const {
    isLoading,
    loadingMessage,
    result,
    error,
    isGuideComplete,
    handleCapture,
    handleGuideComplete,
    handleReset,
  } = useClassification();

  return (
    <>

      <CameraCapture
        onCapture={handleCapture}
        isLoading={isLoading}
        loadingMessage={loadingMessage}
        error={error}
        onErrorDismiss={handleReset}
      />

      {result && (
        <ResultDisplay
          category={result.category}
          monsterImage={result.monster_image}
          binColor={result.guide.bin_color}
          message={result.guide.message}
          tips={result.guide.tips}
          isGuideComplete={isGuideComplete}
          onGuideComplete={handleGuideComplete}
        />
      )}

      {isGuideComplete && (
        <CompletionMessage onReset={handleReset} />
      )}
    </>
  );
}