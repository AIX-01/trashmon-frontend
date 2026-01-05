// Google Cloud Text-to-Speech 한국어 (ko-KR) 음성 목록
// 출처: https://docs.cloud.google.com/text-to-speech/docs/voices

export type VoiceGender = 'FEMALE' | 'MALE';
export type VoiceType = 'Standard' | 'Premium';

export interface KoreanVoice {
  name: string;
  gender: VoiceGender;
  type: VoiceType;
}

// 전체 한국어 음성 목록
export const KOREAN_VOICES: KoreanVoice[] = [
  // Chirp3-HD Premium 음성 (30개)
  // Chirp3 모델만 사용함(기본 무료 사용량 제공 모델)
  { name: 'ko-KR-Chirp3-HD-Achernar', gender: 'FEMALE', type: 'Premium' },
  { name: 'ko-KR-Chirp3-HD-Achird', gender: 'MALE', type: 'Premium' },
  { name: 'ko-KR-Chirp3-HD-Algenib', gender: 'MALE', type: 'Premium' },
  { name: 'ko-KR-Chirp3-HD-Algieba', gender: 'MALE', type: 'Premium' },
  { name: 'ko-KR-Chirp3-HD-Alnilam', gender: 'MALE', type: 'Premium' },
  { name: 'ko-KR-Chirp3-HD-Aoede', gender: 'FEMALE', type: 'Premium' },
  { name: 'ko-KR-Chirp3-HD-Autonoe', gender: 'FEMALE', type: 'Premium' },
  { name: 'ko-KR-Chirp3-HD-Callirrhoe', gender: 'FEMALE', type: 'Premium' },
  { name: 'ko-KR-Chirp3-HD-Charon', gender: 'MALE', type: 'Premium' },
  { name: 'ko-KR-Chirp3-HD-Despina', gender: 'FEMALE', type: 'Premium' },
  { name: 'ko-KR-Chirp3-HD-Enceladus', gender: 'MALE', type: 'Premium' },
  { name: 'ko-KR-Chirp3-HD-Erinome', gender: 'FEMALE', type: 'Premium' },
  { name: 'ko-KR-Chirp3-HD-Fenrir', gender: 'MALE', type: 'Premium' },
  { name: 'ko-KR-Chirp3-HD-Gacrux', gender: 'FEMALE', type: 'Premium' },
  { name: 'ko-KR-Chirp3-HD-Iapetus', gender: 'MALE', type: 'Premium' },
  { name: 'ko-KR-Chirp3-HD-Kore', gender: 'FEMALE', type: 'Premium' },
  { name: 'ko-KR-Chirp3-HD-Laomedeia', gender: 'FEMALE', type: 'Premium' },
  { name: 'ko-KR-Chirp3-HD-Leda', gender: 'FEMALE', type: 'Premium' },
  { name: 'ko-KR-Chirp3-HD-Orus', gender: 'MALE', type: 'Premium' },
  { name: 'ko-KR-Chirp3-HD-Puck', gender: 'MALE', type: 'Premium' },
  { name: 'ko-KR-Chirp3-HD-Pulcherrima', gender: 'FEMALE', type: 'Premium' },
  { name: 'ko-KR-Chirp3-HD-Rasalgethi', gender: 'MALE', type: 'Premium' },
  { name: 'ko-KR-Chirp3-HD-Sadachbia', gender: 'MALE', type: 'Premium' },
  { name: 'ko-KR-Chirp3-HD-Sadaltager', gender: 'MALE', type: 'Premium' },
  { name: 'ko-KR-Chirp3-HD-Schedar', gender: 'MALE', type: 'Premium' },
  { name: 'ko-KR-Chirp3-HD-Sulafat', gender: 'FEMALE', type: 'Premium' },
  { name: 'ko-KR-Chirp3-HD-Umbriel', gender: 'MALE', type: 'Premium' },
  { name: 'ko-KR-Chirp3-HD-Vindemiatrix', gender: 'FEMALE', type: 'Premium' },
  { name: 'ko-KR-Chirp3-HD-Zephyr', gender: 'FEMALE', type: 'Premium' },
  { name: 'ko-KR-Chirp3-HD-Zubenelgenubi', gender: 'MALE', type: 'Premium' },
];

// 랜덤 음성 선택 함수
export function getRandomKoreanVoice(): KoreanVoice {
  const randomIndex = Math.floor(Math.random() * KOREAN_VOICES.length);
  return KOREAN_VOICES[randomIndex];
}
