import { Recycle, Instagram, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4 text-white">
            <Recycle size={24} />
            <span className="font-jua text-2xl">분리수거 대모험</span>
          </div>
          <p className="text-sm leading-relaxed mb-6">
            아이들이 놀이를 통해 자연스럽게 환경 보호의 중요성을 깨닫고<br/>
            올바른 분리배출 습관을 기를 수 있도록 돕습니다.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
            <a href="#" className="hover:text-white transition-colors"><Mail size={20} /></a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">바로가기</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-green-400">서비스 소개</a></li>
            <li><a href="#" className="hover:text-green-400">자주 묻는 질문</a></li>
            <li><a href="#" className="hover:text-green-400">개인정보처리방침</a></li>
            <li><a href="#" className="hover:text-green-400">이용약관</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Mail size={16}/> help@recycle-adventure.com</li>
            <li className="flex items-center gap-2"><Phone size={16}/> 02-1234-5678</li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 mt-12 pt-8 border-t border-gray-800 text-xs text-center">
        © 2024 Green Future Lab. All rights reserved.
      </div>
    </footer>
  );
}