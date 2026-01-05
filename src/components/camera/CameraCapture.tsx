'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCamera } from '@/hooks/useCamera';
import { ArrowLeft, ScanLine } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageData: Blob) => void;
  isDisabled: boolean;
  shouldRestart: boolean;
}

export default function CameraCapture({ onCapture, isDisabled, shouldRestart }: CameraCaptureProps) {
  const router = useRouter();
  const { videoRef, canvasRef, isCameraReady, cameraError, startCamera, capturePhoto, stopCamera } = useCamera();

  // shouldRestart가 true가 되면 카메라 재시작
  useEffect(() => {
    if (shouldRestart && !isCameraReady && !cameraError) {
      startCamera();
    }
  }, [shouldRestart, isCameraReady, cameraError, startCamera]);

  const handleCapture = () => {
    if (isDisabled || !isCameraReady) return;
    capturePhoto((blob) => {
      stopCamera();
      onCapture(blob);
    });
  };

  const buttonDisabled = !isCameraReady || isDisabled || !!cameraError;

  return (
    <div className="fixed inset-0 w-full h-full bg-black font-jua">
      {/* 스타일 정의 */}
      <style jsx>{`
        @keyframes scan-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan-line {
          animation: scan-line 3s ease-in-out infinite;
        }
        @keyframes targeting {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.98); opacity: 0.9; }
        }
        .animate-targeting {
          animation: targeting 2.5s ease-in-out infinite;
        }
      `}</style>

      {/* 카메라 뷰 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transition-opacity duration-300 -scale-x-100 ${isCameraReady ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* 캔버스 (숨김) */}
      <canvas ref={canvasRef} className="hidden" />

      {/* AR UI 오버레이 */}
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
        {/* 상단 안내 메시지 */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-6 py-3 rounded-2xl border border-white/20 shadow-lg">
          <p className="text-lg font-bold">쓰레기를 화면 중앙에 맞춰주세요</p>
        </div>

        {/* 중앙 타겟팅 시스템 (반응형) */}
        {/* 화면의 짧은 쪽을 기준으로 크기 결정 (w-10/12 또는 h-10/12) */}
        <div className="relative w-10/12 md:w-8/12 lg:w-6/12 aspect-square max-w-md max-h-[70vh] animate-targeting">
          {/* 코너 브라켓 */}
          <div className="absolute top-0 left-0 w-1/6 h-1/6 border-t-4 border-l-4 border-cyan-400 rounded-tl-xl"></div>
          <div className="absolute top-0 right-0 w-1/6 h-1/6 border-t-4 border-r-4 border-cyan-400 rounded-tr-xl"></div>
          <div className="absolute bottom-0 left-0 w-1/6 h-1/6 border-b-4 border-l-4 border-cyan-400 rounded-bl-xl"></div>
          <div className="absolute bottom-0 right-0 w-1/6 h-1/6 border-b-4 border-r-4 border-cyan-400 rounded-br-xl"></div>
          
          {/* 내부 십자선 */}
          <div className="absolute top-1/2 left-[10%] w-[80%] h-0.5 bg-cyan-400/50"></div>
          <div className="absolute left-1/2 top-[10%] w-0.5 h-[80%] bg-cyan-400/50"></div>

          {/* 실시간 스캔 라인 */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-cyan-400/0 via-cyan-400/50 to-cyan-400/0 animate-scan-line"></div>
          </div>
        </div>
      </div>

      {/* 카메라 에러 - 모달 스타일 */}
      {cameraError && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4 z-30">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 flex flex-col items-center shadow-2xl">
            <div className="text-6xl mb-4">📷</div>
            <p className="text-gray-800 text-xl font-bold text-center mb-2">
              카메라 오류
            </p>
            <p className="text-gray-600 text-center mb-6">{cameraError}</p>
            <button
              onClick={startCamera}
              className="w-full bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-4 rounded-2xl shadow-lg transition-all"
            >
              다시 시도
            </button>
          </div>
        </div>
      )}

      {/* 상단 뒤로가기 버튼 */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 z-20 bg-black/30 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/50 transition-colors pointer-events-auto"
      >
        <ArrowLeft size={24} />
      </button>

      {/* 촬영 버튼 */}
      {!cameraError && (
        <div className="absolute bottom-0 left-0 right-0 pb-12 flex justify-center z-20 pointer-events-none">
          <button
            onClick={handleCapture}
            disabled={buttonDisabled}
            className={`
              w-24 h-24 rounded-full border-4 border-white/50 shadow-lg
              flex items-center justify-center
              transition-all duration-200 group pointer-events-auto
              ${buttonDisabled 
                ? 'bg-gray-600/50 cursor-not-allowed' 
                : 'bg-cyan-500/50 hover:bg-cyan-400/70 hover:scale-105 active:scale-95'
              }
            `}
          >
            <div className="w-20 h-20 rounded-full bg-white/80 flex items-center justify-center transition-transform group-hover:scale-95">
              <ScanLine className={`text-cyan-600 w-12 h-12 transition-colors ${buttonDisabled ? 'text-gray-400' : ''}`} />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}