// src/app/collection/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllCollection, createImageUrl, seedDummyData } from '@/lib/collectionStorage';
import HoloCard from './HoloCard';
import { MonsterRank } from '@/types';
import { Sun, Cloud, ArrowLeft, ArrowDownUp } from 'lucide-react';

// 이미지 URL이 포함된 캐릭터 타입
interface CharacterWithUrl {
  id: number;
  category: string;
  monsterName?: string;
  imageUrl: string;
  date: string;
  rawDate: Date;
  rank: MonsterRank;
}

// Farm Component
const FarmPage = () => {
  const [characters, setCharacters] = useState<CharacterWithUrl[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 필터 및 정렬 상태
  const [filterCategory, setFilterCategory] = useState('전체');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    const loadCollection = async () => {
      try {
        // 도감이 비어있으면 더미 데이터 추가
        await seedDummyData();

        const items = await getAllCollection();

        // Blob을 URL로 변환하여 캐릭터 목록 생성
        const charactersWithUrls: CharacterWithUrl[] = items.map(item => ({
          id: item.id!,
          category: item.category,
          monsterName: item.monsterName,
          imageUrl: createImageUrl(item.monsterImage),
          date: item.capturedAt.toLocaleDateString(),
          rawDate: item.capturedAt,
          rank: item.rank,
        }));

        setCharacters(charactersWithUrls);
      } catch (e) {
        console.error('도감 로드 실패:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadCollection();

    // 컴포넌트 언마운트 시 URL 해제
    return () => {
      characters.forEach(char => URL.revokeObjectURL(char.imageUrl));
    };
  }, []);

  // 동적 카테고리 추출 (전체 + 현재 존재하는 카테고리들)
  const categories = ['전체', ...Array.from(new Set(characters.map(char => char.category)))];

  // 필터링 및 정렬 로직 적용
  const filteredCharacters = characters
    .filter(char => {
      if (filterCategory === '전체') return true;
      return char.category === filterCategory;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.rawDate.getTime() - a.rawDate.getTime();
      } else {
        return a.rawDate.getTime() - b.rawDate.getTime();
      }
    });

  // 구름 데이터
  const clouds = [
    { top: '10%', left: '5%', scale: 1, duration: '25s', opacity: 0.9 },
    { top: '20%', left: '80%', scale: 0.8, duration: '30s', opacity: 0.7 },
    { top: '5%', left: '50%', scale: 1.2, duration: '28s', opacity: 0.8 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-blue-100 flex items-center justify-center">
         <div className="absolute top-[-50px] right-[-50px] w-64 h-64 pointer-events-none">
             <Sun className="text-yellow-400 w-full h-full animate-spin-slow opacity-80" />
         </div>
        <p className="text-white text-3xl font-jua animate-bounce">로딩중...</p>
        <style jsx>{`
            @import url('https://fonts.googleapis.com/css2?family=Jua&display=swap');
            .font-jua { font-family: 'Jua', sans-serif; }
            @keyframes ray-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            .animate-spin-slow { animation: ray-spin 20s linear infinite; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-blue-100 p-8 overflow-y-auto overflow-x-hidden relative font-['Jua']">
      
      {/* 스타일 및 애니메이션 정의 */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Jua&display=swap');
        .font-jua { font-family: 'Jua', sans-serif; }
        
        @keyframes drift {
          from { transform: translateX(-150px); }
          to { transform: translateX(100vw); }
        }
        @keyframes ray-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        
        .animate-drift { animation: drift linear infinite; }
        .animate-spin-slow { animation: ray-spin 20s linear infinite; }
        .animate-sway { animation: sway 3s ease-in-out infinite; }
        
        .text-stroke-3 {
            -webkit-text-stroke: 3px #166534;
        }
        
        /* 커스텀 스크롤바 숨김 */
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* 배경 요소: 햇님 */}
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 pointer-events-none fixed">
         <div className="absolute inset-0 bg-yellow-200 rounded-full blur-2xl opacity-50 animate-pulse"></div>
         <Sun className="text-yellow-400 w-full h-full animate-spin-slow opacity-80" />
      </div>

      {/* 배경 요소: 구름 */}
      {clouds.map((cloud, i) => (
        <div
          key={i}
          className="absolute text-white animate-drift pointer-events-none"
          style={{
            top: cloud.top,
            left: cloud.left,
            transform: `scale(${cloud.scale})`,
            animationDuration: cloud.duration,
            opacity: cloud.opacity
          }}
        >
          <Cloud fill="white" size={60 + i * 20} className="drop-shadow-md text-sky-100" />
        </div>
      ))}

      {/* 배경 요소: 날아다니는 새 */}
      <div className="absolute top-32 left-10 animate-drift pointer-events-none" style={{ animationDuration: '20s', animationDelay: '5s' }}>
        <svg width="40" height="25" viewBox="0 0 50 30" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
           <path d="M2 15 Q 12 2, 25 15 T 48 15" />
        </svg>
      </div>

       {/* 배경 요소: 풀밭 레이어 */}
       <div className="fixed bottom-0 left-0 w-full h-32 pointer-events-none z-0">
          <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-green-500 to-green-400 rounded-t-[50px] shadow-[0_-10px_20px_rgba(0,0,0,0.1)]"></div>
          {[...Array(8)].map((_, i) => (
             <div key={i} className="absolute bottom-4 text-pink-300 animate-sway" style={{ left: `${5 + i * 12}%`, animationDelay: `${i * 0.7}s`, fontSize: '24px' }}>
                ✿
             </div>
          ))}
       </div>


      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto pb-32">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
           <div className="flex items-center gap-4">
              <Link href="/" className="bg-white hover:bg-green-50 text-green-600 p-3 rounded-2xl transition shadow-lg border-2 border-green-200 group">
                 <ArrowLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
              </Link>
              <h1 className="text-5xl md:text-6xl font-bold text-white tracking-wide drop-shadow-[0_4px_0_rgba(0,0,0,0.2)] text-stroke-3">
                 나의 도감
              </h1>
           </div>
           
           <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl border-2 border-white shadow-md">
              <span className="text-green-800 font-bold text-xl">
                 수집한 쓰레기: <span className="text-orange-500 text-2xl ml-2">{filteredCharacters.length}</span>
                 <span className="text-sm text-gray-500 ml-1">/ {characters.length}</span>
              </span>
           </div>
        </div>

        {/* Filter & Sort Controls */}
        <div className="bg-white/40 backdrop-blur-md p-4 rounded-3xl border-2 border-white/50 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
            
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`
                            px-4 py-2 rounded-xl font-bold transition-all
                            ${filterCategory === cat 
                                ? 'bg-green-500 text-white shadow-md scale-105' 
                                : 'bg-white text-green-700 hover:bg-green-50'
                            }
                        `}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Sort Toggle */}
            <button 
                onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                className="flex items-center gap-2 bg-white px-5 py-2 rounded-xl text-blue-600 font-bold hover:bg-blue-50 transition shadow-sm"
            >
                <ArrowDownUp size={18} />
                {sortOrder === 'newest' ? '최신순' : '오래된순'}
            </button>
        </div>
  
        {/* Grid Area */}
        {filteredCharacters.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-[50vh] bg-white/30 backdrop-blur-md rounded-3xl border-4 border-white border-dashed p-12">
              <div className="text-8xl mb-6 animate-bounce">📭</div>
              <p className="text-3xl text-green-800 font-bold drop-shadow-sm mb-2">
                  {filterCategory === '전체' ? '아직 수집한 친구가 없어요!' : '해당하는 친구가 없어요!'}
              </p>
              {filterCategory === '전체' && (
                  <Link href="/camera" className="bg-green-500 hover:bg-green-600 text-white text-2xl px-10 py-4 rounded-2xl font-bold shadow-[0_6px_0_#15803d] hover:shadow-[0_4px_0_#15803d] hover:translate-y-[2px] transition-all flex items-center gap-3 mt-6">
                     보물 찾으러 가기! 🚀
                  </Link>
              )}
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
              {filteredCharacters.map((char) => (
                 <div key={char.id} className="transform hover:-translate-y-2 transition-transform duration-300">
                    <HoloCard
                       id={String(char.id)}
                       category={char.category}
                       monsterName={char.monsterName}
                       imageUrl={char.imageUrl}
                       date={char.date}
                       rank={char.rank}
                    />
                 </div>
              ))}
           </div>
        )}
      </div>

    </div>
  );
};

export default FarmPage;