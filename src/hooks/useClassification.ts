import { useState, useCallback, useEffect, useRef } from 'react';
import { ApiResponse, ClassificationResult, MonsterRank } from '@/types';
import { saveToCollection } from '@/lib/collectionStorage';
import { getGuideByCategory, generateRandomRank, isValidCategory } from '@/lib/monsters';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const LOADING_MESSAGES = [
  '쓰레기를 분석하고 있어요... 🔍',
  '어떤 종류인지 알아보는 중... 🤔',
  '몬스터 친구를 그리고 있어요... 🎨',
  '거의 다 됐어요! 조금만 기다려주세요... ✨',
];

type ModalStep = 'loading' | 'naming' | 'guide' | 'complete' | 'error';

export function useClassification() {
  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>('loading');
  const [shouldRestartCamera, setShouldRestartCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string>('');

  // 로딩 상태
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const messageIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 결과 데이터
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [monsterName, setMonsterName] = useState('');
  const [monsterRank, setMonsterRank] = useState<MonsterRank>('C');
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
    setShouldRestartCamera(false);
    setIsModalOpen(true);
    setModalStep('loading');
    setError('');
    setResult(null);
    setCurrentTipIndex(0);

    // 촬영된 이미지를 Base64로 변환하여 배경용으로 저장
    const imageUrl = URL.createObjectURL(imageBlob);
    setCapturedImage(imageUrl);

    try {
      const formData = new FormData();
      formData.append('file', imageBlob, 'capture.jpg');

      const response = await fetch(`${API_URL}/classify`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`서버 오류: ${response.status}`);

      const apiData: unknown = await response.json();

      // 응답 유효성 검사
      if (
        !apiData ||
        typeof apiData !== 'object' ||
        !('category' in apiData) ||
        !('monster_image' in apiData) ||
        typeof (apiData as ApiResponse).category !== 'string' ||
        typeof (apiData as ApiResponse).monster_image !== 'string'
      ) {
        throw new Error('앗, 서버에서 이상한 답이 왔어요! 다시 찍어볼까요?');
      }

      const validatedData = apiData as ApiResponse;

      // 카테고리 유효성 검사 (5개 중 하나가 아니면 에러)
      if (!isValidCategory(validatedData.category)) {
        throw new Error('음... 이게 뭔지 모르겠어요! 다른 쓰레기를 찍어볼까요?');
      }

      const guide = getGuideByCategory(validatedData.category);
      if (!guide) {
        throw new Error('어라? 분리수거 방법을 찾을 수 없어요!');
      }

      const classificationResult: ClassificationResult = {
        category: validatedData.category,
        monster_image: validatedData.monster_image,
        guide,
      };

      setResult(classificationResult);
      setMonsterName(`${validatedData.category}몬`);
      setMonsterRank(generateRandomRank());
      setModalStep('naming');
    } catch (err) {
      console.error('분류 요청 실패:', err);
      setError(err instanceof Error ? err.message : '몬스터를 찾는 데 실패했어요.');
      setModalStep('error');
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

    const tips = result.guide?.tips || [];

    if (currentTipIndex < tips.length - 1) {
      setCurrentTipIndex(prev => prev + 1);
    } else {
      // 모든 팁을 봤으면 저장 후 완료 단계로
      await saveToCollection(result, monsterName, monsterRank);
      setModalStep('complete');
    }
  }, [result, currentTipIndex, monsterName, monsterRank]);

  // 놓아주기 (저장하지 않고 다시 촬영)
  const handleRelease = useCallback(() => {
    setIsModalOpen(false);
    setResult(null);
    setMonsterName('');
    setMonsterRank('C');
    setCurrentTipIndex(0);
    setModalStep('loading');
    setShouldRestartCamera(true);
  }, []);

  // 다시 포획하기
  const handleCaptureAgain = useCallback(() => {
    setIsModalOpen(false);
    setResult(null);
    setMonsterName('');
    setCurrentTipIndex(0);
    setModalStep('loading');
    setShouldRestartCamera(true);
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
    shouldRestartCamera,
    capturedImage,

    // 데이터
    result,
    monsterName,
    monsterRank,
    currentTipIndex,
    error,

    // 핸들러
    handleCapture,
    handleNameChange,
    handleNameSubmit,
    handleNextTip,
    handleRelease,
    handleCaptureAgain,
    handleGoToCollection,
    handleErrorDismiss,
  };
}