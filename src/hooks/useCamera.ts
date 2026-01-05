import { useRef, useState, useEffect, useCallback } from 'react';

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isCameraReady: boolean;
  cameraError: string;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  capturePhoto: (onCapture: (blob: Blob) => void) => void;
}

export function useCamera(): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string>('');
  const isStartingRef = useRef(false);

  /**
   * 카메라 스트림 시작
   */
  const startCamera = useCallback(async () => {
    // 이미 시작 중이면 무시
    if (isStartingRef.current) return;
    isStartingRef.current = true;

    // 기존 스트림 정리
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setCameraError('');
    setIsCameraReady(false);

    // 브라우저 지원 체크
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('이 브라우저는 카메라를 지원하지 않아요. 다른 브라우저를 사용해주세요!');
      isStartingRef.current = false;
      return;
    }

    try {
      // 카메라 장치 목록 확인
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(d => d.kind === 'videoinput');

      if (videoDevices.length === 0) {
        setCameraError('카메라를 찾을 수 없어요. 카메라가 연결되어 있는지 확인해주세요!');
        isStartingRef.current = false;
        return;
      }

      // deviceId로 카메라 시도
      for (const device of videoDevices) {
        try {
          const constraints: MediaStreamConstraints = device.deviceId
            ? { video: { deviceId: device.deviceId }, audio: false }
            : { video: true, audio: false };

          const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
          streamRef.current = mediaStream;

          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            await videoRef.current.play();
          }
          isStartingRef.current = false;
          return;
        } catch {
          // 다음 장치 시도
        }
      }

      // fallback: 기본 설정
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (err) {
      const error = err as Error;
      if (error.name === 'NotAllowedError') {
        setCameraError('카메라 권한이 거부되었어요. 브라우저 설정에서 권한을 허용해주세요!');
      } else if (error.name === 'NotFoundError') {
        setCameraError('카메라를 찾을 수 없어요. 카메라가 연결되어 있는지 확인해주세요!');
      } else if (error.name === 'NotReadableError') {
        setCameraError('카메라가 다른 앱에서 사용 중이에요. 다른 앱을 종료해주세요!');
      } else {
        setCameraError('카메라를 켤 수 없어요. 권한을 허용했는지 확인해주세요!');
      }
    }
    isStartingRef.current = false;
  }, []);

  /**
   * 사진 촬영 - 화면에 보이는 영역만 캡처
   */
  const capturePhoto = useCallback((onCapture: (blob: Blob) => void) => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    // 비디오 원본 크기
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    // 화면에 표시되는 비디오 요소의 크기
    const displayWidth = video.clientWidth;
    const displayHeight = video.clientHeight;

    // 비디오와 디스플레이의 비율 계산
    const videoRatio = videoWidth / videoHeight;
    const displayRatio = displayWidth / displayHeight;

    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = videoWidth;
    let sourceHeight = videoHeight;

    // object-cover가 적용된 경우, 화면에 보이는 영역 계산
    if (videoRatio > displayRatio) {
      // 비디오가 더 넓음 → 좌우가 잘림
      sourceWidth = videoHeight * displayRatio;
      sourceX = (videoWidth - sourceWidth) / 2;
    } else {
      // 비디오가 더 높음 → 상하가 잘림
      sourceHeight = videoWidth / displayRatio;
      sourceY = (videoHeight - sourceHeight) / 2;
    }

    // 캔버스 크기는 실제 보이는 영역 비율로 설정 (최대 1080px)
    const maxSize = 1080;
    const scale = Math.min(maxSize / sourceWidth, maxSize / sourceHeight, 1);
    canvas.width = Math.round(sourceWidth * scale);
    canvas.height = Math.round(sourceHeight * scale);

    // 화면에 보이는 영역만 캔버스에 그리기
    context.drawImage(
      video,
      sourceX, sourceY, sourceWidth, sourceHeight,  // 소스 영역
      0, 0, canvas.width, canvas.height              // 대상 영역
    );

    canvas.toBlob((blob) => {
      if (blob) onCapture(blob);
    }, 'image/jpeg', 0.9);
  }, []);

  /**
   * 카메라 스트림 중지
   */
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraReady(false);
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

  // 컴포넌트 마운트 시 카메라 시작
  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    videoRef,
    canvasRef,
    isCameraReady,
    cameraError,
    startCamera,
    stopCamera,
    capturePhoto,
  };
}