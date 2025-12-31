const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // UI/UX 디자이너가 재정의한 색상 팔레트
      colors: {
        'brand-yellow': {
          light: '#FFFBEB', // 부드러운 메인 배경색
          DEFAULT: '#FFD900', // 기존 브랜드 색상 (필요시 사용)
          subtle: '#FFF1B8', // 연한 노란색
        },
        'brand-green': '#2DB400',  // 핵심 포인트 컬러
        'brand-blue': '#0077FF',   // 보조 포인트 컬러
        'dark-text': '#2C2C2C',     // 기본 텍스트 색상
      },
      fontFamily: {
        sans: ['"Noto Sans KR"', ...fontFamily.sans],
      },
      animation: {
        'bounce-slow': 'bounce 2.5s infinite',
        'wiggle': 'wiggle 1.5s ease-in-out infinite',
        'float': 'float 3.5s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
