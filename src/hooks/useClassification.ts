import { useState, useCallback } from 'react';
import { ClassificationResult } from '@/types';
import { saveToCollection } from '@/lib/collectionStorage';

// API 서버 주소
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function useClassification() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string>('');
  const [isGuideComplete, setIsGuideComplete] = useState(false);

  /**
   * 이미지 촬영 후 분류 요청
   */
  const handleCapture = useCallback(async (imageBlob: Blob) => {
    setIsLoading(true);
    setError('');
    setResult(null);
    setIsGuideComplete(false);

    try {
      const formData = new FormData();
      formData.append('file', imageBlob, 'capture.jpg');
      const response = await fetch(`${API_URL}/classify`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error(`서버 오류: ${response.status}`);
      const data: ClassificationResult = await response.json();
      if (data.success) {
        setResult(data);
        await saveToCollection(data);
      } else {
        setError('분류에 실패했어요. 다시 시도해주세요!');
      }
    } catch (err) {
      console.error('분류 요청 실패:', err);
      setError('몬스터를 찾는 데 실패했어요. 서버에 문제가 있나봐요!');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 가이드 완료 처리
   */
  const handleGuideComplete = useCallback(() => {
    setIsGuideComplete(true);
  }, []);

  /**
   * 다시 시작 (모든 관련 상태를 초기화)
   */
  const handleReset = useCallback(() => {
    setResult(null);
    setError('');
    setIsGuideComplete(false);
  }, []);

  return {
    isLoading,
    result,
    error,
    isGuideComplete,
    handleCapture,
    handleGuideComplete,
    handleReset,
  };
}