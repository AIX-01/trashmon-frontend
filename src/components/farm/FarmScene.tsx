'use client';

import React from 'react';
import { Sun, Cloud } from 'lucide-react';

const clouds = [
  { top: '10%', left: '5%', scale: 1, duration: '40s', opacity: 0.9 },
  { top: '20%', left: '80%', scale: 0.8, duration: '50s', opacity: 0.7 },
  { top: '5%', left: '50%', scale: 1.2, duration: '45s', opacity: 0.8 },
  { top: '15%', left: '20%', scale: 0.9, duration: '55s', opacity: 0.6 },
];

const FarmScene: React.FC = () => {
  return (
    <>
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

      {/* 바닥 (잔디) */}
      <div className="absolute bottom-0 w-full h-[50%] bg-gradient-to-t from-green-600 to-green-400" />
    </>
  );
};

export default FarmScene;