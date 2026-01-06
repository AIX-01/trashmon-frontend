'use client';

import React from 'react';

interface TargetProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
  targetPos: { x: number; y: number };
  isTargetHit: boolean;
  gameState: 'turning' | 'rainbow' | 'playing';
  capturedImage: string;
  hp: number; // 체력 (0.0 ~ 1.0)
  score: number;
}

const Target: React.FC<TargetProps> = ({
  targetRef,
  targetPos,
  isTargetHit,
  gameState,
  capturedImage,
  hp,
  score,
}) => {
  const dirtOpacity = hp; // hp를 오염 효과의 투명도로 사용

  return (
    <div 
      ref={targetRef}
      className={`absolute transition-all duration-[2000ms] ease-in-out z-10 ${isTargetHit ? 'scale-110 brightness-110' : 'scale-100'} ${gameState === 'turning' ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}
      style={{ left: `${targetPos.x}%`, top: `${targetPos.y}%`, transform: 'translate(-50%, -50%)', transitionProperty: 'left, top, transform, opacity, filter' }}
    >
      <div className="relative w-72 h-72 animate-float">
        <div 
          className="w-full h-full shadow-2xl relative"
          style={{
            maskImage: 'radial-gradient(circle, white 50%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(circle, white 50%, transparent 75%)',
          }}
        >
           <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${capturedImage})` }} />
           
           {/* 오염 효과 오버레이 */}
           <div 
             className="absolute inset-0 transition-opacity duration-500 pointer-events-none z-10"
             style={{ 
               opacity: dirtOpacity,
               background: `
                 radial-gradient(circle at 20% 30%, rgba(60, 50, 40, 0.9) 0%, transparent 30%),
                 radial-gradient(circle at 70% 60%, rgba(70, 60, 50, 0.8) 0%, transparent 35%),
                 radial-gradient(circle at 40% 80%, rgba(50, 40, 30, 0.9) 0%, transparent 25%),
                 radial-gradient(circle at 80% 20%, rgba(80, 70, 60, 0.8) 0%, transparent 30%),
                 radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.3) 0%, transparent 100%)
               `,
               mixBlendMode: 'multiply'
             }}
           />
           <div 
             className="absolute inset-0 bg-stone-700/50 mix-blend-hard-light transition-opacity duration-500 pointer-events-none z-10"
             style={{ opacity: dirtOpacity }}
           />

           {/* 스크래치 효과 오버레이 */}
           <div 
            className="absolute inset-0 transition-opacity duration-500 pointer-events-none z-10"
            style={{ opacity: dirtOpacity * 0.7, mixBlendMode: 'overlay' }}
           >
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="scratches" patternUnits="userSpaceOnUse" width="100" height="100">
                  <path d="M0 10 L100 10 M10 0 L10 100 M20 0 L20 100 M0 30 L100 30 M0 50 L100 50 M0 70 L100 70 M0 90 L100 90" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                  <path d="M5 5 L95 95 M5 95 L95 5" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#scratches)"/>
            </svg>
           </div>

           {/* 파리 애니메이션 */}
           {hp > 0.5 && (
             <div className="absolute inset-0 w-full h-full z-20 pointer-events-none">
               <div className="fly fly-1" />
               <div className="fly fly-2" />
               <div className="fly fly-3" />
             </div>
           )}
        </div>
        {isTargetHit && <div className="absolute inset-0 bg-white/50 rounded-full animate-ping blur-xl" />}
        {score > 0 && (
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-blue-400 text-white px-5 py-2 rounded-full font-bold text-xl shadow-lg whitespace-nowrap animate-fade-in-up z-20 border-4 border-white font-jua">
            ✨ {score} CLEAN!
          </div>
        )}
      </div>
    </div>
  );
};

export default Target;