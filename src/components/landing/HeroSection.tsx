import Link from 'next/link';
import { Star, ChevronRight, Recycle } from 'lucide-react';

export default function HeroSection() {
  return (
    <header className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-sky-100 to-white">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-sky-200/30 blob-shape translate-x-1/4 -translate-y-1/4 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-green-200/30 blob-shape -translate-x-1/4 translate-y-1/4 blur-3xl"></div>

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="text-center md:text-left">
          <div className="inline-block bg-white px-4 py-1 rounded-full shadow-sm text-green-600 font-bold text-sm mb-6 border border-green-100 animate-bounce">
            🎉 2024년 우리 아이 첫 환경 교육 앱 1위
          </div>
          <h1 className="font-jua text-5xl md:text-6xl leading-tight text-gray-900 mb-6">
            쓰레기가 <span className="text-orange-500">보물</span>이 되는<br />
            놀라운 마법!
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            지루한 잔소리 대신, 즐거운 게임으로!<br className="md:hidden"/>
            아이들 스스로 배우는 올바른 분리배출 습관.<br />
            <span className="font-bold text-green-700">분리수거 대모험</span>으로 시작하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link href="/app" className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-2xl font-bold shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
              무료로 시작하기 <ChevronRight />
            </Link>
            <a href="https://sora.chatgpt.com/p/s_69579d44588c8191986dc05bb9ec1f9e?psh=HXVzZXItYVh4dHpLS0t1WnNsc0JkdkFmSnlaemRx.nDd2ma-KjU8Y" target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-gray-50 text-gray-700 text-lg px-8 py-4 rounded-2xl font-bold shadow-md border border-gray-200 transition-all flex items-center justify-center gap-2">
              소개 영상 보기
            </a>
          </div>
          <div className="mt-8 flex items-center justify-center md:justify-start gap-2 text-sm text-gray-500">
            <div className="flex text-yellow-400">
              <Star fill="currentColor" size={16} />
              <Star fill="currentColor" size={16} />
              <Star fill="currentColor" size={16} />
              <Star fill="currentColor" size={16} />
              <Star fill="currentColor" size={16} />
            </div>
            <span className="font-medium text-gray-700">4.9/5.0</span>
            <span>(학부모 리뷰 1,200+)</span>
          </div>
        </div>

        {/* 앱 목업 이미지 영역 */}
        <div className="relative mx-auto w-72 md:w-80 perspective-1000">
          <div className="relative bg-gray-900 rounded-[3rem] p-3 shadow-2xl border-4 border-gray-800 rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-20"></div>
            <div className="bg-gradient-to-b from-sky-300 via-sky-200 to-green-100 w-full h-[550px] rounded-[2.5rem] overflow-hidden relative font-jua flex flex-col items-center justify-between py-10 border-4 border-black">
              <div className="text-center mt-8">
                <h2 className="text-2xl text-white drop-shadow-md">분리수거<br/><span className="text-3xl text-yellow-300">대모험!</span></h2>
              </div>
              <div className="relative transform scale-125">
                <div className="w-24 h-28 bg-green-500 rounded-xl border-4 border-white flex items-center justify-center relative shadow-lg">
                  <div className="absolute -top-3 w-28 h-6 bg-green-600 rounded-full border-2 border-white"></div>
                  <div className="flex gap-2">
                    <div className="w-2 h-3 bg-black rounded-full"></div>
                    <div className="w-2 h-3 bg-black rounded-full"></div>
                  </div>
                  <div className="absolute bottom-4"><Recycle className="text-white opacity-50" /></div>
                </div>
              </div>
              <div className="w-full px-6 flex flex-col gap-2 mb-4">
                <div className="bg-orange-500 text-white py-3 rounded-xl text-center shadow-md">보물 수집하기</div>
                <div className="bg-blue-500 text-white py-3 rounded-xl text-center shadow-md">나의 도감 보기</div>
              </div>
            </div>
          </div>
          <div className="absolute -z-10 top-10 -right-10 bg-yellow-400 rounded-full w-20 h-20 animate-bounce opacity-80 blur-sm"></div>
          <div className="absolute -z-10 bottom-20 -left-10 bg-green-400 rounded-full w-32 h-32 animate-pulse opacity-60 blur-md"></div>
        </div>
      </div>
    </header>
  );
}