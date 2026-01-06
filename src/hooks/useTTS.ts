'use client';

import { useCallback, useEffect, useRef } from 'react';
import {
    speakText,
    startNewTTSSession,
    resetTTSSession,
    getCurrentSessionVoice,
    isTTSAvailable,
} from '@/lib/ttsService';
import { KoreanVoice } from '@/lib/koreanVoices';

interface UseTTSOptions {
    onSpeakStart?: () => void;
    onSpeakEnd?: () => void;
    onError?: (error: Error) => void;
}

interface UseTTSReturn {
    speak: (text: string) => Promise<void>;
    startNewSession: () => KoreanVoice;
    resetSession: () => void;
    getCurrentVoice: () => KoreanVoice;
    isAvailable: boolean;
    isSpeaking: boolean;
}

/**
 * TTS 기능을 위한 React Hook
 * 컴포넌트에서 쉽게 TTS를 사용할 수 있게 해줍니다.
 */
export function useTTS(options: UseTTSOptions = {}): UseTTSReturn {
    const isSpeakingRef = useRef(false);
    const { onSpeakStart, onSpeakEnd, onError } = options;

    // 컴포넌트 언마운트 시 세션 리셋
    useEffect(() => {
        return () => {
            resetTTSSession();
        };
    }, []);

    const speak = useCallback(
        async (text: string): Promise<void> => {
            if (!isTTSAvailable()) {
                console.log('[useTTS] TTS not available, skipping');
                return;
            }

            if (isSpeakingRef.current) {
                console.log('[useTTS] Already speaking, skipping');
                return;
            }

            try {
                isSpeakingRef.current = true;
                onSpeakStart?.();

                await speakText(text);

                onSpeakEnd?.();
            } catch (error) {
                console.error('[useTTS] Speak error:', error);
                onError?.(error as Error);
            } finally {
                isSpeakingRef.current = false;
            }
        },
        [onSpeakStart, onSpeakEnd, onError]
    );

    const startNewSession = useCallback((): KoreanVoice => {
        return startNewTTSSession();
    }, []);

    const resetSession = useCallback((): void => {
        resetTTSSession();
    }, []);

    const getCurrentVoice = useCallback((): KoreanVoice => {
        return getCurrentSessionVoice();
    }, []);

    return {
        speak,
        startNewSession,
        resetSession,
        getCurrentVoice,
        isAvailable: isTTSAvailable(),
        isSpeaking: isSpeakingRef.current,
    };
}

export default useTTS;
