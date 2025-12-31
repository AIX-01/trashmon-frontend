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
  isVisible,
}: RecyclingGuideProps) {
  if (!isVisible) return null;

  const icon = CATEGORY_ICONS[category] || '♻️';
  const binColorClass = BIN_COLORS_KR[binColor] || 'bg-gray-500';

  return (
    <div className="result-card space-y-6 mt-6">
      {/* 분류 결과 헤더 */}
      <div className="glass-card p-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-4xl">{icon}</span>
          <h2 className="text-2xl font-black text-white">{category}</h2>
          <span className="text-4xl">{icon}</span>
        </div>
        
        {/* 안내 메시지 */}
        <p className="text-xl text-white/90 font-bold">{message}</p>
      </div>

      {/* 분리수거함 안내 */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>🎯</span>
          어디에 버릴까요?
        </h3>
        
        <div className="flex items-center gap-4">
          {/* 분리수거함 아이콘 */}
          <div className={`bin-indicator ${binColorClass} text-white`}>
            <span className="text-2xl">🗑️</span>
          </div>
          
          <div>
            <p className="text-white font-bold text-lg">
              {binColor} 분리수거함
            </p>
            <p className="text-white/70 text-sm">
              {category} 전용 수거함에 넣어주세요!
            </p>
          </div>
        </div>
      </div>

      {/* 분리수거 팁 */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>💡</span>
          분리수거 꿀팁!
        </h3>
        
        <ul className="space-y-3">
          {tips.map((tip, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-white/90"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="text-xl mt-0.5">
                {index === 0 ? '1️⃣' : index === 1 ? '2️⃣' : '3️⃣'}
              </span>
              <span className="font-medium">{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 격려 메시지 */}
      <div className="text-center py-4">
        <p className="text-2xl mb-2">🌟 잘했어요! 🌟</p>
        <p className="text-white/80 font-medium">
          분리수거를 잘 하면 지구가 깨끗해져요! 🌍
        </p>
      </div>

      {/* 다시 촬영 버튼 */}
      <div className="flex justify-center">
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          <span className="mr-2">📸</span>
          다시 촬영하기
        </button>
      </div>
    </div>
  );
}
