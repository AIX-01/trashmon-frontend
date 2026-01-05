import { useState, useCallback, useEffect, useRef } from 'react';
import { ApiResponse, ClassificationResult, MonsterRank } from '@/types';
import { saveToCollection } from '@/lib/collectionStorage';
import { getGuideByCategory, generateRandomRank, isValidCategory } from '@/lib/monsters';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const LOADING_MESSAGES = [
  '깨끗해지고 있어... ✨',
  '어떤 친구일까? 🤔',
  '깨끗이 씻어주자... 💧',
];

export type ModalStep = 'loading' | 'intro' | 'guide' | 'naming' | 'complete' | 'error';

export function useClassification() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>('loading');
  const [shouldRestartCamera, setShouldRestartCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string>('');

  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const messageIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [monsterName, setMonsterName] = useState('');
  const [monsterRank, setMonsterRank] = useState<MonsterRank>('C');
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (modalStep === 'loading' && isModalOpen) {
      let messageIndex = 0;
      setLoadingMessage(LOADING_MESSAGES[0]);
      messageIntervalRef.current = setInterval(() => {
        messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
        setLoadingMessage(LOADING_MESSAGES[messageIndex]);
      }, 3000);
    } else {
      if (messageIntervalRef.current) {
        clearInterval(messageIntervalRef.current);
        messageIntervalRef.current = null;
      }
    }
    return () => {
      if (messageIntervalRef.current) clearInterval(messageIntervalRef.current);
    };
  }, [modalStep, isModalOpen]);

  const handleCapture = useCallback(async (imageBlob: Blob) => {
    setShouldRestartCamera(false);
    setIsModalOpen(true);
    setModalStep('loading');
    setError('');
    setResult(null);
    setCurrentTipIndex(0);

    const imageUrl = URL.createObjectURL(imageBlob);
    setCapturedImage(imageUrl);

    try {
      const formData = new FormData();
      formData.append('file', imageBlob, 'capture.jpg');
      const response = await fetch(`${API_URL}/classify`, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('앗, 연결이 잘 안 돼요! 잠시 후 다시 시도해주세요.');
      const apiData: unknown = await response.json();
      if (!apiData || typeof apiData !== 'object' || !('category' in apiData) || !('monster_image' in apiData) || typeof (apiData as ApiResponse).category !== 'string' || typeof (apiData as ApiResponse).monster_image !== 'string') {
        throw new Error('앗, 뭔가 잘못됐어요! 다시 찍어볼까요?');
      }
      const validatedData = apiData as ApiResponse;
      if (!isValidCategory(validatedData.category)) {
        throw new Error('음... 이게 뭔지 모르겠어요! 다른 쓰레기를 찍어볼까요?');
      }
      const guide = getGuideByCategory(validatedData.category);
      if (!guide) throw new Error('어라? 분리수거 방법을 찾을 수 없어요!');

      const classificationResult: ClassificationResult = {
        category: validatedData.category,
        monster_image: validatedData.monster_image,
        guide,
      };

      setResult(classificationResult);
      setMonsterName(`${validatedData.category}몬`);
      setMonsterRank(generateRandomRank());
      setModalStep('intro');
    } catch (err) {
      console.error('분류 요청 실패:', err);
      setError(err instanceof Error ? err.message : '몬스터를 찾는 데 실패했어요.');
      setModalStep('error');
    }
  }, []);

  const handleNameChange = useCallback((name: string) => {
    setMonsterName(name);
  }, []);

  const handleNameSubmit = useCallback(async () => {
    if (!result) return;
    await saveToCollection(result, monsterName, monsterRank);
    setModalStep('complete');
  }, [result, monsterName, monsterRank]);

  const handleStartGuide = useCallback(() => {
    setModalStep('guide');
    setCurrentTipIndex(0);
  }, []);

  const handleNextTip = useCallback(() => {
    if (!result) return;
    const tips = result.guide?.tips || [];
    if (currentTipIndex < tips.length - 1) {
      setCurrentTipIndex(prev => prev + 1);
    } else {
      setModalStep('naming');
    }
  }, [result, currentTipIndex]);

  const resetState = useCallback(() => {
    setIsModalOpen(false);
    setResult(null);
    setMonsterName('');
    setMonsterRank('C');
    setCurrentTipIndex(0);
    setModalStep('loading');
    setShouldRestartCamera(true);
  }, []);

  const handleRelease = resetState;
  const handleCaptureAgain = resetState;
  const handleGoToCollection = () => setIsModalOpen(false);
  const handleErrorDismiss = () => {
    setError('');
    setIsModalOpen(false);
  };

  return {
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
    handleStartGuide,
    handleNextTip,
    handleRelease,
    handleCaptureAgain,
    handleGoToCollection,
    handleErrorDismiss,
  };
}