import { useState, useCallback } from 'react';
import { ApiResponse, ClassificationResult } from '@/types';
import { saveToCollection } from '@/lib/collectionStorage';
import { getGuideByCategory } from '@/lib/monsters';

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

      // 서버에서 category, monster_image만 받음
      const apiData: ApiResponse = await response.json();

      // 프론트엔드에서 가이드 매핑
      const guide = getGuideByCategory(apiData.category);

      const classificationResult: ClassificationResult = {
        category: apiData.category,
        monster_image: apiData.monster_image,
        guide,
      };

      setResult(classificationResult);
      // 저장은 나중에 사용자가 이름 입력 후 진행 예정
      await saveToCollection(classificationResult);
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