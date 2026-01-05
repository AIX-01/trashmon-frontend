// src/lib/monsters.ts
import { CategoryGuide, MonsterRank } from '@/types';

// 카테고리별 가이드 정보 (하드코딩)
export const CATEGORY_GUIDES: Record<string, CategoryGuide> = {
  '종이': {
    tips: ['물에 젖지 않게, 테이프는 떼고 버려요.'],
  },
  '유리': {
    tips: ['뚜껑을 떼고, 안을 한번 헹궈서 버려요.'],
  },
  '플라스틱': {
    tips: ['라벨을 떼고, 깨끗이 씻어서 버려요.'],
  },
  '캔': {
    tips: ['납작하게 밟아서, 조심해서 버려요.'],
  },
  '일반쓰레기': {
    tips: ['재활용이 어려운 친구들이에요.'],
  }
};

// 카테고리로 가이드 조회
export function getGuideByCategory(category: string): CategoryGuide {
  return CATEGORY_GUIDES[category];
}

/**
 * 랜덤 랭크 생성
 * S=10%, A=20%, B=30%, C=40%
 */
export function generateRandomRank(): MonsterRank {
  const random = Math.random() * 100;

  if (random < 10) return 'S';
  if (random < 30) return 'A';
  if (random < 60) return 'B';
  return 'C';
}