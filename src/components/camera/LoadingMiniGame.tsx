'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Sun, Cloud } from 'lucide-react';
import { useTTS } from '@/hooks/useTTS';

// 말풍선 컴포넌트
const SpeechBubble = ({ text }: { text: string }) => (
  <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white text-gray-800 px-4 py-2 rounded-2xl shadow-md text-center font-jua text-sm animate-fade-in-up whitespace-nowrap">
    {text}
    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white" />
  </div>
);

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

interface LoadingMiniGameProps {
  loadingMessage: string;
  capturedImage: string; // 캡처된 이미지 URL
}

const HELP_MESSAGES = [
  "으앙, 여기서 꺼내줘!",
  "답답해! 도와줘!",
  "누가 나 좀 구해줘~",
  "에너지가 필요해...!",
  "몬스터가 되고 싶어!",
];

export default function LoadingMiniGame({ loadingMessage, capturedImage }: LoadingMiniGameProps) {
  const [balls, setBalls] = useState<Ball[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [score, setScore] = useState(0);
  const [isTargetHit, setIsTargetHit] = useState(false);
  const [gameState, setGameState] = useState<'turning' | 'rainbow' | 'playing'>('turning');
  const [startTurn, setStartTurn] = useState(false);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 40 });
  const targetRef = useRef<HTMLDivElement>(null);
  
  // 말풍선 상태
  const [bubbleText, setBubbleText] = useState('');
  const [showBubble, setShowBubble] = useState(false);

  // TTS
  const { speak, startNewSession, isAvailable } = useTTS();

  // 구름 데이터
  const clouds = [
    { top: '10%', left: '5%', scale: 1, duration: '25s', opacity: 0.9 },
    { top: '20%', left: '80%', scale: 0.8, duration: '30s', opacity: 0.7 },
    { top: '5%', left: '50%', scale: 1.2, duration: '28s', opacity: 0.8 },
  ];

  // 상태 전이 및 말풍선 로직
  useEffect(() => {
    const turnStartTimer = setTimeout(() => setStartTurn(true), 100);
    const turnEndTimer = setTimeout(() => setGameState('rainbow'), 1200);
    const rainbowTimer = setTimeout(() => {
      setGameState('playing');
      setShowBubble(true); // 게임 시작과 함께 첫 말풍선 표시
      if (isAvailable) {
        startNewSession(); // 미니게임 시작 시 새 TTS 세션 (랜덤 목소리)
      }
    }, 3200);

    return () => {
      clearTimeout(turnStartTimer);
      clearTimeout(turnEndTimer);
      clearTimeout(rainbowTimer);
    };
  }, [isAvailable, startNewSession]);

  // 주기적으로 말풍선 내용 변경 및 TTS 출력
  useEffect(() => {
    if (gameState === 'playing') {
      const firstMessage = HELP_MESSAGES[0];
      setBubbleText(firstMessage);
      if (isAvailable) speak(firstMessage);

      const bubbleInterval = setInterval(() => {
        const newMessage = HELP_MESSAGES[Math.floor(Math.random() * HELP_MESSAGES.length)];
        setBubbleText(newMessage);
        setShowBubble(true);
        if (isAvailable) speak(newMessage);
        
        setTimeout(() => setShowBubble(false), 2500); // 2.5초 후 말풍선 숨김
      }, 4000); // 4초마다 새 말풍선
      
      return () => clearInterval(bubbleInterval);
    }
  }, [gameState, isAvailable, speak]);

  // 타겟 이동 애니메이션
  useEffect(() => {
    const moveTarget = () => {
      const newX = 50 + (Math.random() * 40 - 20);
      const newY = 40 + (Math.random() * 30 - 15);
      setTargetPos({ x: newX, y: newY });
    };
    const interval = setInterval(moveTarget, 2000);
    return () => clearInterval(interval);
  }, []);

  // 터치 핸들러
  const handleTouch = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (gameState === 'turning') return;
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

  // 피격 핸들러
  const handleHit = useCallback((x: number, y: number) => {
    setIsTargetHit(true);
    setScore(prev => prev + 1);
    setTimeout(() => setIsTargetHit(false), 150);
    const colors = ['#4ade80', '#60a5fa', '#f472b6', '#fbbf24', '#ffffff'];
    const newParticles = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i, x, y, color: colors[Math.floor(Math.random() * colors.length)],
      angle: (i * 45) + Math.random() * 20, distance: 50 + Math.random() * 50
    }));
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  // 파티클 제거
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => setParticles(prev => prev.slice(8)), 1000);
      return () => clearTimeout(timer);
    }
  }, [particles]);

  return (
    <div 
      className="absolute inset-0 z-20 overflow-hidden cursor-pointer select-none touch-manipulation bg-gradient-to-b from-sky-300 via-sky-200 to-blue-100"
      onClick={handleTouch}
      onTouchStart={handleTouch}
    >
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
            <Cloud fill="white" size={60 + i * 20} className="drop-shadow-md text-sky-100" />
          </div>
        ))}
        <div className="absolute bottom-0 left-0 w-full h-32 pointer-events-none z-0">
           <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-green-500 to-green-400 rounded-t-[50px] shadow-[0_-10px_20px_rgba(0,0,0,0.1)]"></div>
           {[...Array(8)].map((_, i) => (
              <div key={i} className="absolute bottom-4 text-pink-300 animate-sway" style={{ left: `${5 + i * 12}%`, animationDelay: `${i * 0.7}s`, fontSize: '24px' }}>✿</div>
           ))}
        </div>
      </div>

      {/* 상단 메시지 */}
      <div className={`absolute top-8 left-0 right-0 flex flex-col items-center pointer-events-none z-30 px-4 transition-all duration-1000 ${gameState === 'turning' ? 'translate-y-[-20px] opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-green-200 shadow-lg animate-pulse">
          <p className="text-green-800 text-lg font-bold text-center drop-shadow-sm font-jua">{loadingMessage}</p>
        </div>
        <p className="text-gray-600 text-sm mt-2 font-medium drop-shadow-sm text-center animate-bounce bg-white/50 px-3 py-1 rounded-full font-jua">화면을 터치해서 몬스터를 잡아보세요! 👇</p>
      </div>

      {/* 둥둥 떠다니는 타겟 */}
      <div 
        ref={targetRef}
        className={`absolute transition-all duration-[2000ms] ease-in-out z-10 ${isTargetHit ? 'scale-110 brightness-110' : 'scale-100'} ${gameState === 'turning' ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}
        style={{ left: `${targetPos.x}%`, top: `${targetPos.y}%`, transform: 'translate(-50%, -50%)', transitionProperty: 'left, top, transform, opacity, filter' }}
      >
        <div className="relative w-64 h-64 animate-float">
          {/* 말풍선 표시 */}
          {showBubble && <SpeechBubble text={bubbleText} />}
          
          <div className="w-full h-full animate-blob-morph overflow-hidden shadow-2xl border-4 border-white/50 bg-white/20 backdrop-blur-sm">
             <div className="w-full h-full bg-cover bg-center transform scale-125" style={{ backgroundImage: `url(${capturedImage})` }} />
          </div>
          {isTargetHit && <div className="absolute inset-0 bg-white/50 rounded-full animate-ping blur-xl" />}
          {score > 0 && (
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-bold text-sm shadow-lg whitespace-nowrap animate-fade-in-up z-20 border-2 border-white font-jua">
              ⚡ {score} HIT!
            </div>
          )}
        </div>
      </div>

      {/* 날아가는 공들 */}
      {balls.map(ball => (
        <div
          key={ball.id}
          className="absolute w-12 h-12 z-20 pointer-events-none"
          style={{ left: ball.startX, top: ball.startY, '--target-x': `${ball.targetX}px`, '--target-y': `${ball.targetY}px`, animation: 'throwBall 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' } as React.CSSProperties}
          onAnimationEnd={() => { handleHit(ball.targetX, ball.targetY); setBalls(prev => prev.filter(b => b.id !== ball.id)); }}
        >
          <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-600 rounded-full shadow-lg border-2 border-white flex items-center justify-center animate-spin">
            <span className="text-xl select-none">🍃</span>
          </div>
        </div>
      ))}

      {/* 파티클 효과 */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute w-3 h-3 rounded-full shadow-sm z-10 pointer-events-none"
          style={{ left: p.x, top: p.y, backgroundColor: p.color, '--angle': `${p.angle}deg`, '--distance': `${p.distance}px`, animation: 'explode 0.6s ease-out forwards' } as React.CSSProperties}
        />
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