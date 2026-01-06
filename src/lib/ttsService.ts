// Google Cloud Text-to-Speech 서비스
import { KOREAN_VOICES, getRandomKoreanVoice, KoreanVoice } from './koreanVoices';

const GOOGLE_TTS_API_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize';

interface TTSRequest {
    input: { text: string };
    voice: {
        languageCode: string;
        name: string;
    };
    audioConfig: {
        audioEncoding: 'MP3' | 'OGG_OPUS' | 'LINEAR16';
        speakingRate?: number;
        pitch?: number;
    };
}

interface TTSResponse {
    audioContent: string; // base64 encoded audio
}

// 현재 세션에서 사용할 음성 (한 번의 안내 동안 동일한 음성 유지)
let currentSessionVoice: KoreanVoice | null = null;

/**
 * 새로운 TTS 세션을 시작할 때 호출
 * 랜덤으로 새 음성을 선택
 */
export function startNewTTSSession(): KoreanVoice {
    currentSessionVoice = getRandomKoreanVoice();
    console.log('[TTS] New session started with voice:', currentSessionVoice.name);
    return currentSessionVoice;
}

/**
 * 현재 세션의 음성 가져오기 (없으면 새로 선택)
 */
export function getCurrentSessionVoice(): KoreanVoice {
    if (!currentSessionVoice) {
        return startNewTTSSession();
    }
    return currentSessionVoice;
}

/**
 * 세션 음성 초기화 (카메라 다시 사용 시 호출)
 */
export function resetTTSSession(): void {
    currentSessionVoice = null;
    console.log('[TTS] Session reset');
}

/**
 * Google TTS API를 사용하여 텍스트를 음성으로 변환
 * @param text 변환할 텍스트
 * @param voice 사용할 음성 (기본값: 현재 세션 음성)
 * @returns 오디오 재생을 위한 Audio 객체 또는 null
 */
export async function synthesizeSpeech(
    text: string,
    voice?: KoreanVoice
): Promise<HTMLAudioElement | null> {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TTS_API_KEY;

    if (!apiKey || apiKey === 'YOUR_GOOGLE_TTS_API_KEY_HERE') {
        console.warn('[TTS] API key not configured. Skipping TTS.');
        return null;
    }

    const selectedVoice = voice || getCurrentSessionVoice();

    const requestBody: TTSRequest = {
        input: { text },
        voice: {
            languageCode: 'ko-KR',
            name: selectedVoice.name,
        },
        audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 1.0,
            pitch: 0,
        },
    };

    try {
        const response = await fetch(`${GOOGLE_TTS_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('[TTS] API error:', response.status, errorData);
            return null;
        }

        const data: TTSResponse = await response.json();

        // Base64 오디오를 Audio 객체로 변환
        const audioBlob = base64ToBlob(data.audioContent, 'audio/mp3');
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        // 메모리 정리를 위한 이벤트 리스너
        audio.addEventListener('ended', () => {
            URL.revokeObjectURL(audioUrl);
        });

        return audio;
    } catch (error) {
        console.error('[TTS] Failed to synthesize speech:', error);
        return null;
    }
}

/**
 * 텍스트를 음성으로 변환하고 즉시 재생
 * @param text 변환할 텍스트
 * @param voice 사용할 음성
 * @returns 재생 완료 시 resolve되는 Promise
 */
export async function speakText(
    text: string,
    voice?: KoreanVoice
): Promise<void> {
    const audio = await synthesizeSpeech(text, voice);

    if (!audio) {
        return;
    }

    return new Promise((resolve, reject) => {
        audio.addEventListener('ended', () => resolve());
        audio.addEventListener('error', (e) => {
            console.error('[TTS] Audio playback error:', e);
            reject(e);
        });

        audio.play().catch((error) => {
            console.error('[TTS] Failed to play audio:', error);
            reject(error);
        });
    });
}

/**
 * Base64 문자열을 Blob으로 변환
 */
function base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
}

/**
 * 여러 문장을 순차적으로 읽기
 * @param texts 읽을 텍스트 배열
 * @param voice 사용할 음성
 */
export async function speakTextsSequentially(
    texts: string[],
    voice?: KoreanVoice
): Promise<void> {
    for (const text of texts) {
        await speakText(text, voice);
    }
}

// TTS 가용성 체크
export function isTTSAvailable(): boolean {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TTS_API_KEY;
    return Boolean(apiKey && apiKey !== 'YOUR_GOOGLE_TTS_API_KEY_HERE');
}

// 사용 가능한 음성 목록 반환
export function getAvailableVoices(): KoreanVoice[] {
    return KOREAN_VOICES;
}
