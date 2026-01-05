'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, BookOpen, Sprout, Sparkles } from 'lucide-react';

export default function ActionButtons() {
  const [isHovered, setIsHovered] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-5 mb-6 font-jua px-2">
      {/* 1. 보물 수집하기 (카메라) - 가장 강조됨 */}
      <Link href="/camera">
        <button
          className={`
            group relative w-full py-6 rounded-3xl text-3xl text-white font-bold
            transition-all duration-300 transform active:scale-95
            flex items-center justify-center gap-4 overflow-hidden
            bg-gradient-to-br from-orange-400 via-orange-500 to-red-500
            border-4 border-white/30 shadow-[0_8px_20px_rgba(249,115,22,0.4)]
            hover:shadow-[0_12px_30px_rgba(249,115,22,0.6)] hover:-translate-y-1
          `}
          onMouseEnter={() => setIsHovered('play')}
          onMouseLeave={() => setIsHovered(null)}
        >
          {/* 배경 효과 */}
          <div className="absolute inset-0 bg-[url('/pattern-dots.svg')] opacity-10"></div>
          <div className="absolute top-0 left-0 w-full h-1/3 bg-white/20 rounded-t-3xl"></div>
          
          {/* 아이콘 */}
          <div className="bg-white p-3 rounded-full shadow-lg group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300">
            <Play fill="#f97316" className="text-orange-500 w-8 h-8 ml-1" />
          </div>
          
          {/* 텍스트 */}
          <span className="drop-shadow-md tracking-wide">보물 수집하기</span>
          
          {/* 장식 아이콘 */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-80">
            <Sparkles className={`text-yellow-200 w-8 h-8 ${isHovered === 'play' ? 'animate-spin-slow' : ''}`} />
          </div>
        </button>
      </Link>

      <div className="grid grid-cols-2 gap-4">
        {/* 2. 나의 도감 보기 */}
        <Link href="/collection">
          <button
            className={`
              group relative w-full h-full py-5 rounded-3xl text-xl text-white font-bold
              transition-all duration-300 transform active:scale-95
              flex flex-col items-center justify-center gap-2
              bg-gradient-to-br from-blue-400 to-indigo-500
              border-4 border-white/30 shadow-[0_6px_15px_rgba(59,130,246,0.3)]
              hover:shadow-[0_10px_25px_rgba(59,130,246,0.5)] hover:-translate-y-1
            `}
            onMouseEnter={() => setIsHovered('book')}
            onMouseLeave={() => setIsHovered(null)}
          >
            <div className="absolute top-0 left-0 w-full h-1/3 bg-white/20 rounded-t-3xl"></div>
            
            <div className="bg-white p-2.5 rounded-full shadow-md group-hover:rotate-[-10deg] transition-transform duration-300">
              <BookOpen fill="#3b82f6" className="text-blue-500 w-6 h-6" />
            </div>
            <span className="drop-shadow-md">나의 도감</span>
          </button>
        </Link>

        {/* 3. 몬스터 농장 (팜) */}
        <Link href="/farm">
          <button
            className={`
              group relative w-full h-full py-5 rounded-3xl text-xl text-white font-bold
              transition-all duration-300 transform active:scale-95
              flex flex-col items-center justify-center gap-2
              bg-gradient-to-br from-green-400 to-emerald-600
              border-4 border-white/30 shadow-[0_6px_15px_rgba(34,197,94,0.3)]
              hover:shadow-[0_10px_25px_rgba(34,197,94,0.5)] hover:-translate-y-1
            `}
            onMouseEnter={() => setIsHovered('farm')}
            onMouseLeave={() => setIsHovered(null)}
          >
            <div className="absolute top-0 left-0 w-full h-1/3 bg-white/20 rounded-t-3xl"></div>
            
            <div className="bg-white p-2.5 rounded-full shadow-md group-hover:scale-110 transition-transform duration-300">
              <Sprout fill="#22c55e" className="text-green-500 w-6 h-6" />
            </div>
            <span className="drop-shadow-md">몬스터 농장</span>
          </button>
        </Link>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(180deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}