import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-24 bg-green-600 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="font-jua text-4xl md:text-5xl text-white mb-6">
          우리 아이를 위한<br/>
          지구 지킴이 프로젝트
        </h2>
        <p className="text-green-100 text-lg mb-10">
          지금 바로 아이와 함께 모험을 떠나보세요.<br/>
          환경을 생각하는 마음이 무럭무럭 자라납니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/camera" className="bg-white hover:bg-gray-100 text-green-600 text-lg px-8 py-4 rounded-2xl font-bold shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
            시작하기 <ChevronRight />
          </Link>
        </div>
      </div>
    </section>
  );
}