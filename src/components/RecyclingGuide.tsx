'use client';

/**
 * 분리수거 안내 컴포넌트
 * 어린이 친화적인 분리수거 방법을 안내합니다.
 */

interface RecyclingGuideProps {
  category: string;       // 분류 카테고리
  binColor: string;       // 분리수거함 색상
  message: string;        // 안내 메시지
  tips: string[];         // 분리수거 팁
  isVisible: boolean;     // 표시 여부
}

// 카테고리별 이모지 아이콘
const CATEGORY_ICONS: Record<string, string> = {
  '종이': '📦',
  '유리': '🍾',
  '플라스틱': '🥤',
  '캔': '🥫',
  '일반쓰레기': '🗑️',
};

// 분리수거함 색상별 한국어
const BIN_COLORS_KR: Record<string, string> = {
  '파란색': 'bg-blue-500',
  '초록색': 'bg-green-500',
  '노란색': 'bg-yellow-400',
  '빨간색': 'bg-red-500',
  '검은색': 'bg-gray-700',
};

export default function RecyclingGuide({
  category,
  binColor,
  message,
  tips,
}: RecyclingGuideProps) {
  const binColorClass = BIN_COLORS_KR[binColor] || 'bg-gray-500';

  return (
    // 전체를 감싸는 새로운 통합 카드
    <div className="card p-6 pt-16 text-center">
      {/* 1. 결과 발표 */}
      <h2 className="text-3xl font-black text-dark-text mb-1">
        이 친구는 <span className="text-brand-blue">{category}!</span>
      </h2>
      <p className="text-lg font-bold text-dark-text/70 mb-6">{message}</p>

      {/* 구분선 */}
      <hr className="w-1/2 mx-auto border-t-2 border-brand-yellow-subtle my-6" />
      
      {/* 2. 버리는 곳 안내 */}
      <div className="text-left">
        <h3 className="text-xl font-bold text-dark-text mb-3 flex items-center gap-2">
          <span className="text-3xl">👉</span>
          어디에 버릴까?
        </h3>
        <div className="flex items-center gap-4 p-4 bg-brand-yellow-light rounded-2xl">
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-white text-4xl ${binColorClass}`}>
            🗑️
          </div>
          <div>
            <p className="font-bold text-lg text-dark-text">{binColor} 분리수거함</p>
            <p className="text-dark-text/70 font-medium">{category}를 여기에 쏙!</p>
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <hr className="w-1/2 mx-auto border-t-2 border-brand-yellow-subtle my-6" />

      {/* 3. 버리는 법 (꿀팁) */}
      <div className="text-left">
        <h3 className="text-xl font-bold text-dark-text mb-4 flex items-center gap-2">
          <span className="text-3xl">💡</span>
          어떻게 버릴까?
        </h3>
        <ul className="space-y-3">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="text-xl pt-0.5">✔️</span>
              <span className="font-medium text-md text-dark-text/80">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
