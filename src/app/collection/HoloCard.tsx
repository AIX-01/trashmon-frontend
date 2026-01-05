'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import './HoloCard.css';
import { MonsterRank } from '@/types';
import { getGuideByCategory } from '@/lib/monsters';
import { Pencil, Check, X } from 'lucide-react';

interface HoloCardProps {
  id?: number;
  category: string;
  monsterName: string;
  imageUrl: string;
  date?: string;
  rank: MonsterRank;
  onNameUpdate?: (newName: string) => void;
}

// 랭크별 스타일 정의
const getRankStyles = (rank: MonsterRank) => {
  const styles = {
    S: {
      borderColor: 'border-yellow-400',
      headerBg: 'bg-gradient-to-r from-yellow-100 to-amber-100',
      headerText: 'text-amber-900',
      rankBadge: 'bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 shadow-lg shadow-yellow-400/50',
      artworkBg: 'bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100',
      footerBorder: 'border-yellow-300',
      rankDisplay: 'text-yellow-600 bg-yellow-50 border-yellow-300',
      backBorder: 'border-yellow-300',
      backHeader: 'text-yellow-600',
      glow: 'shadow-[0_0_30px_rgba(251,191,36,0.6)]',
      rank: 'S',
      rankLabel: '레전드'
    },
    A: {
      borderColor: 'border-purple-300',
      headerBg: 'bg-gradient-to-r from-purple-100 to-violet-100',
      headerText: 'text-purple-900',
      rankBadge: 'bg-gradient-to-r from-purple-400 to-violet-500 shadow-lg shadow-purple-400/40',
      artworkBg: 'bg-gradient-to-br from-purple-50 via-violet-50 to-purple-100',
      footerBorder: 'border-purple-300',
      rankDisplay: 'text-purple-600 bg-purple-50 border-purple-300',
      backBorder: 'border-purple-300',
      backHeader: 'text-purple-600',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.4)]',
      rank: 'A',
      rankLabel: '희귀'
    },
    B: {
      borderColor: 'border-sky-200',
      headerBg: 'bg-sky-100',
      headerText: 'text-sky-800',
      rankBadge: 'bg-gradient-to-r from-pink-400 to-pink-500',
      artworkBg: 'bg-gradient-to-b from-white to-sky-50',
      footerBorder: 'border-sky-200',
      rankDisplay: 'text-sky-700 bg-sky-100 border-sky-200',
      backBorder: 'border-pink-200',
      backHeader: 'text-pink-500',
      glow: '',
      rank: 'B',
      rankLabel: '일반'
    },
    C: {
      borderColor: 'border-gray-300',
      headerBg: 'bg-gray-100',
      headerText: 'text-gray-700',
      rankBadge: 'bg-gradient-to-r from-gray-400 to-gray-500',
      artworkBg: 'bg-gradient-to-b from-white to-gray-50',
      footerBorder: 'border-gray-300',
      rankDisplay: 'text-gray-600 bg-gray-100 border-gray-300',
      backBorder: 'border-gray-300',
      backHeader: 'text-gray-600',
      glow: '',
      rank: 'C',
      rankLabel: '평범'
    }
  };
  
  // rank가 유효하지 않으면 B 랭크를 기본값으로 반환
  return styles[rank] || styles.B;
};

export default function HoloCard({ id, category, monsterName, imageUrl, date = '2024-01-01', rank, onNameUpdate }: HoloCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(monsterName);
  const rankStyle = getRankStyles(rank);

  const handleClick = () => {
    if (isEditing) return; // 편집 중에는 뒤집기 방지
    setIsFlipped(!isFlipped);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editName.trim() && editName !== monsterName) {
      onNameUpdate?.(editName);
    }
    setIsEditing(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditName(monsterName);
    setIsEditing(false);
  };

  return (
    <div className="holo-card-container font-['Jua'] group" onClick={handleClick}>
      <style jsx>{`
         @import url('https://fonts.googleapis.com/css2?family=Jua&display=swap');
         .font-jua { font-family: 'Jua', sans-serif; }
      `}</style>

      <div className={`holo-card ${isFlipped ? 'flipped' : ''}`}>
        
        {/* FRONT (PASTEL THEME WITH RANK DIFFERENTIATION) */}
        <div className="holo-card-face holo-card-front">
          <div className={`w-full h-full relative bg-white border-8 ${rankStyle.borderColor} overflow-hidden flex flex-col shadow-inner${rankStyle.glow ? ' ' + rankStyle.glow : ''}`} style={{ borderRadius: '23px' }}>
            
            {/* Header / Name */}
            <div className={`h-14 ${rankStyle.headerBg} flex items-center justify-between px-4 border-b-4 ${rankStyle.borderColor} z-10 relative`}>
              {isEditing ? (
                <div className="flex items-center gap-1 w-full mr-2" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-2 py-1 rounded-lg text-sm font-bold border-2 border-green-400 focus:outline-none focus:border-green-600 text-gray-800"
                    autoFocus
                    maxLength={10}
                  />
                  <button onClick={handleSave} className="p-1 bg-green-500 rounded-md text-white hover:bg-green-600 transition shadow-sm">
                    <Check size={16} strokeWidth={3} />
                  </button>
                  <button onClick={handleCancel} className="p-1 bg-gray-400 rounded-md text-white hover:bg-gray-500 transition shadow-sm">
                    <X size={16} strokeWidth={3} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 overflow-hidden">
                   <span className={`${rankStyle.headerText} font-bold text-xl drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)] truncate`}>
                      {monsterName}
                   </span>
                   {onNameUpdate && (
                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         setIsEditing(true);
                         setEditName(monsterName);
                       }}
                       className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 hover:bg-white p-1 rounded-full text-gray-500 hover:text-green-600"
                     >
                       <Pencil size={14} />
                     </button>
                   )}
                </div>
              )}
              
              {!isEditing && (
                <span className={`text-white text-xs ${rankStyle.rankBadge} px-2.5 py-1 rounded-full font-bold shadow-md shrink-0 ml-2`}>
                  {rankStyle.rank}급
                </span>
              )}
            </div>

            {/* ARTWORK AREA */}
            <div className={`flex-1 relative ${rankStyle.artworkBg} flex items-center justify-center p-4`}>
               {/* Optional: Subtle Pattern Background */}
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>
               
               <div className="card__shine opacity-40"></div>
               
               <div className="z-20 relative w-36 h-36 transform hover:scale-110 transition-transform duration-300">
                 <Image
                   src={imageUrl}
                   alt={monsterName}
                   fill
                   className="object-contain drop-shadow-xl"
                   unoptimized
                 />
               </div>
            </div>

            {/* Footer / Stats */}
            <div className={`h-32 bg-white p-3 z-10 text-xs text-slate-700 relative border-t-4 ${rankStyle.footerBorder}`}>
               <div className="flex items-center gap-2 mb-1">
                 <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-md font-bold text-xs border border-orange-300 shadow-sm">
                    {category}
                 </span>
                 <span className="text-slate-700 text-xs font-semibold">{date}</span>
               </div>
               <p className="text-sm leading-snug text-slate-800 font-semibold mb-1">
                  자연을 사랑하는 {monsterName}!
                  분리수거를 통해 지구를 지켜주세요.
               </p>
               <div className="mt-1 flex justify-end">
                 <span className={`${rankStyle.rankDisplay} font-bold text-sm px-2.5 py-0.5 rounded-lg border-2 shadow-sm whitespace-nowrap`}>
                   ★ {rankStyle.rankLabel}
                 </span>
               </div>
            </div>

          </div>
        </div>

        {/* BACK (PASTEL THEME WITH RANK DIFFERENTIATION) */}
        <div className={`holo-card-face holo-card-back bg-white border-8 ${rankStyle.backBorder} flex flex-col p-6 items-center justify-center text-center`} style={{ borderRadius: '23px' }}>
          <h2 className={`text-2xl font-bold mb-4 ${rankStyle.backHeader}`}>{monsterName}의<br/>분리수거 꿀팁!</h2>

          <div className="flex-1 w-full overflow-y-auto px-1 custom-scrollbar">
             <ul className="space-y-3 text-left">
                {getGuideByCategory(category)?.tips.map((tip, idx) => (
                   <li key={idx} className={`bg-gray-50 p-3 rounded-xl border ${rankStyle.borderColor} text-sm text-gray-700 font-medium leading-relaxed flex gap-2`}>
                      <span className={`${rankStyle.headerText} font-bold`}>{idx + 1}.</span>
                      {tip}
                   </li>
                ))}
                {!getGuideByCategory(category) && (
                   <li className="text-gray-400 text-center py-4">팁을 불러올 수 없어요.</li>
                )}
             </ul>
          </div>
        </div>

      </div>
    </div>
  );
}