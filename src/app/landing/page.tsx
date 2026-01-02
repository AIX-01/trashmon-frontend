'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Download, Star, CheckCircle, ChevronRight, Menu, X, 
  Recycle, Heart, Shield, Award, Phone, Mail, Instagram 
} from 'lucide-react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* 폰트 로드 */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jua&family=Noto+Sans+KR:wght@400;500;700&display=swap');
        .font-jua { font-family: 'Jua', sans-serif; }
        .font-sans { font-family: 'Noto Sans KR', sans-serif; }
        
        .blob-shape {
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          animation: blob 8s ease-in-out infinite;
        }
        @keyframes blob {
          0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        }
      `}</style>

      {/* 네비게이션 바 */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-green-500 p-2 rounded-xl">
              <Recycle className="text-white" size={24} />
            </div>
            <span className="font-jua text-2xl text-green-800">분리수거 대모험</span>
          </Link>

          {/* 데스크탑 메뉴 */}
          <div className="hidden md:flex items-center gap-8 font-medium text-gray-600">
            <a href="#features" className="hover:text-green-600 transition-colors">주요 기능</a>
            <a href="#education" className="hover:text-green-600 transition-colors">교육 효과</a>
            <a href="#reviews" className="hover:text-green-600 transition-colors">후기</a>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2">
              시작하기 <Download size={18} />
            </button>
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
            <a href="#reviews" onClick={() => setIsMenuOpen(false)} className="py-2 border-b">후기</a>
            <button className="bg-orange-500 text-white w-full py-3 rounded-xl font-bold mt-2">
              게임 시작하기
            </button>
          </div>
        )}
      </nav>

      {/* 히어로 섹션 */}
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
              <Link href="/" className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-2xl font-bold shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
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
             {/* 폰 프레임 */}
             <div className="relative bg-gray-900 rounded-[3rem] p-3 shadow-2xl border-4 border-gray-800 rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-20"></div>
                {/* 화면 내부 (이전 앱 디자인의 간소화된 버전) */}
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
             {/* 장식 요소 */}
             <div className="absolute -z-10 top-10 -right-10 bg-yellow-400 rounded-full w-20 h-20 animate-bounce opacity-80 blur-sm"></div>
             <div className="absolute -z-10 bottom-20 -left-10 bg-green-400 rounded-full w-32 h-32 animate-pulse opacity-60 blur-md"></div>
          </div>
        </div>
      </header>

      {/* 기능 소개 섹션 */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-green-600 font-bold tracking-wider uppercase">Features</span>
            <h2 className="font-jua text-4xl mt-2 mb-4 text-gray-900">아이들이 더 좋아하는 기능</h2>
            <p className="text-gray-600">스스로 참여하고 싶게 만드는 다양한 장치가 숨어있어요.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Award className="text-orange-500" size={32} />,
                title: "보물 수집 시스템",
                desc: "길거리에 버려진 쓰레기를 줍고 '보물'로 등록해요. 성취감을 높여주는 레벨업 시스템!",
                color: "bg-orange-50"
              },
              {
                icon: <Recycle className="text-green-500" size={32} />,
                title: "나만의 도감 완성",
                desc: "직접 모은 재활용품으로 나만의 도감을 채워보세요. 캔, 플라스틱 등 재질별 학습이 가능합니다.",
                color: "bg-green-50"
              },
              {
                icon: <Heart className="text-pink-500" size={32} />,
                title: "캐릭터 꾸미기",
                desc: "내가 그린 그림이나 사진으로 주인공 캐릭터를 만들 수 있어요. 애착을 가지고 플레이합니다.",
                color: "bg-pink-50"
              }
            ].map((feature, idx) => (
              <div key={idx} className={`${feature.color} p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 border border-gray-100 shadow-sm`}>
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm mb-6">
                  {feature.icon}
                </div>
                <h3 className="font-jua text-2xl mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 교육 효과 섹션 (이미지와 텍스트 교차) */}
      <section id="education" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
            <div className="flex-1 order-2 md:order-1">
              <div className="bg-white p-6 rounded-3xl shadow-xl transform rotate-2 relative">
                <div className="absolute -top-4 -left-4 bg-yellow-400 text-white font-bold px-4 py-2 rounded-lg shadow-lg">STEP 1</div>
                <div className="h-48 bg-sky-100 rounded-2xl flex items-center justify-center">
                   {/* 일러스트 대체 텍스트 */}
                   <span className="font-jua text-sky-400 text-2xl">📷 사진 찍기 놀이</span>
                </div>
              </div>
            </div>
            <div className="flex-1 order-1 md:order-2">
              <h3 className="font-jua text-3xl mb-4 text-gray-900">관찰력이 쑥쑥!<br/>쓰레기 찾기 놀이</h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                그냥 지나치던 쓰레기도 이제는 보물처럼! <br/>
                주변 환경에 관심을 갖고 관찰하는 습관을 길러줍니다.
              </p>
              <ul className="space-y-3">
                {['주변 탐색 능력 향상', '환경에 대한 호기심 자극', '능동적인 참여 유도'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="text-green-500" size={20} /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h3 className="font-jua text-3xl mb-4 text-gray-900">분류 능력 UP!<br/>올바른 분리배출 학습</h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                페트병은 비닐을 떼고, 캔은 찌그러뜨리고! <br/>
                게임 미션을 통해 자연스럽게 올바른 방법을 익힙니다.
              </p>
              <ul className="space-y-3">
                {['재질별 특징 이해', '소근육 발달 놀이', '시민 의식 함양'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="text-green-500" size={20} /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1">
              <div className="bg-white p-6 rounded-3xl shadow-xl transform -rotate-2 relative">
                <div className="absolute -top-4 -right-4 bg-green-500 text-white font-bold px-4 py-2 rounded-lg shadow-lg">STEP 2</div>
                <div className="h-48 bg-green-100 rounded-2xl flex items-center justify-center">
                   <span className="font-jua text-green-500 text-2xl">♻️ 분리해서 버리기</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 후기 섹션 */}
      <section id="reviews" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-jua text-4xl text-center mb-16 text-gray-900">먼저 써본 부모님들의 이야기</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                text: "아이가 길 가다가 쓰레기만 보면 '엄마 이거 보물이야?' 하고 물어봐요. 교육 효과 200%입니다!",
                author: "6세 지우맘",
                role: "★★★★★"
              },
              {
                text: "캐릭터를 자기 얼굴로 꾸며주니까 너무 좋아하네요. 억지로 시키지 않아도 스스로 하려고 해요.",
                author: "5세 현수파파",
                role: "★★★★★"
              },
              {
                text: "유치원 숙제로 알게 되었는데, 주말마다 아이랑 동네 청소하러 다니는 게 취미가 되었어요.",
                author: "7세 서연맘",
                role: "★★★★★"
              }
            ].map((review, i) => (
              <div key={i} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 relative">
                <div className="text-4xl text-sky-200 font-serif absolute top-4 left-6">"</div>
                <p className="text-gray-700 mb-6 relative z-10 pt-4 leading-relaxed">{review.text}</p>
                <div className="flex items-center justify-between border-t pt-4">
                  <span className="font-bold text-gray-900">{review.author}</span>
                  <span className="text-yellow-400 tracking-widest">{review.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-24 bg-green-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-jua text-4xl md:text-5xl text-white mb-6">
            우리 아이를 위한<br/>
            지구 지킴이 프로젝트
          </h2>
          <p className="text-green-100 text-lg mb-10">
            지금 바로 다운로드하고 아이와 함께 모험을 떠나보세요.<br/>
            환경을 생각하는 마음이 무럭무럭 자라납니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-700 font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-lg">
              <Download size={20} /> 시작하기
            </button>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4 text-white">
              <Recycle size={24} />
              <span className="font-jua text-2xl">분리수거 대모험</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              아이들이 놀이를 통해 자연스럽게 환경 보호의 중요성을 깨닫고<br/>
              올바른 분리배출 습관을 기를 수 있도록 돕습니다.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Mail size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">바로가기</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-green-400">서비스 소개</a></li>
              <li><a href="#" className="hover:text-green-400">자주 묻는 질문</a></li>
              <li><a href="#" className="hover:text-green-400">개인정보처리방침</a></li>
              <li><a href="#" className="hover:text-green-400">이용약관</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Mail size={16}/> help@recycle-adventure.com</li>
              <li className="flex items-center gap-2"><Phone size={16}/> 02-1234-5678</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-12 pt-8 border-t border-gray-800 text-xs text-center">
          © 2024 Green Future Lab. All rights reserved.
        </div>
      </footer>
    </div>
  );
}