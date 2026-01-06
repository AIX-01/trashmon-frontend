'use client';

import React from 'react';
import { FarmMonster } from '@/types/farm'; // FarmMonster 타입을 별도 파일로 분리할 예정

interface MonsterProps {
  monster: FarmMonster;
  isDragging: boolean;
  onPointerDown: (e: React.PointerEvent, monsterId: number) => void;
  onClick: (monster: FarmMonster) => void;
  onContextMenu: (e: React.MouseEvent, monster: FarmMonster) => void;
}

const Monster: React.FC<MonsterProps> = ({ monster, isDragging, onPointerDown, onClick, onContextMenu }) => {
  return (
    <div
      key={monster.id}
      className="absolute transform -translate-x-1/2 -translate-y-full cursor-grab active:cursor-grabbing touch-none"
      style={{
        left: `${monster.x}%`,
        top: `${monster.y}%`,
        zIndex: monster.action === 'dragged' ? 100 : Math.floor(monster.y),
        transition: 'transform 0.3s ease-out',
      }}
      onPointerDown={(e) => onPointerDown(e, monster.id)}
      onClick={() => onClick(monster)}
      onContextMenu={(e) => onContextMenu(e, monster)}
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
            w-40 h-40 relative transition-all duration-500
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
  );
};

export default Monster;