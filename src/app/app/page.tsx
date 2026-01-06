'use client';

import {
  BackgroundElements,
  TitleSection,
  CharacterSection,
  ActionButtons,
} from '@/components/app';

export default function HomePage() {
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

      <BackgroundElements />

      <div className="relative z-10 max-w-md mx-auto h-screen flex flex-col justify-between py-8 px-6">
        <TitleSection />
        <CharacterSection />
        <ActionButtons />

        <div className="text-center text-green-800 text-sm opacity-60">
          © 우리동네 분리수거 지킴이
        </div>

      </div>
    </div>
  );
}