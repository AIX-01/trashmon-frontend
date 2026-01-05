'use client';

/**
 * 카메라 캡처 컴포넌트
 * 실시간 카메라 스트림을 표시하고 사진 촬영 기능을 제공합니다.
 * 화면 전체를 채우는 풀스크린 카메라 뷰
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCamera } from '@/hooks/useCamera';

interface CameraCaptureProps {
  onCapture: (imageData: Blob) => void;
  isDisabled: boolean;
  error?: string;
  onErrorDismiss: () => void;
}

export default function CameraCapture({ onCapture, isDisabled, error, onErrorDismiss }: CameraCaptureProps) {
  const router = useRouter();
  const { videoRef, canvasRef, isCameraReady, cameraError, startCamera, capturePhoto, stopCamera } = useCamera();

  // 모달이 닫히면 (isDisabled가 false가 되면) 카메라 재시작
  useEffect(() => {
    if (!isDisabled && !isCameraReady && !cameraError) {
      startCamera();
    }
  }, [isDisabled, isCameraReady, cameraError, startCamera]);

  const handleCapture = () => {
    if (isDisabled || !isCameraReady) return;
    capturePhoto((blob) => {
      stopCamera();
      onCapture(blob);
    });
  };

  const buttonDisabled = !isCameraReady || isDisabled || !!cameraError || !!error;

  return (
    <div className="fixed inset-0 w-full h-full bg-black">
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

      {/* 카메라 에러 */}
      {cameraError && (
        <div className="absolute inset-0 bg-yellow-50 flex flex-col items-center justify-center text-center p-6">
          <p className="text-5xl mb-6">😭</p>
          <p className="font-bold text-gray-800 text-lg">{cameraError}</p>
          <button
            onClick={startCamera}
            className="mt-6 px-8 py-3 bg-green-500 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* API 에러 */}
      {error && !cameraError && (
        <div className="absolute inset-0 bg-yellow-50 flex flex-col items-center justify-center text-center p-6">
          <p className="text-5xl mb-6">😢</p>
          <p className="font-bold text-gray-800 text-lg">{error}</p>
          <button
            onClick={() => {
              onErrorDismiss();
              startCamera();
            }}
            className="mt-6 px-8 py-3 bg-green-500 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 상단 뒤로가기 버튼 */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 z-20 bg-black/30 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/50 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>

      {/* 촬영 버튼 */}
      {!cameraError && !error && (
        <div className="absolute bottom-0 left-0 right-0 pb-12 flex justify-center z-20">
          <button
            onClick={handleCapture}
            disabled={buttonDisabled}
            className={`
              w-20 h-20 rounded-full border-4 border-white shadow-lg
              flex items-center justify-center
              transition-all duration-200
              ${buttonDisabled 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-white hover:scale-110 active:scale-95'
              }
            `}
          >
            <div className={`w-16 h-16 rounded-full ${buttonDisabled ? 'bg-gray-300' : 'bg-red-500'}`} />
          </button>
        </div>
      )}
    </div>
  );
}