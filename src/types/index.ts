// src/types/index.ts

// 도감 아이템 (IndexedDB 저장용)
export interface CollectionItem {
  id?: number;                // 자동 증가 ID
  category: string;           // 분리수거 분류
  monsterName: string;        // 캐릭터 이름
  monsterImage: Blob;         // 캐릭터 이미지 (Blob)
  capturedAt: Date;           // 잡은 날짜 및 시간
}

// 분류 결과 가이드
export interface ClassificationGuide {
  bin_color: string;
  message: string;
  tips: string[];
}

// 분류 결과 (백엔드 응답)
export interface ClassificationResult {
  success: boolean;
  category: string;           // 분리수거 분류
  confidence: number;
  monster_name: string;       // 캐릭터 이름
  monster_image: string;      // 캐릭터 이미지 (Base64 또는 URL)
  guide: ClassificationGuide;
}