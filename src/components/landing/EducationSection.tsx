import { CheckCircle } from 'lucide-react';

export default function EducationSection() {
  return (
    <section id="education" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
          <div className="flex-1 order-2 md:order-1">
            <div className="bg-white p-6 rounded-3xl shadow-xl transform rotate-2 relative">
              <div className="absolute -top-4 -left-4 bg-yellow-400 text-white font-bold px-4 py-2 rounded-lg shadow-lg">STEP 1</div>
              <div className="h-48 bg-sky-100 rounded-2xl flex items-center justify-center">
                <span className="font-jua text-sky-400 text-2xl">📷 사진 찍기 놀이</span>
              </div>
            </div>
          </div>
          <div className="flex-1 order-1 md:order-2">
            <h3 className="font-jua text-3xl mb-4 text-gray-900">관찰력이 쑥쑥!<br/>몬스터 찾기 놀이</h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              그냥 지나치던 몬스터도 이제는 보물처럼! <br/>
              주변 환경에 관심을 갖고 관찰하는 습관을 길러줍니다.
            </p>
            <ul className="space-y-3">
              {['주변 탐색 능력 향상', '환경에 대한 호기심 자극', '능동적인 참여 유도'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="text-green-500" size={20} /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h3 className="font-jua text-3xl mb-4 text-gray-900">분류 능력 UP!<br/>올바른 분리배출 학습</h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              페트병은 비닐을 떼고, 캔은 찌그러뜨리고! <br/>
              게임 미션을 통해 자연스럽게 올바른 방법을 익힙니다.
            </p>
            <ul className="space-y-3">
              {['재질별 특징 이해', '소근육 발달 놀이', '시민 의식 함양'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="text-green-500" size={20} /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <div className="bg-white p-6 rounded-3xl shadow-xl transform -rotate-2 relative">
              <div className="absolute -top-4 -right-4 bg-green-500 text-white font-bold px-4 py-2 rounded-lg shadow-lg">STEP 2</div>
              <div className="h-48 bg-green-100 rounded-2xl flex items-center justify-center">
                <span className="font-jua text-green-500 text-2xl">♻️ 분리해서 버리기</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}