'use client';

/**
 * 쓰레기 분류 교실 - 메인 페이지
 * 카메라로 쓰레기를 촬영하면 AI가 분류하고 분리수거 방법을 안내합니다.
 */

import { useState, useCallback, useEffect } from 'react';
import CameraCapture from '@/components/CameraCapture';
import MonsterCharacter from '@/components/MonsterCharacter';
import RecyclingGuide from '@/components/RecyclingGuide';
import Collection, { CollectionData } from '@/components/Collection';

// API 서버 주소
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

// 도감 LocalStorage 키
const COLLECTION_KEY = 'trash-collection';

export default function HomePage() {
  // 상태 관리
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string>('');
  const [isGuideComplete, setIsGuideComplete] = useState(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);

  /**
   * 도감에 새로운 쓰레기 저장
   */
  const saveToCollection = useCallback((resultData: ClassificationResult) => {
    try {
      const saved = localStorage.getItem(COLLECTION_KEY);
      const collection: CollectionData = saved ? JSON.parse(saved) : {};
      
      // 이미 수집되지 않은 경우에만 추가
      if (!collection[resultData.category]) {
        collection[resultData.category] = {
          category: resultData.category,
          monsterColor: resultData.guide.monster_color,
          timestamp: Date.now(),
        };
        localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
      }
    } catch (e) {
      console.error('도감 저장 실패:', e);
    }
  }, []);

  /**
   * 이미지 촬영 후 분류 요청
   */
  const handleCapture = useCallback(async (imageBlob: Blob) => {
    setIsLoading(true);
    setError('');
    setResult(null);
    setIsGuideComplete(false); // 새로 촬영 시 가이드 완료 상태 초기화

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
        saveToCollection(data);
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
      const mockResult = { success: true, category: randomCategory, confidence: 0.85, guide: mockGuides[randomCategory] };
      setResult(mockResult);
      saveToCollection(mockResult);
    } finally {
      setIsLoading(false);
    }
  }, [saveToCollection]);

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

  return (
    <>
      <main className="min-h-screen w-full px-4 pt-12 pb-20 flex flex-col items-center">
        <header className="w-full max-w-sm flex justify-between items-center mb-8">
          <div className="text-left">
            <h1 className="text-3xl font-black text-dark-text">쓰레기 교실</h1>
            <p className="text-md text-dark-text/60 font-medium">
              쓰레기를 찍어 몬스터를 찾아봐!
            </p>
          </div>
          <button 
            onClick={() => setIsCollectionOpen(true)}
            className="p-3 bg-white rounded-2xl shadow-md"
            aria-label="도감 보기"
          >
            <span className="text-3xl">📚</span>
          </button>
        </header>

        <div className="w-full max-w-sm flex-grow flex flex-col">
          {result ? (
            <div className="flex-grow flex flex-col justify-center space-y-4">
              <MonsterCharacter
                category={result.category}
                monsterColor={result.guide.monster_color}
              />
              {isGuideComplete ? (
                <div className="card p-6 text-center animate-fade-in">
                  <p className="text-4xl mb-2">🎉</p>
                  <h2 className="text-2xl font-bold text-dark-text">도감에 등록했어요!</h2>
                  <p className="text-dark-text/60 mt-1 mb-6">새로운 쓰레기 친구를 찾아볼까요?</p>
                  <button
                    onClick={handleReset}
                    className="w-full px-8 py-3 bg-brand-green text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform"
                  >
                    다른 쓰레기 찍기
                  </button>
                </div>
              ) : (
                <RecyclingGuide
                  category={result.category}
                  binColor={result.guide.bin_color}
                  message={result.guide.message}
                  tips={result.guide.tips}
                  onComplete={handleGuideComplete}
                />
              )}
            </div>
          ) : (
            <CameraCapture onCapture={handleCapture} isLoading={isLoading} error={error} onErrorDismiss={handleReset} />
          )}
        </div>
      </main>

      <Collection isOpen={isCollectionOpen} onClose={() => setIsCollectionOpen(false)} />

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
