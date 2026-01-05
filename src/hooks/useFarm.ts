'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getAllCollection, createImageUrl } from '@/lib/collectionStorage';
import { FarmMonster } from '@/types/farm';

export const useFarm = () => {
  const [monsters, setMonsters] = useState<FarmMonster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isDragging, setIsDragging] = useState(false);
  const draggedMonsterIdRef = useRef<number | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();

  // 몬스터 데이터 로드
  useEffect(() => {
    const loadMonsters = async () => {
      try {
        const items = await getAllCollection();
        const farmMonsters: FarmMonster[] = items.map(item => ({
          id: item.id!,
          name: item.monsterName,
          imageUrl: createImageUrl(item.monsterImage),
          rank: item.rank,
          category: item.category,
          capturedAt: item.capturedAt,
          x: Math.random() * 80 + 10,
          y: Math.random() * 30 + 60,
          speed: 0.005 + Math.random() * 0.01,
          direction: Math.random() * 360,
          scale: 1.0,
          action: 'idle',
          actionTimer: Math.random() * 200,
        }));
        setMonsters(farmMonsters);
      } catch (e) {
        console.error('농장 로드 실패:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadMonsters();
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // 몬스터 AI 및 애니메이션 루프
  useEffect(() => {
    if (isLoading) return;

    const animate = () => {
      setMonsters(prevMonsters =>
        prevMonsters.map(monster => {
          if (monster.id === draggedMonsterIdRef.current) {
            return monster;
          }

          let { x, y, direction, action, actionTimer, speed } = monster;

          if (action !== 'sleep') {
            actionTimer--;
          }

          if (actionTimer <= 0) {
            if (action === 'happy') {
              action = 'idle';
              actionTimer = 100 + Math.random() * 100;
            } else {
              const rand = Math.random();
              if (rand < 0.2) action = 'walk';
              else if (rand < 0.6) action = 'idle';
              else if (rand < 0.7) action = 'jump';
              else action = 'sleep';
              actionTimer = 300 + Math.random() * 500;
              if (action === 'walk' || action === 'jump') {
                direction = Math.random() * 360;
              }
            }
          }

          if (action === 'walk' || action === 'jump') {
            const moveSpeed = action === 'jump' ? speed * 1.2 : speed;
            const rad = direction * (Math.PI / 180);
            x += Math.cos(rad) * moveSpeed;
            y += Math.sin(rad) * moveSpeed;

            if (x < 5 || x > 95) {
              direction = 180 - direction + (Math.random() * 20 - 10);
              x = Math.max(5, Math.min(95, x));
            }
            if (y < 50 || y > 90) {
              direction = 360 - direction + (Math.random() * 20 - 10);
              y = Math.max(50, Math.min(90, y));
            }
          }

          const scale = 0.6 + ((y - 50) / 40) * 0.8;

          return { ...monster, x, y, direction, action, actionTimer, scale };
        })
      );
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isLoading]);

  const handlePointerDown = useCallback((e: React.PointerEvent, monsterId: number) => {
    if (e.button === 2) return;
    e.preventDefault();
    e.stopPropagation();
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const monster = monsters.find(m => m.id === monsterId);
    if (!monster) return;

    const monsterScreenX = (monster.x / 100) * rect.width;
    const monsterScreenY = (monster.y / 100) * rect.height;

    dragOffsetRef.current = {
      x: e.clientX - rect.left - monsterScreenX,
      y: e.clientY - rect.top - monsterScreenY,
    };
    draggedMonsterIdRef.current = monsterId;
    setIsDragging(true);
    setMonsters(prev => prev.map(m => (m.id === monsterId ? { ...m, action: 'dragged', scale: 1.2 } : m)));
  }, [monsters]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || draggedMonsterIdRef.current === null || !containerRef.current) return;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    let newX = ((e.clientX - rect.left - dragOffsetRef.current.x) / rect.width) * 100;
    let newY = ((e.clientY - rect.top - dragOffsetRef.current.y) / rect.height) * 100;
    newX = Math.max(5, Math.min(95, newX));
    newY = Math.max(50, Math.min(90, newY));
    setMonsters(prev => prev.map(m => (m.id === draggedMonsterIdRef.current ? { ...m, x: newX, y: newY } : m)));
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    if (isDragging && draggedMonsterIdRef.current !== null) {
      const droppedId = draggedMonsterIdRef.current;
      setMonsters(prev => prev.map(m => (m.id === droppedId ? { ...m, action: 'idle', scale: 0.6 + ((m.y - 50) / 40) * 0.8 } : m)));
      draggedMonsterIdRef.current = null;
      setIsDragging(false);
    }
  }, [isDragging]);

  const handleMonsterClick = useCallback((monster: FarmMonster) => {
    if (!isDragging) {
      setMonsters(prev => prev.map(m => (m.id === monster.id ? { ...m, action: 'happy', actionTimer: 60 } : m)));
    }
  }, [isDragging]);

  return {
    monsters,
    isLoading,
    isDragging,
    containerRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleMonsterClick,
  };
};
