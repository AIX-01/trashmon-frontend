import { useState, useCallback, useEffect, useRef } from 'react';
import { ApiResponse, ClassificationResult } from '@/types';
import { saveToCollection } from '@/lib/collectionStorage';
import { getGuideByCategory } from '@/lib/monsters';

// API 서버 주소
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// 로딩 단계별 메시지
const LOADING_MESSAGES = [
  '쓰레기를 분석하고 있어요... 🔍',
  '어떤 종류인지 알아보는 중... 🤔',
  '몬스터 친구를 그리고 있어요... 🎨',
  '거의 다 됐어요! 조금만 기다려주세요... ✨',
];

export function useClassification() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string>('');
  const [isGuideComplete, setIsGuideComplete] = useState(false);
  const messageIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 로딩 중일 때 메시지 순환
  useEffect(() => {
    if (isLoading) {
      let messageIndex = 0;
      setLoadingMessage(LOADING_MESSAGES[0]);

      messageIntervalRef.current = setInterval(() => {
        messageIndex = Math.min(messageIndex + 1, LOADING_MESSAGES.length - 1);
        setLoadingMessage(LOADING_MESSAGES[messageIndex]);
      }, 3000); // 3초마다 메시지 변경
    } else {
      if (messageIntervalRef.current) {
        clearInterval(messageIntervalRef.current);
        messageIntervalRef.current = null;
      }
    }

    return () => {
      if (messageIntervalRef.current) {
        clearInterval(messageIntervalRef.current);
      }
    };
  }, [isLoading]);

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
    loadingMessage,
    result,
    error,
    isGuideComplete,
    handleCapture,
    handleGuideComplete,
    handleReset,
  };
}