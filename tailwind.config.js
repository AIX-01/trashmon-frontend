/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 어린이 친화적인 색상 팔레트
      colors: {
        paper: '#4A90D9',      // 종이 - 파란색
        glass: '#7CB342',      // 유리 - 초록색
        plastic: '#FFD54F',    // 플라스틱 - 노란색
        can: '#EF5350',        // 캔 - 빨간색
        trash: '#78909C',      // 일반쓰레기 - 회색
      },
      // 귀여운 애니메이션
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      // 둥근 모서리 (어린이 친화적)
      borderRadius: {
        'blob': '60% 40% 30% 70% / 60% 30% 70% 40%',
      },
    },
  },
  plugins: [],
}
