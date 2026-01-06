import type { Metadata, Viewport } from 'next';
import './globals.css';

// PWA 메타데이터 설정
export const metadata: Metadata = {
  title: '트래시몬 - TRASHMON 🎮',
  description: '몬스터를 잡아라! 카메라로 몬스터를 찍으면 몬스터가 나타나는 신나는 어린이 분리수거 게임',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '트래시몬',
  },
  formatDetection: {
    telephone: false,
  },
};

// PWA 뷰포트 설정
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#10b981',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* PWA 아이콘 */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        {/* Google Fonts - Noto Sans KR */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
        {/* Service Worker 등록 스크립트 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('✅ Service Worker 등록 성공:', registration.scope);
                    },
                    function(error) {
                      console.log('❌ Service Worker 등록 실패:', error);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}