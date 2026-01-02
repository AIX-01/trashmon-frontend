'use client';

/**
 * 카메라 캡처 컴포넌트
 * 실시간 카메라 스트림을 표시하고 사진 촬영 기능을 제공합니다.
 * 화면 전체를 채우는 풀스크린 카메라 뷰
 */

import { useRouter } from 'next/navigation';
import { useCamera } from '@/hooks/useCamera';

interface CameraCaptureProps {
  onCapture: (imageData: Blob) => void;
  isLoading: boolean;
  error?: string;
  onErrorDismiss: () => void;
}

export default function CameraCapture({ onCapture, isLoading, error, onErrorDismiss }: CameraCaptureProps) {
  const router = useRouter();
  const { videoRef, canvasRef, isCameraReady, cameraError, startCamera, capturePhoto } = useCamera();

  const handleCapture = () => {
    if (isLoading) return;
    capturePhoto(onCapture);
  };

  const isDisabled = !isCameraReady || isLoading || !!cameraError || !!error;

  return (
    <div className="fixed inset-0 w-full h-full bg-black">
      {/* 카메라 뷰 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transition-opacity duration-300 ${isCameraReady ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* 로딩 오버레이 */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center backdrop-blur-sm z-10">
          <p className="text-5xl animate-bounce">♻️</p>
          <p className="text-dark-text text-xl font-bold mt-4">쓰레기 친구를 분석하고 있어요!</p>
        </div>
      )}

      {/* 카메라 에러 */}
      {cameraError && !isLoading && (
        <div className="absolute inset-0 bg-brand-yellow-light flex flex-col items-center justify-center text-center p-6">
          <p className="text-5xl mb-6">😭</p>
          <p className="font-bold text-dark-text text-lg">{cameraError}</p>
          <button
            onClick={startCamera}
            className="mt-6 px-8 py-3 bg-brand-green text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* API 에러 */}
      {error && !isLoading && (
        <div className="absolute inset-0 bg-brand-yellow-light flex flex-col items-center justify-center text-center p-6">
          <p className="text-5xl mb-6">😵</p>
          <p className="font-bold text-dark-text text-lg">{error}</p>
          <button
            onClick={onErrorDismiss}
            className="mt-6 px-8 py-3 bg-brand-green text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform"
          >
            알겠어요
          </button>
        </div>
      )}

      {/* 숨겨진 캔버스 */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 촬영 버튼 */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex items-center justify-center pointer-events-none">
        <button
          onClick={handleCapture}
          disabled={isDisabled}
          className="w-20 h-20 rounded-full bg-white text-4xl flex items-center justify-center shadow-2xl transition-transform active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 pointer-events-auto"
          aria-label="사진 촬영"
        >
          ♻️
        </button>
      </div>

      {/* 뒤로가기 버튼 */}
      <div className="absolute bottom-8 left-8 z-30">
        <button
          onClick={() => router.back()}
          className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl transition-transform active:scale-90 hover:scale-105"
          aria-label="뒤로가기"
        >
          <svg className="w-6 h-6 text-dark-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}