import { useRef, useState, useEffect, useCallback } from 'react';

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isCameraReady: boolean;
  cameraError: string;
  startCamera: () => Promise<void>;
  capturePhoto: (onCapture: (blob: Blob) => void) => void;
}

export function useCamera(): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string>('');

  /**
   * 카메라 스트림 시작
   */
  const startCamera = useCallback(async () => {
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
  const capturePhoto = useCallback((onCapture: (blob: Blob) => void) => {
    if (!videoRef.current || !canvasRef.current) return;

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
  }, []);

  /**
   * 비디오 준비 완료 핸들러
   */
  const handleCanPlay = useCallback(() => {
    setIsCameraReady(true);
  }, []);

  // 비디오 요소에 이벤트 리스너 연결
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('canplay', handleCanPlay);
      return () => video.removeEventListener('canplay', handleCanPlay);
    }
  }, [handleCanPlay]);

  // 컴포넌트 마운트/언마운트 시 카메라 관리
  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    videoRef,
    canvasRef,
    isCameraReady,
    cameraError,
    startCamera,
    capturePhoto,
  };
}