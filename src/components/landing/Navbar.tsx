'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Recycle, Menu, X, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-green-500 p-2 rounded-xl">
            <Recycle className="text-white" size={24} />
          </div>
          <span className="font-jua text-2xl text-green-800">Trash Monster</span>
        </Link>

        {/* 데스크탑 메뉴 */}
        <div className="hidden md:flex items-center gap-8 font-medium text-gray-600">
          <a href="#features" className="hover:text-green-600 transition-colors">주요 기능</a>
          <a href="#education" className="hover:text-green-600 transition-colors">교육 효과</a>
        </div>

        {/* 모바일 메뉴 버튼 */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* 모바일 메뉴 드롭다운 */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t p-6 flex flex-col gap-4 shadow-lg absolute w-full">
          <a href="#features" onClick={() => setIsMenuOpen(false)} className="py-2 border-b">주요 기능</a>
          <a href="#education" onClick={() => setIsMenuOpen(false)} className="py-2 border-b">교육 효과</a>
          <Link href="/app" className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-2xl font-bold shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
            무료로 시작하기 <ChevronRight />
          </Link>
        </div>
      )}
    </nav>
  );
}