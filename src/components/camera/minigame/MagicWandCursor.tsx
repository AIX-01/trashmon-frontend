'use client';

import React, { useState, useEffect } from 'react';
import { Wand2 } from 'lucide-react';

const MagicWandCursor: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [hasMouse, setHasMouse] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!hasMouse) setHasMouse(true);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hasMouse]);

  if (!hasMouse) return null;

  return (
    <div 
      className="fixed pointer-events-none z-[100] transition-transform duration-75"
      style={{ 
        left: mousePos.x, 
        top: mousePos.y,
        transform: 'translate(-10%, -10%) rotate(-15deg)'
      }}
    >
      <div className="relative">
        <Wand2 className="w-16 h-16 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]" />
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full animate-ping opacity-75" />
        <div className="absolute top-0 right-0 w-3 h-3 bg-blue-200 rounded-full animate-pulse" />
      </div>
    </div>
  );
};

export default MagicWandCursor;