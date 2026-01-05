import { Sun, Cloud } from 'lucide-react';

const CLOUDS = [
  { top: '10%', left: '5%', scale: 1, duration: '25s', opacity: 0.9 },
  { top: '20%', left: '80%', scale: 0.8, duration: '30s', opacity: 0.7 },
  { top: '5%', left: '50%', scale: 1.2, duration: '28s', opacity: 0.8 },
];

export default function BackgroundElements() {
  return (
    <>
      {/* 햇님 */}
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 pointer-events-none">
        <div className="absolute inset-0 bg-yellow-200 rounded-full blur-2xl opacity-50 animate-pulse"></div>
        <Sun className="text-yellow-400 w-full h-full animate-spin-slow opacity-80" />
      </div>

      {/* 구름 */}
      {CLOUDS.map((cloud, i) => (
        <div
          key={i}
          className="absolute text-white animate-drift"
          style={{
            top: cloud.top,
            left: cloud.left,
            transform: `scale(${cloud.scale})`,
            animationDuration: cloud.duration,
            opacity: cloud.opacity
          }}
        >
          <Cloud fill="white" size={60 + i * 20} className="drop-shadow-md text-sky-100" />
        </div>
      ))}

      {/* 날아다니는 새 */}
      <div className="absolute top-20 left-10 animate-drift" style={{ animationDuration: '15s', animationDelay: '2s' }}>
        <svg width="30" height="20" viewBox="0 0 50 30" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
          <path d="M2 15 Q 12 2, 25 15 T 48 15" />
        </svg>
      </div>

      {/* 풀밭 레이어 */}
      <div className="absolute bottom-0 w-full h-48 bg-green-300 rounded-t-[40%] scale-110 z-0 transform translate-y-10"></div>
      <div className="absolute bottom-0 w-full h-36 bg-gradient-to-t from-green-500 to-green-400 rounded-t-[50px] z-0 shadow-[0_-10px_20px_rgba(0,0,0,0.1)]">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute bottom-4 text-pink-300 animate-sway" style={{ left: `${10 + i * 15}%`, animationDelay: `${i * 0.5}s` }}>
            ✿
          </div>
        ))}
      </div>
    </>
  );
}