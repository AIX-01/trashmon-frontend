'use client';

/**
 * 쓰레기 분류 교실 - 홈페이지
 * 카메라 켜기와 도감 보기 버튼이 있는 메인 페이지입니다.
 */

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen w-full px-4 flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-green-50">
      <div className="w-full max-w-sm space-y-8">
        {/* 타이틀 섹션 */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-black text-dark-text">
            쓰레기 교실
          </h1>
          <p className="text-xl text-dark-text/70 font-medium">
            쓰레기를 찍어 몬스터를 찾아봐! 🌍
          </p>
        </div>

        {/* 버튼 섹션 */}
        <div className="space-y-4">
          {/* 카메라 켜기 버튼 */}
          <Link
            href="/camera"
            className="block w-full p-8 bg-brand-green text-white rounded-3xl shadow-xl hover:scale-105 transition-transform"
          >
            <div className="text-center space-y-2">
              <div className="text-6xl">📸</div>
              <h2 className="text-2xl font-bold">카메라 켜기</h2>
              <p className="text-white/90">쓰레기를 찍어보세요</p>
            </div>
          </Link>

          {/* 도감 보기 버튼 */}
          <Link
            href="/collection"
            className="block w-full p-8 bg-brand-blue text-white rounded-3xl shadow-xl hover:scale-105 transition-transform"
          >
            <div className="text-center space-y-2">
              <div className="text-6xl">📚</div>
              <h2 className="text-2xl font-bold">도감 보기</h2>
              <p className="text-white/90">수집한 몬스터를 확인하세요</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}