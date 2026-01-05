'use client';

import React from 'react';
import { useMiniGame } from '@/hooks/useMiniGame';
import GameBackground from './minigame/GameBackground';
import MagicWandCursor from './minigame/MagicWandCursor';
import Target from './minigame/Target';
import Projectile from './minigame/Projectile';
import Particle from './minigame/Particle';

interface LoadingMiniGameProps {
  loadingMessage: string;
  capturedImage: string;
}

export default function LoadingMiniGame({ loadingMessage, capturedImage }: LoadingMiniGameProps) {
  const {
    balls,
    particles,
    score,
    isTargetHit,
    gameState,
    startTurn,
    targetPos,
    targetRef,
    bubbleText,
    showBubble,
    dirtOpacity,
    handleTouch,
    handleHit,
    setBalls,
  } = useMiniGame();

  return (
    <div 
      className="absolute inset-0 z-20 overflow-hidden select-none touch-manipulation bg-gradient-to-b from-sky-300 via-sky-200 to-blue-100 cursor-none"
      onClick={handleTouch}
      onTouchStart={handleTouch}
    >
      <MagicWandCursor />

      {/* 책 넘기기 효과 */}
      <div 
        className="absolute inset-0 z-[60] origin-left bg-black shadow-2xl"
        style={{
          backgroundImage: `url(${capturedImage})`, backgroundSize: 'cover', backgroundPosition: 'center',
          transition: 'transform 1.2s cubic-bezier(0.645, 0.045, 0.355, 1.000), opacity 0.5s ease-in-out 0.7s',
          transform: startTurn ? 'perspective(2000px) rotateY(-110deg)' : 'perspective(2000px) rotateY(0deg)',
          opacity: startTurn ? 0 : 1, pointerEvents: 'none',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/20" />
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/30 to-transparent" />
      </div>

      <GameBackground gameState={gameState} />

      {/* 상단 메시지 */}
      <div className={`absolute top-12 left-0 right-0 flex flex-col items-center pointer-events-none z-30 px-4 transition-all duration-1000 ${gameState === 'turning' ? 'translate-y-[-20px] opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="bg-white/80 backdrop-blur-md px-8 py-4 rounded-full border-2 border-green-200 shadow-xl animate-pulse">
          <p className="text-green-800 text-2xl font-bold text-center drop-shadow-sm font-jua">{loadingMessage}</p>
        </div>
        <p className="text-gray-600 text-lg mt-4 font-medium drop-shadow-sm text-center animate-bounce bg-white/60 px-4 py-2 rounded-full font-jua shadow-sm">화면을 터치해서 몬스터를 잡아보세요! 👇</p>
      </div>

      <Target
        targetRef={targetRef}
        targetPos={targetPos}
        isTargetHit={isTargetHit}
        gameState={gameState}
        showBubble={showBubble}
        bubbleText={bubbleText}
        capturedImage={capturedImage}
        dirtOpacity={dirtOpacity}
        score={score}
      />

      {balls.map(ball => (
        <Projectile
          key={ball.id}
          {...ball}
          onAnimationEnd={() => {
            handleHit(ball.targetX, ball.targetY);
            setBalls(prev => prev.filter(b => b.id !== ball.id));
          }}
        />
      ))}

      {particles.map(p => (
        <Particle key={p.id} {...p} />
      ))}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Jua&display=swap');
        .font-jua { font-family: 'Jua', sans-serif; }
        @keyframes throwBall { 0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.8; } 100% { left: var(--target-x); top: var(--target-y); transform: translate(-50%, -50%) scale(1.2); opacity: 1; } }
        @keyframes explode { 0% { transform: translate(-50%, -50%) scale(1); opacity: 1; } 100% { transform: translate(calc(-50% + (cos(var(--angle)) * var(--distance))), calc(-50% + (sin(var(--angle)) * var(--distance)))) scale(0); opacity: 0; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        @keyframes fadeInUp { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        @keyframes drift { from { transform: translateX(-150px); } to { transform: translateX(100vw); } }
        .animate-drift { animation: drift linear infinite; }
        @keyframes sway { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
        .animate-sway { animation: sway 3s ease-in-out infinite; }
        @keyframes blob-morph { 0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; } 50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; } 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; } }
        .animate-blob-morph { animation: blob-morph 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
}