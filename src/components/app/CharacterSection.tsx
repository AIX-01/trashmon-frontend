'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const MESSAGES = [
  "안녕! 같이 갈래?",
  "지구를 지켜줘!",
  "분리수거는 즐거워!",
  "나는 캔이야!",
  "우리는 친구!"
];

export default function CharacterSection() {
  const [greeting, setGreeting] = useState(MESSAGES[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex justify-center items-end relative mb-0">
      {/* 말풍선 */}
      <div className="absolute top-[40px] right-[-20px] bg-white px-6 py-3 rounded-2xl rounded-bl-none shadow-lg border-2 border-green-500 animate-float z-20 transform rotate-2">
        <p className="text-green-700 text-xl font-bold">{greeting}</p>
      </div>

      {/* 캐릭터 그룹 */}
      <div className="relative flex items-end gap-1 animate-float">
        <div className="relative z-10">
          <div className="w-64 h-80 relative animate-sway">
            <Image
              src="/trashmon-friends.png"
              alt="트래시몬 친구들"
              width={256}
              height={320}
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}