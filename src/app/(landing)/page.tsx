'use client';

import {
  Navbar,
  HeroSection,
  FeaturesSection,
  EducationSection,
  CTASection,
  Footer,
} from '@/components/landing';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* 폰트 및 애니메이션 스타일 */}
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

      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <EducationSection />
      <CTASection />
      <Footer />
    </div>
  );
}