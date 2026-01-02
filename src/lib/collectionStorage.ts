import { CollectionItem, ClassificationResult } from '@/types';
import { db } from './db';

/**
 * Base64 문자열을 Blob으로 변환
 */
function base64ToBlob(base64: string, mimeType: string = 'image/png'): Blob {
  // data:image/png;base64, 접두사 제거
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

/**
 * 도감에 새로운 몬스터 저장
 */
export async function saveToCollection(resultData: ClassificationResult): Promise<void> {
  try {
    // 이미지를 Blob으로 변환
    const imageBlob = base64ToBlob(resultData.monster_image);

    await db.collection.add({
      category: resultData.category,
      monsterName: resultData.monster_name,
      monsterImage: imageBlob,
      capturedAt: new Date(),
    });
  } catch (e) {
    console.error('도감 저장 실패:', e);
  }
}

/**
 * 도감에서 모든 아이템 가져오기
 */
export async function getAllCollection(): Promise<CollectionItem[]> {
  try {
    return await db.collection.orderBy('capturedAt').reverse().toArray();
  } catch (e) {
    console.error('도감 조회 실패:', e);
    return [];
  }
}

/**
 * 특정 ID로 아이템 가져오기
 */
export async function getCollectionItem(id: number): Promise<CollectionItem | undefined> {
  try {
    return await db.collection.get(id);
  } catch (e) {
    console.error('도감 아이템 조회 실패:', e);
    return undefined;
  }
}

/**
 * 도감 초기화
 */
export async function clearCollection(): Promise<void> {
  try {
    await db.collection.clear();
  } catch (e) {
    console.error('도감 초기화 실패:', e);
  }
}

/**
 * Blob을 Object URL로 변환 (이미지 표시용)
 */
export function createImageUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

/**
 * Object URL 해제 (메모리 정리)
 */
export function revokeImageUrl(url: string): void {
  URL.revokeObjectURL(url);
}

// 더미 몬스터 데이터
const DUMMY_MONSTERS = [
  { category: '플라스틱', name: '플라몬', color: '#60A5FA' },
  { category: '캔', name: '캔디몬', color: '#F87171' },
  { category: '종이', name: '페이퍼몬', color: '#FBBF24' },
  { category: '유리', name: '글래스몬', color: '#34D399' },
  { category: '비닐', name: '비닐몬', color: '#A78BFA' },
  { category: '배터리', name: '볼트몬', color: '#EF4444' },
  { category: '의류', name: '패브릭몬', color: '#EC4899' },
  { category: '금속', name: '메탈몬', color: '#9CA3AF' },
  { category: '폐유', name: '오일몬', color: '#1F2937' },
  { category: '전구', name: '라이트몬', color: '#FEF3C7' },
  { category: '음식물', name: '푸드몬', color: '#10B981' },
  { category: '일반쓰레기', name: '트래시몬', color: '#6B7280' },
  { category: '스티로폼', name: '폼폼몬', color: '#F3F4F6' },
  { category: '고철', name: '아이언몬', color: '#78716C' },
  { category: '형광등', name: '네온몬', color: '#E879F9' },
  { category: '약품', name: '케미몬', color: '#22D3EE' },
  { category: '가구', name: '퍼니몬', color: '#CA8A04' },
  { category: '전자제품', name: '테크몬', color: '#3B82F6' },
  { category: '도자기', name: '세라믹몬', color: '#FCD34D' },
  { category: '고무', name: '러버몬', color: '#1C1917' },
];

/**
 * 더미 이미지 Blob 생성 (SVG 기반)
 */
function createDummyImageBlob(name: string, color: string): Blob {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="80" fill="${color}"/>
      <circle cx="70" cy="80" r="15" fill="white"/>
      <circle cx="130" cy="80" r="15" fill="white"/>
      <circle cx="70" cy="80" r="8" fill="#333"/>
      <circle cx="130" cy="80" r="8" fill="#333"/>
      <ellipse cx="100" cy="130" rx="30" ry="15" fill="white" opacity="0.5"/>
      <text x="100" y="180" text-anchor="middle" font-size="14" fill="#333">${name}</text>
    </svg>
  `;
  return new Blob([svg], { type: 'image/svg+xml' });
}

/**
 * 랜덤 날짜 생성 (최근 30일 내)
 */
function getRandomDate(): Date {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  return new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
}

/**
 * 더미 데이터 추가 (도감이 비어있을 경우)
 */
export async function seedDummyData(): Promise<void> {
  try {
    const count = await db.collection.count();

    if (count === 0) {
      console.log('도감이 비어있어 더미 데이터를 추가합니다...');

      const dummyItems = DUMMY_MONSTERS.map(monster => ({
        category: monster.category,
        monsterName: monster.name,
        monsterImage: createDummyImageBlob(monster.name, monster.color),
        capturedAt: getRandomDate(),
      }));

      await db.collection.bulkAdd(dummyItems);
      console.log(`더미 데이터 ${dummyItems.length}개 추가 완료!`);
    }
  } catch (e) {
    console.error('더미 데이터 추가 실패:', e);
  }
}

/**
 * 도감 초기화 후 더미 데이터 재생성
 */
export async function resetWithDummyData(): Promise<void> {
  await clearCollection();
  await seedDummyData();
}