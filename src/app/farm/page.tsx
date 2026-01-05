'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getAllCollection, createImageUrl } from '@/lib/collectionStorage';
import { MonsterRank } from '@/types';
import { Sun, Cloud, ArrowLeft, Music, Volume2, VolumeX } from 'lucide-react';

// 몬스터 타입 정의
interface FarmMonster {
  id: number;
  name: string;
  imageUrl: string;
  rank: MonsterRank;
  x: number; // 농장 내 X 좌표 (%)
  y: number; // 농장 내 Y 좌표 (%)
  speed: number; // 이동 속도
  direction: number; // 이동 방향 (각도)
  scale: number; // 크기 (원근감)
  action: 'idle' | 'walk' | 'jump' | 'sleep'; // 현재 행동
  actionTimer: number; // 행동 지속 시간
}

export default function FarmPage() {
  const [monsters, setMonsters] = useState<FarmMonster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonster, setSelectedMonster] = useState<FarmMonster | null>(null);
  const requestRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  // 몬스터 데이터 로드
  useEffect(() => {
    const loadMonsters = async () => {
      try {
        const items = await getAllCollection();
        
        // 수집한 몬스터들을 농장에 배치
        const farmMonsters: FarmMonster[] = items.map(item => ({
          id: item.id!,
          name: item.monsterName,
          imageUrl: createImageUrl(item.monsterImage),
          rank: item.rank,
          // 초기 위치 랜덤 배치 (화면 하단 2/3 영역)
          x: Math.random() * 90 + 5, 
          y: Math.random() * 40 + 50,
          speed: 0.05 + Math.random() * 0.1,
          direction: Math.random() * 360,
          scale: 0.8 + Math.random() * 0.4,
          action: 'idle',
          actionTimer: Math.random() * 200
        }));

        setMonsters(farmMonsters);
      } catch (e) {
        console.error('농장 로드 실패:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadMonsters();

    return () => {
      monsters.forEach(m => URL.revokeObjectURL(m.imageUrl));
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // 몬스터 AI 및 애니메이션 루프
  useEffect(() => {
    if (isLoading || monsters.length === 0) return;

    const animate = () => {
      setMonsters(prevMonsters => 
        prevMonsters.map(monster => {
          // 선택된 몬스터는 움직이지 않음
          if (selectedMonster?.id === monster.id) return monster;

          let { x, y, direction, action, actionTimer, speed } = monster;

          // 행동 타이머 감소
          actionTimer--;

          // 행동 변경 로직
          if (actionTimer <= 0) {
            const rand = Math.random();
            if (rand < 0.4) action = 'walk';
            else if (rand < 0.7) action = 'idle';
            else if (rand < 0.9) action = 'jump';
            else action = 'sleep';
            
            actionTimer = 100 + Math.random() * 200;
            
            // 걷기 시작할 때 방향 변경
            if (action === 'walk') {
              direction = Math.random() * 360;
            }
          }

          // 이동 로직 (걷기 상태일 때만)
          if (action === 'walk') {
            const rad = direction * (Math.PI / 180);
            x += Math.cos(rad) * speed;
            y += Math.sin(rad) * speed;

            // 벽 충돌 처리 (반사)
            if (x < 5 || x > 95) {
              direction = 180 - direction;
              x = Math.max(5, Math.min(95, x));
            }
            if (y < 50 || y > 90) { // 농장 영역 제한 (화면 하단부)
              direction = 360 - direction;
              y = Math.max(50, Math.min(90, y));
            }
          }

          // Y축 위치에 따른 원근감 처리 (아래로 갈수록 커짐)
          const scale = 0.5 + ((y - 50) / 40) * 0.5;

          return { ...monster, x, y, direction, action, actionTimer, scale };
        })
      );

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isLoading, selectedMonster]);

  // 구름 데이터
  const clouds = [
    { top: '10%', left: '5%', scale: 1, duration: '40s', opacity: 0.9 },
    { top: '20%', left: '80%', scale: 0.8, duration: '50s', opacity: 0.7 },
    { top: '5%', left: '50%', scale: 1.2, duration: '45s', opacity: 0.8 },
    { top: '15%', left: '20%', scale: 0.9, duration: '55s', opacity: 0.6 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-green-100 flex items-center justify-center">
        <p className="text-white text-3xl font-jua animate-bounce">농장 문 여는 중... 🚜</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-green-100 overflow-hidden relative font-['Jua'] select-none">
      
      {/* 스타일 정의 */}
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
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes sleep-z {
          0% { opacity: 0; transform: translate(0, 0) scale(0.5); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translate(10px, -20px) scale(1.2); }
        }
        
        .animate-drift { animation: drift linear infinite; }
        .animate-spin-slow { animation: ray-spin 30s linear infinite; }
        .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
        .animate-sleep { animation: sleep-z 2s ease-out infinite; }
      `}</style>

      {/* 배경 요소: 햇님 */}
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 pointer-events-none">
         <div className="absolute inset-0 bg-yellow-200 rounded-full blur-3xl opacity-60 animate-pulse"></div>
         <Sun className="text-yellow-400 w-full h-full animate-spin-slow opacity-90" />
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
          <Cloud fill="white" size={80 + i * 20} className="drop-shadow-lg text-sky-50" />
        </div>
      ))}

      {/* 배경 요소: 멀리 있는 산 */}
      <div className="absolute bottom-32 left-0 w-full h-64 pointer-events-none opacity-80">
         <div className="absolute bottom-0 left-[-10%] w-[40%] h-48 bg-green-300 rounded-t-full"></div>
         <div className="absolute bottom-0 left-[20%] w-[50%] h-64 bg-green-400 rounded-t-full"></div>
         <div className="absolute bottom-0 right-[-10%] w-[60%] h-56 bg-green-300 rounded-t-full"></div>
      </div>

      {/* UI: 헤더 */}
      <div className="absolute top-0 left-0 w-full p-6 z-50 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto">
          <Link href="/app" className="bg-white/90 hover:bg-white text-green-700 p-3 rounded-2xl shadow-lg border-2 border-green-200 inline-flex items-center gap-2 transition-transform hover:scale-105">
             <ArrowLeft size={24} />
             <span className="font-bold text-lg">나가기</span>
          </Link>
        </div>
        
        <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl border-2 border-white shadow-md">
           <h1 className="text-2xl font-bold text-green-800 flex items-center gap-2">
             🌱 몬스터 농장
             <span className="text-sm bg-green-100 text-green-600 px-2 py-1 rounded-lg ml-2">
               {monsters.length}마리
             </span>
           </h1>
        </div>
      </div>

      {/* 농장 영역 (몬스터들이 돌아다니는 곳) */}
      <div ref={containerRef} className="absolute inset-0 overflow-hidden">
        {/* 바닥 (잔디) */}
        <div className="absolute bottom-0 w-full h-[50%] bg-gradient-to-t from-green-600 to-green-400" />
        
        {/* 몬스터 렌더링 */}
        {monsters.map((monster) => (
          <div
            key={monster.id}
            className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-transform duration-300"
            style={{
              left: `${monster.x}%`,
              top: `${monster.y}%`,
              zIndex: Math.floor(monster.y), // 아래에 있을수록 앞에 보이게
            }}
            onClick={() => setSelectedMonster(monster)}
          >
            <div 
              className="relative group"
              style={{ transform: `scale(${monster.scale})` }}
            >
              {/* 말풍선 (이름) */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                <span className="text-sm font-bold text-gray-700">{monster.name}</span>
              </div>

              {/* 상태 아이콘 (Zzz, 음표 등) */}
              {monster.action === 'sleep' && (
                <div className="absolute -top-8 right-0 text-blue-500 font-bold text-xl animate-sleep">Zzz...</div>
              )}
              {monster.action === 'jump' && (
                <div className="absolute -top-8 left-0 text-orange-500 font-bold text-xl animate-bounce">♪</div>
              )}

              {/* 몬스터 이미지 */}
              <div 
                className={`
                  w-24 h-24 relative transition-all duration-500
                  ${monster.action === 'jump' ? 'animate-bounce-gentle' : ''}
                  ${monster.direction > 90 && monster.direction < 270 ? 'scale-x-[-1]' : ''} /* 방향에 따라 좌우 반전 */
                `}
              >
                {/* 그림자 */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/20 rounded-full blur-sm" />
                
                {/* 본체 */}
                <img 
                  src={monster.imageUrl} 
                  alt={monster.name}
                  className={`
                    w-full h-full object-contain drop-shadow-lg
                    ${monster.action === 'sleep' ? 'brightness-90 grayscale-[0.3]' : ''}
                  `}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 몬스터 상세 정보 모달 (클릭 시) */}
      {selectedMonster && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelectedMonster(null)}>
          <div 
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl transform transition-all scale-100 animate-bounce-gentle"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-48 mb-4 bg-gradient-to-b from-sky-100 to-white rounded-2xl flex items-center justify-center overflow-hidden border-2 border-sky-200">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent opacity-50" />
              <img 
                src={selectedMonster.imageUrl} 
                alt={selectedMonster.name} 
                className="w-40 h-40 object-contain drop-shadow-xl animate-bounce-gentle"
              />
            </div>
            
            <div className="text-center">
              <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold text-sm mb-2">
                {selectedMonster.rank} Rank
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedMonster.name}</h2>
              <p className="text-gray-500 mb-6">
                "안녕! 나는 {selectedMonster.name}이야!<br/>
                오늘도 깨끗한 지구를 위해 힘내자!"
              </p>
              
              <button 
                onClick={() => setSelectedMonster(null)}
                className="w-full bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-3 rounded-2xl shadow-lg transition-colors"
              >
                안녕, 잘 가! 👋
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}