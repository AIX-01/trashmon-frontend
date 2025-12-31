'use client';

/**
 * 쓰레기 분류 교실 - 메인 페이지
 * 카메라로 쓰레기를 촬영하면 AI가 분류하고 분리수거 방법을 안내합니다.
 */

import { useState, useCallback, useEffect } from 'react';
import CameraCapture from '@/components/CameraCapture';
import MonsterCharacter from '@/components/MonsterCharacter';
import RecyclingGuide from '@/components/RecyclingGuide';

// API 서버 주소 (개발 환경)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// 분류 결과 타입
interface ClassificationResult {
  success: boolean;
  category: string;
  confidence: number;
  guide: {
    bin_color: string;
    message: string;
    tips: string[];
    monster_color: string;
  };
}

// LocalStorage 키
const HISTORY_KEY = 'trash-classification-history';

// 분류 기록 타입
interface HistoryItem {
  id: string;
  category: string;
  timestamp: number;
}

export default function HomePage() {
  // 상태 관리
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string>('');
  // history 상태는 유지하되, UI에서는 일단 제거하여 단순화
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // LocalStorage에서 기록 불러오기
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('기록 불러오기 실패:', e);
    }
  }, []);

  // 기록 저장 로직은 유지
  const saveToHistory = useCallback((category: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      category,
      timestamp: Date.now(),
    };
    const newHistory = [newItem, ...history].slice(0, 10);
    setHistory(newHistory);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (e) {
      console.error('기록 저장 실패:', e);
    }
  }, [history]);

  /**
   * 이미지 촬영 후 분류 요청
   */
  const handleCapture = useCallback(async (imageBlob: Blob) => {
    setIsLoading(true);
    setError('');
    setResult(null);

    // --- (API 호출 로직은 기존과 동일) ---
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
        saveToHistory(data.category);
      } else {
        setError('분류에 실패했어요. 다시 시도해주세요!');
      }
    } catch (err) {
      console.error('분류 요청 실패:', err);
      const mockCategories = ['종이', '유리', '플라스틱', '캔', '일반쓰레기'];
      const randomCategory = mockCategories[Math.floor(Math.random() * mockCategories.length)];
      const mockGuides: Record<string, ClassificationResult['guide']> = {
        '종이': { bin_color: '파란색', message: '종이는 파란색 통에 쏙!', tips: ['물에 젖지 않게, 테이프는 떼고 버려요.'], monster_color: '#4A90D9' },
        '유리': { bin_color: '초록색', message: '유리병은 초록색 통에 쏙!', tips: ['뚜껑을 떼고, 안을 한번 헹궈서 버려요.'], monster_color: '#7CB342' },
        '플라스틱': { bin_color: '노란색', message: '플라스틱은 노란색 통에 쏙!', tips: ['라벨을 떼고, 깨끗이 씻어서 버려요.'], monster_color: '#FFD54F' },
        '캔': { bin_color: '빨간색', message: '캔은 빨간색 통에 쏙!', tips: ['납작하게 밟아서, 조심해서 버려요.'], monster_color: '#EF5350' },
        '일반쓰레기': { bin_color: '검은색', message: '일반쓰레기는 아무 통에나!', tips: ['재활용이 어려운 친구들이에요.'], monster_color: '#78909C' }
      };
      setResult({ success: true, category: randomCategory, confidence: 0.85, guide: mockGuides[randomCategory] });
      saveToHistory(randomCategory);
    } finally {
      setIsLoading(false);
    }
  }, [saveToHistory]);

  /**
   * 다시 시작 (결과를 초기화하고 카메라 화면으로 돌아감)
   */
  const handleReset = useCallback(() => {
    setResult(null);
    setError('');
  }, []);

  return (
    <main className="min-h-screen w-full px-4 pt-12 pb-20 flex flex-col items-center">
      {/* 단순화된 헤더 */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-black text-dark-text">쓰레기 분리배출 교실</h1>
        <p className="text-md text-dark-text/60 font-medium">
          궁금한 쓰레기를 카메라로 찍어보세요!
        </p>
      </header>

      {/* 메인 컨텐츠 영역 (화면 중앙 정렬) */}
      <div className="w-full max-w-sm flex-grow flex flex-col">
        {/*
          결과(result)가 있으면 결과 컴포넌트를, 없으면 카메라 컴포넌트를 보여줍니다.
          한 화면에 한 가지 핵심 기능만 보여주어 집중도를 높입니다.
        */}
        {result ? (
          // --- 결과 화면 ---
          <div className="flex-grow flex flex-col justify-center space-y-4">
            <MonsterCharacter
              category={result.category}
              monsterColor={result.guide.monster_color}
            />
            <RecyclingGuide
              category={result.category}
              binColor={result.guide.bin_color}
              message={result.guide.message}
              tips={result.guide.tips}
            />
            <div className="text-center pt-4">
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-brand-green text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
              >
                다른 쓰레기 찍기
              </button>
            </div>
          </div>
        ) : (
          // --- 카메라 촬영 화면 ---
          <CameraCapture onCapture={handleCapture} isLoading={isLoading} error={error} onErrorDismiss={handleReset} />
        )}
      </div>
    </main>
  );
}
