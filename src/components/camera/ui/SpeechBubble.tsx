'use client';

import React from 'react';

export const SpeechBubble = ({ text }: { text: string }) => (
  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-gray-800 px-4 py-2 rounded-2xl shadow-md text-center font-jua text-base animate-fade-in-up whitespace-nowrap z-20">
    {text}
    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white" />
  </div>
);

export default SpeechBubble;