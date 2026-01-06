'use client';

import React, { useState, useCallback } from 'react';
import { useFarm } from '@/hooks/useFarm';
import Monster from '@/components/farm/Monster';
import FarmScene from '@/components/farm/FarmScene';
import FarmUI from '@/components/farm/FarmUI';
import { FarmMonster } from '@/types/farm';

export default function FarmPage() {
  const {
    monsters,
    isLoading,
    isDragging,
    containerRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleMonsterClick,
  } = useFarm();

  const [selectedMonster, setSelectedMonster] = useState<FarmMonster | null>(null);

  const handleContextMenu = useCallback((e: React.MouseEvent, monster: FarmMonster) => {
    e.preventDefault();
    setSelectedMonster(monster);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMonster(null);
  }, []);

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
      onContextMenu={(e) => e.preventDefault()}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Jua&display=swap');
        .font-jua { font-family: 'Jua', sans-serif; }
        @keyframes drift { from { transform: translateX(-150px); } to { transform: translateX(100vw); } }
        @keyframes ray-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bounce-fast { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        @keyframes sleep-z { 0% { opacity: 0; transform: translate(0, 0) scale(0.5); } 50% { opacity: 1; } 100% { opacity: 0; transform: translate(10px, -20px) scale(1.2); } }
        @keyframes wiggle { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
        @keyframes happy-jump { 0%, 100% { transform: translateY(0) scale(1); } 25% { transform: translateY(-30px) scale(1.1); } 50% { transform: translateY(0) scale(0.95); } 75% { transform: translateY(-15px) scale(1.05); } }
        .animate-drift { animation: drift linear infinite; }
        .animate-spin-slow { animation: ray-spin 30s linear infinite; }
        .animate-bounce-fast { animation: bounce-fast 0.6s ease-in-out infinite; }
        .animate-sleep { animation: sleep-z 2s ease-out infinite; }
        .animate-wiggle { animation: wiggle 0.3s ease-in-out infinite; }
        .animate-happy { animation: happy-jump 0.8s ease-in-out infinite; }
      `}</style>

      <FarmScene />
      
      <FarmUI 
        monsterCount={monsters.length}
        selectedMonster={selectedMonster}
        onCloseModal={handleCloseModal}
      />

      <div ref={containerRef} className="absolute inset-0 overflow-hidden touch-none">
        {monsters.length === 0 && !isLoading ? (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <p className="text-4xl mb-4">🍃</p>
            <p className="text-white text-xl font-bold drop-shadow-md">아직 농장이 비어있어요!</p>
            <p className="text-white/80 text-sm mt-2">카메라로 몬스터를 찍어 몬스터를 데려오세요.</p>
          </div>
        ) : (
          monsters.map((monster) => (
            <Monster
              key={monster.id}
              monster={monster}
              isDragging={isDragging}
              onPointerDown={handlePointerDown}
              onClick={handleMonsterClick}
              onContextMenu={handleContextMenu}
            />
          ))
        )}
      </div>
    </div>
  );
}