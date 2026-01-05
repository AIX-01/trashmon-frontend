// src/lib/monsters.ts
import { CategoryGuide, MonsterRank } from '@/types';

// 카테고리별 가이드 정보 (하드코딩)
export const CATEGORY_GUIDES: Record<string, CategoryGuide> = {
  '종이': {
    message: '종이는 파란색 통에 쏙!',
    tips: ['물에 젖지 않게, 테이프는 떼고 버려요.'],
  },
  '유리': {
    message: '유리병은 초록색 통에 쏙!',
    tips: ['뚜껑을 떼고, 안을 한번 헹궈서 버려요.'],
  },
  '플라스틱': {
    message: '플라스틱은 노란색 통에 쏙!',
    tips: ['라벨을 떼고, 깨끗이 씻어서 버려요.'],
  },
  '캔': {
    message: '캔은 빨간색 통에 쏙!',
    tips: ['납작하게 밟아서, 조심해서 버려요.'],
  },
  '일반쓰레기': {
    message: '일반쓰레기는 검은 봉투에!',
    tips: ['재활용이 어려운 친구들이에요.'],
  }
};

// 기본 가이드 (알 수 없는 카테고리용)
export const DEFAULT_GUIDE: CategoryGuide = {
  message: '어떤 쓰레기인지 잘 모르겠어요!',
  tips: ['다시 한번 확인해보세요.'],
};

// 카테고리로 가이드 조회
export function getGuideByCategory(category: string): CategoryGuide {
  return CATEGORY_GUIDES[category] || DEFAULT_GUIDE;
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