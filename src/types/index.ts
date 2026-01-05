// src/types/index.ts

// 랭크 타입 (S=10%, A=20%, B=30%, C=40%)
export type MonsterRank = 'S' | 'A' | 'B' | 'C';

// 도감 아이템 (IndexedDB 저장용)
export interface CollectionItem {
  id?: number;                // 자동 증가 ID
  category: string;           // 분리수거 분류
  monsterName: string;        // 캐릭터 이름 (사용자 입력, 필수)
  monsterImage: Blob;         // 캐릭터 이미지 (Blob)
  rank: MonsterRank;          // 랭크 (S/A/B/C)
  capturedAt: Date;           // 잡은 날짜 및 시간
}

// 분류 가이드 (프론트엔드 하드코딩)
export interface CategoryGuide {
  tips: string[];             // 분리수거 팁
}

// 백엔드 API 응답 (category, monster_image만)
export interface ApiResponse {
  category: string;           // 분리수거 분류
  monster_image: string;      // 캐릭터 이미지 (Base64)
}

// 프론트엔드에서 조합한 분류 결과
export interface ClassificationResult {
  category: string;           // 분리수거 분류
  monster_image: string;      // 캐릭터 이미지 (Base64)
  guide: CategoryGuide;       // 프론트엔드에서 매핑한 가이드
}