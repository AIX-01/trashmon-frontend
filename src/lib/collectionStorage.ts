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