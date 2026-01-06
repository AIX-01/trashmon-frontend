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
    setResult(null);
    setCurrentTipIndex(0);

    const imageUrl = URL.createObjectURL(imageBlob);
    setCapturedImage(imageUrl);

    try {
      const formData = new FormData();
      formData.append('file', imageBlob, 'capture.jpg');
      const response = await fetch(`${API_URL}/classify`, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('API request failed');
      const apiData: unknown = await response.json();
      console.log('API Response:', apiData); // 응답 로깅 추가
      if (!apiData || typeof apiData !== 'object' || !('category' in apiData) || !('monster_image' in apiData) || typeof (apiData as ApiResponse).category !== 'string' || typeof (apiData as ApiResponse).monster_image !== 'string') {
        throw new Error('Invalid API response');
      }
      const validatedData = apiData as ApiResponse;
      if (!isValidCategory(validatedData.category)) {
        throw new Error('Invalid category');
      }
      const guide = getGuideByCategory(validatedData.category);
      if (!guide) throw new Error('Guide not found');

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
      console.error('Classification failed:', err);
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
    setShouldRestartCamera(true);
  }, []);

  const handleRelease = resetState;
  const handleCaptureAgain = resetState;

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
    handleCapture,
    handleNameChange,
    handleNameSubmit,
    handleStartGuide,
    handleNextTip,
    handleRelease,
    handleCaptureAgain,
  };
}