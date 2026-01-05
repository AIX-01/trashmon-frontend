'use client';

import CameraCapture from '@/components/CameraCapture';
import ResultDisplay from '@/components/ResultDisplay';
import CompletionMessage from '@/components/CompletionMessage';
import { useClassification } from '@/hooks/useClassification';

export default function CameraPage() {
  const {
    isLoading,
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