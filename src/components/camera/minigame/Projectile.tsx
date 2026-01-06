'use client';

import React from 'react';

interface ProjectileProps {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  onAnimationEnd: () => void;
}

const Projectile: React.FC<ProjectileProps> = ({ id, startX, startY, targetX, targetY, onAnimationEnd }) => {
  return (
    <div
      key={id}
      className="absolute w-16 h-16 z-20 pointer-events-none"
      style={{ 
        left: startX, 
        top: startY, 
        '--target-x': `${targetX}px`, 
        '--target-y': `${targetY}px`, 
        animation: 'throwBall 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' 
      } as React.CSSProperties}
      onAnimationEnd={onAnimationEnd}
    >
      <div className="w-full h-full flex items-center justify-center animate-spin">
        <span className="text-5xl select-none drop-shadow-lg">💧</span>
      </div>
    </div>
  );
};

export default Projectile;