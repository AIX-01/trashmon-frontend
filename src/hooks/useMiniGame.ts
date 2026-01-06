'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface Ball {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  distance: number;
}

export const useMiniGame = () => {
  const [balls, setBalls] = useState<Ball[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [score, setScore] = useState(0);
  const [isTargetHit, setIsTargetHit] = useState(false);
  const [gameState, setGameState] = useState<'turning' | 'rainbow' | 'playing'>('turning');
  const [startTurn, setStartTurn] = useState(false);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 40 });
  const targetRef = useRef<HTMLDivElement>(null);

  // Game state transitions
  useEffect(() => {
    const turnStartTimer = setTimeout(() => setStartTurn(true), 100);
    const turnEndTimer = setTimeout(() => setGameState('rainbow'), 1200);
    const rainbowTimer = setTimeout(() => {
      setGameState('playing');
    }, 3200);
    return () => {
      clearTimeout(turnStartTimer);
      clearTimeout(turnEndTimer);
      clearTimeout(rainbowTimer);
    };
  }, []);

  // Target movement
  useEffect(() => {
    const moveTarget = () => {
      const newX = 50 + (Math.random() * 40 - 20);
      const newY = 40 + (Math.random() * 30 - 15);
      setTargetPos({ x: newX, y: newY });
    };
    const interval = setInterval(moveTarget, 2000);
    return () => clearInterval(interval);
  }, []);

  // Touch/Click handler
  const handleTouch = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (gameState !== 'playing') return;
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    const targetRect = targetRef.current?.getBoundingClientRect();
    if (!targetRect) return;
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;
    const newBall = { id: Date.now(), startX: clientX, startY: clientY, targetX: targetCenterX, targetY: targetCenterY };
    setBalls(prev => [...prev, newBall]);
  }, [gameState]);

  // Hit handler
  const handleHit = useCallback((x: number, y: number) => {
    setIsTargetHit(true);
    setScore(prev => prev + 1);
    setTimeout(() => setIsTargetHit(false), 150);
    const colors = ['#4ade80', '#60a5fa', '#f472b6', '#fbbf24', '#ffffff'];
    const newParticles = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i + Math.random(), x, y, color: colors[Math.floor(Math.random() * colors.length)],
      angle: (i * 45) + Math.random() * 20, distance: 50 + Math.random() * 50
    }));
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  // Particle cleanup
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => setParticles(prev => prev.slice(8)), 1000);
      return () => clearTimeout(timer);
    }
  }, [particles]);

  const dirtOpacity = Math.max(0, 1 - score * 0.15);

  return {
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
  };
};