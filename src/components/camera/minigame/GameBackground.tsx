'use client';

import React from 'react';
import { Sun, Cloud } from 'lucide-react';

const clouds = [
  { top: '10%', left: '5%', scale: 1, duration: '25s', opacity: 0.9 },
  { top: '20%', left: '80%', scale: 0.8, duration: '30s', opacity: 0.7 },
  { top: '5%', left: '50%', scale: 1.2, duration: '28s', opacity: 0.8 },
];

interface GameBackgroundProps {
  gameState: 'turning' | 'rainbow' | 'playing';
}

const GameBackground: React.FC<GameBackgroundProps> = ({ gameState }) => {
  return (
    <>
      {/* 무지개 효과 */}
      <div className={`absolute inset-0 z-50 flex items-center justify-center pointer-events-none transition-opacity duration-1000 ${gameState === 'rainbow' ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-[200%] h-[200%] bg-[conic-gradient(from_180deg_at_50%_50%,#FF0000_0deg,#FF7F00_30deg,#FFFF00_60deg,#00FF00_120deg,#0000FF_180deg,#4B0082_240deg,#9400D3_300deg,#FF0000_360deg)] opacity-30 blur-3xl animate-spin-slow"></div>
      </div>

      {/* 배경 장식 */}
      <div className={`transition-opacity duration-1000 ${gameState === 'turning' ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 pointer-events-none">
           <div className="absolute inset-0 bg-yellow-200 rounded-full blur-2xl opacity-50 animate-pulse"></div>
           <Sun className="text-yellow-400 w-full h-full animate-spin-slow opacity-80" />
        </div>
        {clouds.map((cloud, i) => (
          <div key={i} className="absolute text-white animate-drift pointer-events-none" style={{...cloud}}>
            <Cloud fill="white" size={80 + i * 20} className="drop-shadow-md text-sky-100" />
          </div>
        ))}
        <div className="absolute bottom-0 left-0 w-full h-32 pointer-events-none z-0">
           <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-green-500 to-green-400 rounded-t-[50px] shadow-[0_-10px_20px_rgba(0,0,0,0.1)]"></div>
           {[...Array(8)].map((_, i) => (
              <div key={i} className="absolute bottom-4 text-pink-300 animate-sway" style={{ left: `${5 + i * 12}%`, animationDelay: `${i * 0.7}s`, fontSize: '32px' }}>✿</div>
           ))}
        </div>
      </div>
    </>
  );
};

export default GameBackground;