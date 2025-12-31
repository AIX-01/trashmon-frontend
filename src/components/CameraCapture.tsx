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

export default function CameraCapture({ onCapture, isLoading }: CameraCaptureProps) {
  // 참조 및 상태
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [isCameraReady, setIsCameraReady] = useState(false);

  /**
   * 카메라 스트림 시작
   */
  const startCamera = useCallback(async () => {
    try {
      // 카메라 권한 요청
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',  // 후면 카메라 우선
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      // 비디오 요소에 스트림 연결
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraReady(true);
        setError('');
      }
    } catch (err) {
      console.error('카메라 시작 실패:', err);
      setError('카메라를 사용할 수 없어요. 카메라 권한을 허용해주세요! 📸');
    }
  }, []);

  /**
   * 카메라 스트림 중지
   */
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsCameraReady(false);
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

    // 캔버스 크기를 비디오 크기에 맞춤
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 비디오 프레임을 캔버스에 그리기
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 캔버스를 Blob으로 변환
    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCapture(blob);
        }
      },
      'image/jpeg',
      0.9  // JPEG 품질
    );
  }, [onCapture, isLoading]);

  // 컴포넌트 마운트 시 카메라 시작
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  return (
    <div className="relative">
      {/* 카메라 뷰 영역 */}
      <div className="camera-view glass-card overflow-hidden">
        {/* 비디오 스트림 */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          onCanPlay={() => setIsCameraReady(true)}
        />

        {/* 카메라 오버레이 가이드 */}
        {isCameraReady && !isLoading && (
          <div className="absolute inset-0 pointer-events-none">
            {/* 중앙 가이드 프레임 */}
            <div className="absolute inset-8 border-4 border-dashed border-white/40 rounded-3xl" />
            {/* 코너 강조 */}
            <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl" />
            <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl" />
            <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl" />
            <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl" />
          </div>
        )}

        {/* 로딩 오버레이 */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
            <div className="loading-spinner mb-4" />
            <p className="text-white text-lg font-bold">분석 중... 🔍</p>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-8">
            <div className="text-center">
              <p className="text-5xl mb-4">📷</p>
              <p className="text-white text-lg">{error}</p>
              <button
                onClick={startCamera}
                className="mt-4 px-6 py-3 bg-white/20 rounded-full text-white font-bold hover:bg-white/30 transition-colors"
              >
                다시 시도
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 숨겨진 캔버스 (촬영용) */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 촬영 버튼 */}
      <div className="flex justify-center mt-6">
        <button
          onClick={capturePhoto}
          disabled={!isCameraReady || isLoading}
          className={`btn-capture ${
            !isCameraReady || isLoading
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:shadow-2xl'
          }`}
          aria-label="사진 촬영"
        >
          <span className="text-4xl">📸</span>
        </button>
      </div>

      {/* 안내 문구 */}
      <p className="text-center text-white/70 mt-4 text-sm">
        쓰레기를 화면 중앙에 맞추고 버튼을 눌러주세요!
      </p>
    </div>
  );
}
