'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { getAllCollection, createImageUrl } from '@/lib/collectionStorage';
import { MonsterRank } from '@/types';
import { Sun, Cloud, ArrowLeft } from 'lucide-react';
import HoloCard from '@/app/collection/HoloCard';

// 몬스터 타입 정의
interface FarmMonster {
  id: number;
  name: string;
  imageUrl: string;
  rank: MonsterRank;
  category: string;
  capturedAt: Date;
  x: number; // 농장 내 X 좌표 (%)
  y: number; // 농장 내 Y 좌표 (%)
  speed: number; // 이동 속도
  direction: number; // 이동 방향 (각도)
  scale: number; // 크기 (원근감)
  action: 'idle' | 'walk' | 'jump' | 'sleep' | 'dragged' | 'happy'; // 현재 행동
  actionTimer: number; // 행동 지속 시간
}

export default function FarmPage() {
  const [monsters, setMonsters] = useState<FarmMonster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonster, setSelectedMonster] = useState<FarmMonster | null>(null);
  
  // 드래그 관련 상태
  const [isDragging, setIsDragging] = useState(false);
  const draggedMonsterIdRef = useRef<number | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();

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
          category: item.category,
          capturedAt: item.capturedAt,
          // 초기 위치 랜덤 배치 (화면 하단 2/3 영역)
          x: Math.random() * 80 + 10, 
          y: Math.random() * 30 + 60,
          // 속도를 더욱 낮춤 (0.005 ~ 0.015) - 아주 천천히 움직임
          speed: 0.005 + Math.random() * 0.01,
          direction: Math.random() * 360,
          scale: 1.0, 
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
          // 드래그 중이거나 선택된 몬스터는 AI 이동 중지
          if (monster.id === draggedMonsterIdRef.current || selectedMonster?.id === monster.id) {
            return { ...monster, action: monster.id === draggedMonsterIdRef.current ? 'dragged' : monster.action };
          }

          let { x, y, direction, action, actionTimer, speed } = monster;

          // 행동 타이머 감소 (자는 중에는 감소 안 함 -> 영원히 잠)
          if (action !== 'sleep') {
            actionTimer--;
          }

          // 행동 변경 로직
          if (actionTimer <= 0) {
            // happy 상태가 끝나면 idle로 복귀
            if (action === 'happy') {
              action = 'idle';
              actionTimer = 100 + Math.random() * 100;
            } else {
              const rand = Math.random();
              // 행동 패턴 조정
              if (rand < 0.2) action = 'walk';       // 20% 걷기
              else if (rand < 0.6) action = 'idle';  // 40% 대기
              else if (rand < 0.7) action = 'jump';  // 10% 점프
              else action = 'sleep';                 // 30% 잠 (한번 자면 깨울 때까지 잠)
              
              // 행동 지속 시간 (300 ~ 800 프레임)
              actionTimer = 300 + Math.random() * 500;
              
              if (action === 'walk' || action === 'jump') {
                direction = Math.random() * 360;
              }
            }
          }

          // 이동 로직
          if (action === 'walk' || action === 'jump') {
            // 점프할 때 속도 배율을 낮춤 (1.5 -> 1.2)
            const moveSpeed = action === 'jump' ? speed * 1.2 : speed;
            const rad = direction * (Math.PI / 180);
            x += Math.cos(rad) * moveSpeed;
            y += Math.sin(rad) * moveSpeed;

            // 벽 충돌 처리 (부드럽게 방향 전환)
            if (x < 5 || x > 95) {
              direction = 180 - direction + (Math.random() * 20 - 10);
              x = Math.max(5, Math.min(95, x));
            }
            if (y < 50 || y > 90) {
              direction = 360 - direction + (Math.random() * 20 - 10);
              y = Math.max(50, Math.min(90, y));
            }
          }

          // 원근감 처리
          const scale = 0.6 + ((y - 50) / 40) * 0.8;

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

  // 드래그 시작 핸들러
  const handlePointerDown = (e: React.PointerEvent, monsterId: number) => {
    // 우클릭은 무시 (컨텍스트 메뉴용)
    if (e.button === 2) return;

    e.preventDefault();
    e.stopPropagation();
    
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    // 현재 몬스터 위치 찾기
    const monster = monsters.find(m => m.id === monsterId);
    if (!monster) return;

    // 몬스터의 현재 화면상 좌표 계산
    const monsterScreenX = (monster.x / 100) * rect.width;
    const monsterScreenY = (monster.y / 100) * rect.height;

    // 오프셋 저장 (클릭한 지점과 몬스터 중심 간의 차이)
    dragOffsetRef.current = {
      x: clientX - rect.left - monsterScreenX,
      y: clientY - rect.top - monsterScreenY
    };

    draggedMonsterIdRef.current = monsterId;
    setIsDragging(true);
    
    // 드래그 시작 시 몬스터 상태 업데이트 (위로 띄우기 등)
    setMonsters(prev => prev.map(m => 
      m.id === monsterId ? { ...m, action: 'dragged', scale: 1.2 } : m
    ));
  };

  // 드래그 이동 핸들러 (전역)
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || draggedMonsterIdRef.current === null || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    // 새로운 좌표 계산 (오프셋 적용)
    let newX = ((e.clientX - rect.left - dragOffsetRef.current.x) / rect.width) * 100;
    let newY = ((e.clientY - rect.top - dragOffsetRef.current.y) / rect.height) * 100;

    // 화면 밖으로 나가지 않게 제한
    newX = Math.max(5, Math.min(95, newX));
    newY = Math.max(50, Math.min(90, newY)); // 바닥 영역 제한

    setMonsters(prev => prev.map(m => 
      m.id === draggedMonsterIdRef.current 
        ? { ...m, x: newX, y: newY } 
        : m
    ));
  }, [isDragging]);

  // 드래그 종료 핸들러 (전역)
  const handlePointerUp = useCallback(() => {
    if (isDragging && draggedMonsterIdRef.current !== null) {
      const droppedId = draggedMonsterIdRef.current;
      
      setMonsters(prev => prev.map(m => 
        m.id === droppedId 
          ? { ...m, action: 'idle', scale: 0.6 + ((m.y - 50) / 40) * 0.8 } 
          : m
      ));

      draggedMonsterIdRef.current = null;
      setIsDragging(false);
    }
  }, [isDragging]);

  // 클릭(터치) 핸들러 - 상호작용 (점프/행복/깨우기)
  const handleMonsterClick = (monster: FarmMonster) => {
    if (!isDragging) {
      // 몬스터를 클릭하면 행복해하며 점프함 (자고 있으면 깨어남)
      setMonsters(prev => prev.map(m => 
        m.id === monster.id 
          ? { ...m, action: 'happy', actionTimer: 60 } // 60프레임(약 1초) 동안 happy 상태
          : m
      ));
    }
  };

  // 우클릭 핸들러 - 정보 보기
  const handleContextMenu = (e: React.MouseEvent, monster: FarmMonster) => {
    e.preventDefault(); // 기본 컨텍스트 메뉴 방지
    setSelectedMonster(monster);
  };

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
    <div 
      className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-green-100 overflow-hidden relative font-['Jua'] select-none touch-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onContextMenu={(e) => e.preventDefault()} // 전체 화면 우클릭 방지
    >
      
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
        @keyframes bounce-fast {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes sleep-z {
          0% { opacity: 0; transform: translate(0, 0) scale(0.5); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translate(10px, -20px) scale(1.2); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes happy-jump {
          0%, 100% { transform: translateY(0) scale(1); }
          25% { transform: translateY(-30px) scale(1.1); }
          50% { transform: translateY(0) scale(0.95); }
          75% { transform: translateY(-15px) scale(1.05); }
        }
        
        .animate-drift { animation: drift linear infinite; }
        .animate-spin-slow { animation: ray-spin 30s linear infinite; }
        .animate-bounce-fast { animation: bounce-fast 0.6s ease-in-out infinite; }
        .animate-sleep { animation: sleep-z 2s ease-out infinite; }
        .animate-wiggle { animation: wiggle 0.3s ease-in-out infinite; }
        .animate-happy { animation: happy-jump 0.8s ease-in-out infinite; }
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
      <div ref={containerRef} className="absolute inset-0 overflow-hidden touch-none">
        {/* 바닥 (잔디) */}
        <div className="absolute bottom-0 w-full h-[50%] bg-gradient-to-t from-green-600 to-green-400" />
        
        {/* 몬스터 렌더링 */}
        {monsters.length === 0 ? (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <p className="text-4xl mb-4">🍃</p>
            <p className="text-white text-xl font-bold drop-shadow-md">아직 농장이 비어있어요!</p>
            <p className="text-white/80 text-sm mt-2">카메라로 쓰레기를 찍어 몬스터를 데려오세요.</p>
          </div>
        ) : (
          monsters.map((monster) => (
            <div
              key={monster.id}
              className="absolute transform -translate-x-1/2 -translate-y-full cursor-grab active:cursor-grabbing touch-none"
              style={{
                left: `${monster.x}%`,
                top: `${monster.y}%`,
                zIndex: monster.action === 'dragged' ? 100 : Math.floor(monster.y),
                // ✨ FIX: 위치(left, top)에 대한 transition 제거, transform만 유지
                transition: 'transform 0.3s ease-out',
              }}
              onPointerDown={(e) => handlePointerDown(e, monster.id)}
              onClick={() => handleMonsterClick(monster)}
              onContextMenu={(e) => handleContextMenu(e, monster)}
            >
              <div 
                className={`relative group ${monster.action === 'dragged' ? 'animate-wiggle' : ''} ${monster.action === 'happy' ? 'animate-happy' : ''}`}
                style={{ transform: `scale(${monster.scale})` }}
              >
                {/* 말풍선 (이름) */}
                <div className={`absolute -top-6 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 rounded-xl shadow-sm transition-opacity whitespace-nowrap pointer-events-none z-20 ${monster.action === 'dragged' || monster.action === 'happy' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  <span className="text-sm font-bold text-gray-700">{monster.name}</span>
                </div>

                {/* 상태 아이콘 */}
                {monster.action === 'sleep' && (
                  <div className="absolute -top-8 right-0 text-blue-500 font-bold text-xl animate-sleep">Zzz...</div>
                )}
                {monster.action === 'jump' && (
                  <div className="absolute -top-8 left-0 text-orange-500 font-bold text-xl animate-bounce">♪</div>
                )}
                {monster.action === 'happy' && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-red-500 font-bold text-2xl animate-bounce">❤️</div>
                )}

                {/* 몬스터 이미지 */}
                <div 
                  className={`
                    w-32 h-32 relative transition-all duration-500
                    ${monster.action === 'jump' ? 'animate-bounce-fast' : ''}
                    ${monster.direction > 90 && monster.direction < 270 ? 'scale-x-[-1]' : ''}
                  `}
                >
                  {/* 그림자 */}
                  <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 bg-black/20 rounded-full blur-sm transition-all duration-300 ${monster.action === 'dragged' ? 'w-10 h-2 opacity-50' : 'w-20 h-5'}`} />
                  
                  {/* 본체 */}
                  <img 
                    src={monster.imageUrl} 
                    alt={monster.name}
                    className={`
                      w-full h-full object-contain drop-shadow-lg select-none pointer-events-none
                      ${monster.action === 'sleep' ? 'brightness-90 grayscale-[0.3]' : ''}
                    `}
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 몬스터 상세 정보 모달 (HoloCard 재활용) */}
      {selectedMonster && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelectedMonster(null)}>
          <div 
            className="transform transition-all scale-100 animate-bounce-gentle"
            onClick={(e) => e.stopPropagation()}
          >
            <HoloCard
              id={selectedMonster.id}
              category={selectedMonster.category}
              monsterName={selectedMonster.name}
              imageUrl={selectedMonster.imageUrl}
              date={selectedMonster.capturedAt.toLocaleDateString()}
              rank={selectedMonster.rank}
              // 농장에서는 수정/삭제 기능 비활성화 (읽기 전용)
            />
            
            <button 
              onClick={() => setSelectedMonster(null)}
              className="w-full bg-white/90 hover:bg-white text-green-600 font-bold py-3 rounded-2xl shadow-lg mt-4 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}

    </div>
  );
}