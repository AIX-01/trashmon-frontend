'use client';

/**
 * 쓰레기 분류 교실 - 메인 페이지
 * 카메라로 쓰레기를 촬영하면 AI가 분류하고 분리수거 방법을 안내합니다.
 */

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import CameraCapture from '@/components/CameraCapture';
import MonsterCharacter from '@/components/MonsterCharacter';
import RecyclingGuide from '@/components/RecyclingGuide';
import { CollectionData } from '@/types';
import { MONSTER_DATA } from '@/lib/monsters';

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
      setError('몬스터를 찾는 데 실패했어요. 서버에 문제가 있나봐요!');
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
          <Link 
            href="/collection"
            className="p-3 bg-white rounded-2xl shadow-md"
            aria-label="도감 보기"
          >
            <span className="text-3xl">📚</span>
          </Link>
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
