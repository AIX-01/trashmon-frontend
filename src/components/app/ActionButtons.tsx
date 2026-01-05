'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, BookOpen, Sparkles } from 'lucide-react';

export default function ActionButtons() {
  const [isHovered, setIsHovered] = useState<string | null>(null);

  return (
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
  );
}