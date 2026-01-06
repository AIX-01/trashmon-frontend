'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { useMiniGame } from '@/hooks/useMiniGame';
import GameBackground from './minigame/GameBackground';
import MagicWandCursor from './minigame/MagicWandCursor';
import Target from './minigame/Target';
import Projectile from './minigame/Projectile';
import Particle from './minigame/Particle';
import { SpeechBubble } from './ui';

interface LoadingMiniGameProps {
  loadingMessage: string;
  capturedImage: string;
}

const HELPERS = ['/Paper.png', '/Glass.png', '/Plastic.png', '/Can.png', '/General_Waste.png'];

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
    dirtOpacity,
    handleTouch,
    handleHit,
    setBalls,
  } = useMiniGame();

  const randomHelper = useMemo(() => HELPERS[Math.floor(Math.random() * HELPERS.length)], []);

  return (
    <div 
      className="absolute inset-0 z-20 overflow-hidden select-none touch-manipulation bg-gradient-to-b from-sky-300 via-sky-200 to-blue-100 cursor-none"
      onClick={handleTouch}
      onTouchStart={handleTouch}
    >
      <MagicWandCursor />

      <div 
        className="absolute inset-0 z-[60] bg-black"
        style={{
          backgroundImage: `url(${capturedImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'opacity 1s ease-in-out',
          opacity: startTurn ? 0 : 1,
          pointerEvents: 'none',
        }}
      />

      <GameBackground gameState={gameState} />

      <div className={`absolute bottom-8 right-8 flex flex-col items-center pointer-events-none z-30 px-4 transition-all duration-1000 ${gameState === 'turning' ? 'translate-y-[20px] opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="relative w-48 h-48 animate-float">
          <Image src={randomHelper} alt="도우미" layout="fill" objectFit="contain" />
          <SpeechBubble text={loadingMessage} />
        </div>
      </div>

      <p className="absolute top-12 w-full text-center text-gray-600 text-lg font-medium drop-shadow-sm animate-bounce bg-white/60 px-4 py-2 rounded-full font-jua shadow-sm">화면을 터치해서 몬스터를 잡아보세요! 👇</p>

      <Target
        targetRef={targetRef}
        targetPos={targetPos}
        isTargetHit={isTargetHit}
        gameState={gameState}
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
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
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