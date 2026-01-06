'use client';

import React from 'react';

interface ParticleProps {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  distance: number;
}

const Particle: React.FC<ParticleProps> = ({ id, x, y, color, angle, distance }) => {
  return (
    <div
      key={id}
      className="absolute w-4 h-4 rounded-full shadow-sm z-10 pointer-events-none"
      style={{ 
        left: x, 
        top: y, 
        backgroundColor: color, 
        '--angle': `${angle}deg`, 
        '--distance': `${distance}px`, 
        animation: 'explode 0.6s ease-out forwards' 
      } as React.CSSProperties}
    />
  );
};

export default Particle;