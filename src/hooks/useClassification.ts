import { useState, useCallback, useEffect, useRef } from 'react';
import { ApiResponse, ClassificationResult } from '@/types';
import { saveToCollection } from '@/lib/collectionStorage';
import { getGuideByCategory } from '@/lib/monsters';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const LOADING_MESSAGES = [
  '쓰레기를 분석하고 있어요... 🔍',
  '어떤 종류인지 알아보는 중... 🤔',
  '몬스터 친구를 그리고 있어요... 🎨',
  '거의 다 됐어요! 조금만 기다려주세요... ✨',
];

type ModalStep = 'loading' | 'naming' | 'guide' | 'complete';

export function useClassification() {
  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>('loading');

  // 로딩 상태
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const messageIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 결과 데이터
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [monsterName, setMonsterName] = useState('');
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // 에러
  const [error, setError] = useState<string>('');

  // 로딩 메시지 순환
  useEffect(() => {
    if (modalStep === 'loading' && isModalOpen) {
      let messageIndex = 0;
      setLoadingMessage(LOADING_MESSAGES[0]);

      messageIntervalRef.current = setInterval(() => {
        messageIndex = Math.min(messageIndex + 1, LOADING_MESSAGES.length - 1);
        setLoadingMessage(LOADING_MESSAGES[messageIndex]);
      }, 3000);
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
  }, [modalStep, isModalOpen]);

  // 촬영 및 API 요청
  const handleCapture = useCallback(async (imageBlob: Blob) => {
    setIsModalOpen(true);
    setModalStep('loading');
    setError('');
    setResult(null);
    setCurrentTipIndex(0);

    try {
      const formData = new FormData();
      formData.append('file', imageBlob, 'capture.jpg');

      const response = await fetch(`${API_URL}/classify`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`서버 오류: ${response.status}`);

      const apiData: ApiResponse = await response.json();
      const guide = getGuideByCategory(apiData.category);

      const classificationResult: ClassificationResult = {
        category: apiData.category,
        monster_image: apiData.monster_image,
        guide,
      };

      setResult(classificationResult);
      setMonsterName(`${apiData.category}몬`); // 기본 이름
      setModalStep('naming');
    } catch (err) {
      console.error('분류 요청 실패:', err);
      setError('몬스터를 찾는 데 실패했어요. 서버에 문제가 있나봐요!');
      setIsModalOpen(false);
    }
  }, []);

  // 이름 변경
  const handleNameChange = useCallback((name: string) => {
    setMonsterName(name);
  }, []);

  // 이름 확정 → 가이드 단계로
  const handleNameSubmit = useCallback(() => {
    setModalStep('guide');
  }, []);

  // 다음 팁 또는 완료
  const handleNextTip = useCallback(async () => {
    if (!result) return;

    const tips = result.guide.tips;

    if (currentTipIndex < tips.length - 1) {
      setCurrentTipIndex(prev => prev + 1);
    } else {
      // 모든 팁을 봤으면 저장 후 완료 단계로
      await saveToCollection(result, monsterName);
      setModalStep('complete');
    }
  }, [result, currentTipIndex, monsterName]);

  // 다시 포획하기
  const handleCaptureAgain = useCallback(() => {
    setIsModalOpen(false);
    setResult(null);
    setMonsterName('');
    setCurrentTipIndex(0);
    setModalStep('loading');
  }, []);

  // 도감으로 이동
  const handleGoToCollection = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // 에러 닫기
  const handleErrorDismiss = useCallback(() => {
    setError('');
    setIsModalOpen(false);
  }, []);

  return {
    // 모달 상태
    isModalOpen,
    modalStep,
    loadingMessage,

    // 데이터
    result,
    monsterName,
    currentTipIndex,
    error,

    // 핸들러
    handleCapture,
    handleNameChange,
    handleNameSubmit,
    handleNextTip,
    handleCaptureAgain,
    handleGoToCollection,
    handleErrorDismiss,
  };
}