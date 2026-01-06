import Link from 'next/link';
import Image from 'next/image';
import { Star, ChevronRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <header className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-sky-100 to-white">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-sky-200/30 blob-shape translate-x-1/4 -translate-y-1/4 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-green-200/30 blob-shape -translate-x-1/4 translate-y-1/4 blur-3xl"></div>

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="text-center md:text-left">
          <div className="inline-block bg-white px-4 py-1 rounded-full shadow-sm text-green-600 font-bold text-sm mb-6 border border-green-100 animate-bounce">
            🎉 우리 아이 첫 환경 교육 앱
          </div>
          <h1 className="font-jua text-5xl md:text-6xl leading-tight text-gray-900 mb-6">
            몬스터가 <span className="text-orange-500">보물</span>이 되는<br />
            놀라운 마법!
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            지루한 잔소리 대신, 즐거운 게임으로!<br className="md:hidden"/>
            아이들 스스로 배우는 올바른 분리배출 습관.<br />
            <span className="font-bold text-green-700">분리수거 대모험</span>으로 시작하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link href="/app" className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-2xl font-bold shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
              시작하기 <ChevronRight />
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center md:justify-start gap-2 text-sm text-gray-500">
            <div className="flex text-yellow-400">
            </div>
          </div>
        </div>

        {/* 소개 영상 영역 */}
        <div className="relative mx-auto w-full max-w-md">
          <video
            className="rounded-2xl shadow-2xl border-4 border-gray-200"
            src="/미니 프로젝트 소개 영상.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </div>
    </header>
  );
}