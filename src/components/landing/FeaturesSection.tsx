import { Award, Recycle, Heart } from 'lucide-react';

const FEATURES = [
  {
    icon: <Award className="text-orange-500" size={32} />,
    title: "보물 수집 시스템",
    desc: "다양한 랭크의 카드들! 성취감을 높여주는 레벨업 시스템!",
    color: "bg-orange-50"
  },
  {
    icon: <Recycle className="text-green-500" size={32} />,
    title: "나만의 도감 완성",
    desc: "직접 모은 재활용품으로 나만의 도감을 채워보세요. 캔, 플라스틱 등 재질별 학습이 가능합니다.",
    color: "bg-green-50"
  },
  {
    icon: <Heart className="text-pink-500" size={32} />,
    title: "귀여운 캐릭터",
    desc: "고양이 기반의 몬스터는 정말 귀엽죠. 아이들이 애착을 가지고 플레이합니다.",
    color: "bg-pink-50"
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-green-600 font-bold tracking-wider uppercase">Features</span>
          <h2 className="font-jua text-4xl mt-2 mb-4 text-gray-900">아이들이 더 좋아하는 기능</h2>
          <p className="text-gray-600">스스로 참여하고 싶게 만드는 다양한 장치가 숨어있어요.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((feature, idx) => (
            <div key={idx} className={`${feature.color} p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 border border-gray-100 shadow-sm`}>
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm mb-6">
                {feature.icon}
              </div>
              <h3 className="font-jua text-2xl mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}