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

  // 기록 저장
  const saveToHistory = useCallback((category: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      category,
      timestamp: Date.now(),
    };
    
    const newHistory = [newItem, ...history].slice(0, 10); // 최근 10개만 유지
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

    try {
      // FormData 생성
      const formData = new FormData();
      formData.append('file', imageBlob, 'capture.jpg');

      // API 요청
      const response = await fetch(`${API_URL}/classify`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      const data: ClassificationResult = await response.json();

      if (data.success) {
        setResult(data);
        saveToHistory(data.category);
      } else {
        setError('분류에 실패했어요. 다시 시도해주세요!');
      }
    } catch (err) {
      console.error('분류 요청 실패:', err);
      
      // 개발용 모의 결과 (서버 연결 실패 시)
      const mockCategories = ['종이', '유리', '플라스틱', '캔', '일반쓰레기'];
      const randomCategory = mockCategories[Math.floor(Math.random() * mockCategories.length)];
      
      const mockGuides: Record<string, ClassificationResult['guide']> = {
        '종이': {
          bin_color: '파란색',
          message: '종이는 파란색 분리수거함에 넣어요! 📦',
          tips: ['물에 젖은 종이는 일반쓰레기에 버려요', '테이프나 스티커는 떼어내요'],
          monster_color: '#4A90D9'
        },
        '유리': {
          bin_color: '초록색',
          message: '유리병은 초록색 분리수거함에 넣어요! 🍾',
          tips: ['병 안을 깨끗이 헹궈요', '뚜껑은 따로 분리해요'],
          monster_color: '#7CB342'
        },
        '플라스틱': {
          bin_color: '노란색',
          message: '플라스틱은 노란색 분리수거함에 넣어요! 🥤',
          tips: ['라벨을 떼어요', '깨끗이 씻어서 버려요'],
          monster_color: '#FFD54F'
        },
        '캔': {
          bin_color: '빨간색',
          message: '캔은 빨간색 분리수거함에 넣어요! 🥫',
          tips: ['납작하게 눌러서 버려요', '안을 깨끗이 헹궈요'],
          monster_color: '#EF5350'
        },
        '일반쓰레기': {
          bin_color: '검은색',
          message: '일반쓰레기는 검은색 쓰레기통에 넣어요! 🗑️',
          tips: ['음식물이 묻은 것은 일반쓰레기에요', '재활용이 안 되는 것들이에요'],
          monster_color: '#78909C'
        }
      };

      // 모의 결과 설정 (개발 모드)
      setResult({
        success: true,
        category: randomCategory,
        confidence: 0.85,
        guide: mockGuides[randomCategory]
      });
      saveToHistory(randomCategory);
    } finally {
      setIsLoading(false);
    }
  }, [saveToHistory]);

  /**
   * 다시 시작
   */
  const handleReset = useCallback(() => {
    setResult(null);
    setError('');
  }, []);

  return (
    <main className="min-h-screen px-4 py-8 pb-24">
      {/* 헤더 */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-black text-white mb-2 flex items-center justify-center gap-2">
          <span className="text-4xl">🌍</span>
          쓰레기 분류 교실
          <span className="text-4xl">♻️</span>
        </h1>
        <p className="text-white/70">
          쓰레기를 촬영하면 분리수거 방법을 알려줘요!
        </p>
      </header>

      {/* 메인 컨텐츠 영역 */}
      <div className="max-w-md mx-auto">
        {/* 카메라 (결과가 없을 때만 표시) */}
        {!result && (
          <CameraCapture onCapture={handleCapture} isLoading={isLoading} />
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="glass-card p-6 text-center mt-6">
            <p className="text-xl mb-2">😢</p>
            <p className="text-white font-medium">{error}</p>
            <button
              onClick={handleReset}
              className="mt-4 px-6 py-2 bg-white/20 rounded-full text-white font-bold hover:bg-white/30 transition-colors"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 분류 결과 */}
        {result && (
          <div className="space-y-6">
            {/* 몬스터 캐릭터 */}
            <MonsterCharacter
              category={result.category}
              monsterColor={result.guide.monster_color}
              isVisible={true}
            />

            {/* 분리수거 안내 */}
            <RecyclingGuide
              category={result.category}
              binColor={result.guide.bin_color}
              message={result.guide.message}
              tips={result.guide.tips}
              isVisible={true}
            />
          </div>
        )}

        {/* 최근 분류 기록 (결과가 없을 때만 표시) */}
        {!result && history.length > 0 && (
          <div className="glass-card p-6 mt-8">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>📋</span>
              최근 분류 기록
            </h3>
            <div className="flex flex-wrap gap-2">
              {history.slice(0, 5).map((item) => (
                <span
                  key={item.id}
                  className="px-3 py-1 bg-white/20 rounded-full text-white text-sm font-medium"
                >
                  {item.category}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 푸터 */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent py-4">
        <p className="text-center text-white/50 text-xs">
          🌱 분리수거를 잘 하면 지구가 깨끗해져요!
        </p>
      </footer>
    </main>
  );
}
