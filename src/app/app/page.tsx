'use client';

/**
 * 트래시몬 - 홈페이지
 * 카메라 켜기와 도감 보기 버튼이 있는 메인 페이지입니다.
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, BookOpen, Sparkles, Cloud, Sun } from 'lucide-react';

export default function HomePage() {
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("안녕! 같이 갈래?");

  // 캐릭터 말풍선 멘트 롤링
  useEffect(() => {
    const messages = ["안녕! 같이 갈래?", "지구를 지켜줘!", "분리수거는 즐거워!", "나는 캔이야!", "우리는 친구!"];
    const interval = setInterval(() => {
      setGreeting(messages[Math.floor(Math.random() * messages.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 구름 데이터
  const clouds = [
    { top: '10%', left: '5%', scale: 1, duration: '25s', opacity: 0.9 },
    { top: '20%', left: '80%', scale: 0.8, duration: '30s', opacity: 0.7 },
    { top: '5%', left: '50%', scale: 1.2, duration: '28s', opacity: 0.8 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-blue-100 overflow-hidden relative font-['Jua'] select-none">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Jua&display=swap');
        .font-jua { font-family: 'Jua', sans-serif; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes drift {
          from { transform: translateX(-150px); }
          to { transform: translateX(100vw); }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes ray-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-drift { animation: drift linear infinite; }
        .animate-sway { animation: sway 3s ease-in-out infinite; }
        .animate-spin-slow { animation: ray-spin 20s linear infinite; }
      `}</style>

      {/* 배경 요소: 햇님 */}
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 pointer-events-none">
         <div className="absolute inset-0 bg-yellow-200 rounded-full blur-2xl opacity-50 animate-pulse"></div>
         <Sun className="text-yellow-400 w-full h-full animate-spin-slow opacity-80" />
      </div>

      {/* 배경 요소: 구름 */}
      {clouds.map((cloud, i) => (
        <div
          key={i}
          className="absolute text-white animate-drift"
          style={{
            top: cloud.top,
            left: cloud.left,
            transform: `scale(${cloud.scale})`,
            animationDuration: cloud.duration,
            opacity: cloud.opacity
          }}
        >
          <Cloud fill="white" size={60 + i * 20} className="drop-shadow-md text-sky-100" />
        </div>
      ))}

      {/* 배경 요소: 날아다니는 새 */}
      <div className="absolute top-20 left-10 animate-drift" style={{ animationDuration: '15s', animationDelay: '2s' }}>
        <svg width="30" height="20" viewBox="0 0 50 30" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
           <path d="M2 15 Q 12 2, 25 15 T 48 15" />
        </svg>
      </div>

      {/* 배경 요소: 풀밭 레이어 */}
      <div className="absolute bottom-0 w-full h-48 bg-green-300 rounded-t-[40%] scale-110 z-0 transform translate-y-10"></div>
      <div className="absolute bottom-0 w-full h-36 bg-gradient-to-t from-green-500 to-green-400 rounded-t-[50px] z-0 shadow-[0_-10px_20px_rgba(0,0,0,0.1)]">
        {/* 꽃 장식 */}
        {[...Array(6)].map((_, i) => (
           <div key={i} className="absolute bottom-4 text-pink-300 animate-sway" style={{ left: `${10 + i * 15}%`, animationDelay: `${i * 0.5}s` }}>
              ✿
           </div>
        ))}
      </div>

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 max-w-md mx-auto h-screen flex flex-col justify-between py-8 px-6">

        {/* 상단 타이틀 */}
        <div className="flex flex-col items-center mt-12 animate-float">
          <h1 className="text-7xl text-white font-jua drop-shadow-[0_4px_0_rgba(0,0,0,0.2)] text-stroke-3 text-center leading-tight">
            <span className="text-green-600 drop-shadow-[2px_2px_0_white]">분리수거</span><br/>
            <span className="text-yellow-400 text-8xl drop-shadow-[3px_3px_0_#d97706] inline-block mt-1 transform -rotate-2">대모험!</span>
          </h1>
        </div>

        {/* 중앙 캐릭터 영역 */}
        <div className="flex-1 flex justify-center items-end relative mb-0">

          {/* 말풍선 */}
          <div className="absolute top-[40px] right-[-20px] bg-white px-6 py-3 rounded-2xl rounded-bl-none shadow-lg border-2 border-green-500 animate-float z-20 transform rotate-2">
            <p className="text-green-700 text-xl font-bold">{greeting}</p>
          </div>

          {/* 캐릭터 그룹 */}
          <div className="relative flex items-end gap-1 animate-float">
             {/* 캐릭터 이미지 */}
             <div className="relative z-10">
                <div className="w-64 h-80 relative animate-sway">
                  <Image
                    src="/trashmon-friends.png"
                    alt="트래시몬 친구들"
                    width={256}
                    height={320}
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
             </div>
          </div>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="flex flex-col gap-4 mb-4 font-jua">
          <Link href="/camera">
            <button
              className={`
                group relative w-full py-5 rounded-2xl text-2xl text-white
                transition-all duration-200 transform active:scale-95
                flex items-center justify-center gap-3 overflow-hidden
                ${isHovered === 'play' ? 'shadow-[0_0_20px_rgba(249,115,22,0.6)] scale-105' : 'shadow-[0_6px_0_#c2410c]'}
                bg-gradient-to-r from-orange-400 to-orange-500 border-2 border-orange-300
              `}
              onMouseEnter={() => setIsHovered('play')}
              onMouseLeave={() => setIsHovered(null)}
            >
              <div className="absolute top-0 left-0 w-full h-1/2 bg-white opacity-20 rounded-t-2xl"></div>
              <div className="bg-white p-2 rounded-full shadow-sm group-hover:rotate-12 transition-transform">
                <Play fill="#f97316" className="text-orange-500" size={24} />
              </div>
              <span className="drop-shadow-md">보물 수집하기</span>
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Sparkles className={`text-yellow-200 ${isHovered === 'play' ? 'animate-spin' : ''}`} size={24} />
              </div>
            </button>
          </Link>

          <Link href="/collection">
            <button
              className={`
                group relative w-full py-5 rounded-2xl text-2xl text-white
                transition-all duration-200 transform active:scale-95
                flex items-center justify-center gap-3
                ${isHovered === 'book' ? 'shadow-[0_0_20px_rgba(59,130,246,0.6)] scale-105' : 'shadow-[0_6px_0_#1e40af]'}
                bg-gradient-to-r from-blue-400 to-blue-500 border-2 border-blue-300
              `}
              onMouseEnter={() => setIsHovered('book')}
              onMouseLeave={() => setIsHovered(null)}
            >
               <div className="absolute top-0 left-0 w-full h-1/2 bg-white opacity-20 rounded-t-2xl"></div>
              <div className="bg-white p-2 rounded-full shadow-sm group-hover:rotate-12 transition-transform">
                <BookOpen fill="#3b82f6" className="text-blue-500" size={24} />
              </div>
              <span className="drop-shadow-md">나의 도감 보기</span>
            </button>
          </Link>
        </div>

        <div className="text-center text-green-800 text-sm opacity-60">
           © 우리동네 분리수거 지킴이
        </div>

      </div>
    </div>
  );
}