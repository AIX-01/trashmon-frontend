const REVIEWS = [
  {
    text: "아이가 길 가다가 쓰레기만 보면 '엄마 이거 보물이야?' 하고 물어봐요. 교육 효과 200%입니다!",
    author: "6세 지우맘",
    role: "★★★★★"
  },
  {
    text: "캐릭터를 자기 얼굴로 꾸며주니까 너무 좋아하네요. 억지로 시키지 않아도 스스로 하려고 해요.",
    author: "5세 현수파파",
    role: "★★★★★"
  },
  {
    text: "유치원 숙제로 알게 되었는데, 주말마다 아이랑 동네 청소하러 다니는 게 취미가 되었어요.",
    author: "7세 서연맘",
    role: "★★★★★"
  }
];

export default function ReviewsSection() {
  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-jua text-4xl text-center mb-16 text-gray-900">먼저 써본 부모님들의 이야기</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {REVIEWS.map((review, i) => (
            <div key={i} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 relative">
              <div className="text-4xl text-sky-200 font-serif absolute top-4 left-6">&quot;</div>
              <p className="text-gray-700 mb-6 relative z-10 pt-4 leading-relaxed">{review.text}</p>
              <div className="flex items-center justify-between border-t pt-4">
                <span className="font-bold text-gray-900">{review.author}</span>
                <span className="text-yellow-400 tracking-widest">{review.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}