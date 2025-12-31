'use client';

/**
 * 카메라 캡처 컴포넌트
 * 실시간 카메라 스트림을 표시하고 사진 촬영 기능을 제공합니다.
 */

import { useRef, useState, useEffect, useCallback } from 'react';

interface CameraCaptureProps {
  onCapture: (imageData: Blob) => void;  // 촬영 완료 콜백
  isLoading: boolean;                      // 분류 중 상태
}

export default function CameraCapture({ onCapture, isLoading, error, onErrorDismiss }: CameraCaptureProps) {
  // 참조 및 상태
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string>('');

  /**
   * 카메라 스트림 시작
   */
  const startCamera = useCallback(async () => {
    // 기존 카메라가 있다면 중지
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    
    setCameraError('');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (err) {
      console.error('카메라 시작 실패:', err);
      setCameraError('카메라를 켤 수 없어요. 권한을 허용했는지 확인해주세요!');
    }
  }, [stream]);

  /**
   * 사진 촬영
   */
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || isLoading) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) onCapture(blob);
    }, 'image/jpeg', 0.9);
  }, [onCapture, isLoading]);

  // 컴포넌트 마운트/언마운트 시 카메라 관리
  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="w-full flex-grow flex flex-col items-center">
      {/* 카메라 뷰 영역 */}
      <div className="w-full aspect-[9/16] rounded-4xl overflow-hidden shadow-lg relative bg-brand-yellow-subtle flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-300 ${isCameraReady ? 'opacity-100' : 'opacity-0'}`}
          onCanPlay={() => setIsCameraReady(true)}
        />

        {/* 로딩 오버레이 */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center backdrop-blur-sm z-10">
            <p className="text-3xl animate-bounce">♻️</p>
            <p className="text-dark-text text-lg font-bold mt-2">쓰레기 친구를 분석하고 있어요!</p>
          </div>
        )}

        {/* 카메라 에러 */}
        {cameraError && !isLoading && (
           <div className="absolute inset-0 bg-brand-yellow-light flex flex-col items-center justify-center text-center p-4">
            <p className="text-4xl mb-4">😭</p>
            <p className="font-bold text-dark-text">{cameraError}</p>
            <button
              onClick={startCamera}
              className="mt-4 px-6 py-2 bg-brand-green text-white font-bold rounded-full"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* API 에러 */}
        {error && !isLoading && (
          <div className="absolute inset-0 bg-brand-yellow-light flex flex-col items-center justify-center text-center p-4">
            <p className="text-4xl mb-4">😵</p>
            <p className="font-bold text-dark-text">{error}</p>
            <button
              onClick={onErrorDismiss}
              className="mt-4 px-6 py-2 bg-brand-green text-white font-bold rounded-full"
            >
              알겠어요
            </button>
          </div>
        )}
      </div>

      {/* 숨겨진 캔버스 */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 촬영 버튼 영역 */}
      <div className="w-full flex-grow flex items-center justify-center">
        <button
          onClick={capturePhoto}
          disabled={!isCameraReady || isLoading || !!cameraError || !!error}
          className="w-24 h-24 rounded-full bg-brand-green text-white flex items-center justify-center text-5xl shadow-2xl transform transition-transform active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
          aria-label="사진 촬영"
        >
          ♻️
        </button>
      </div>
    </div>
  );
}
