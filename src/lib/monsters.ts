// src/lib/monsters.ts
import { CategoryGuide, MonsterRank } from '@/types';

// 카테고리별 가이드 정보 (하드코딩)
export const CATEGORY_GUIDES: Record<string, CategoryGuide> = {
  '종이': {
    tips: ['테이프나 스티커는 떼어볼까요?', '이제 납작하게 접어봐요!', '종이 분류함에 쏙~ 넣으면 성공!'],
  },
  '유리': {
    tips: ['다 마셨나요? 물로 헹궈주세요!', '뚜껑은 따로 빼요!', '유리 분류함에 깨지지 않게 살짝 넣으면 성공!'],
  },
  '플라스틱': {
    tips: ['라벨은 쓱~ 벗기기!', '꾹꾹 눌러 작게 만들어요.', '플라스틱 분류함에 퐁~ 던지면 성공!'],
  },
  '캔': {
    tips: ['남은 음료를 싹 비우고 물로 한번 헹궈요~', '꾹 눌러 납작하게 해요.', '캔 분류함에 딩동~ 넣으면 성공!'],
  },
  '일반쓰레기': {
    tips: ['냄새나거나 더러운 건 일반쓰레기!', '물기 쏙~ 빼면 더 좋아요.', '일반쓰레기 분류함에 쏙 넣으면 성공!'],
  }
};

// 카테고리로 가이드 조회
export function getGuideByCategory(category: string): CategoryGuide {
  return CATEGORY_GUIDES[category] || CATEGORY_GUIDES['일반쓰레기'];
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