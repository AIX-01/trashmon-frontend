import type { Metadata, Viewport } from 'next';
import './globals.css';

// PWA 메타데이터 설정
export const metadata: Metadata = {
  title: '쓰레기 분류 교실 🌍',
  description: '쓰레기를 촬영하면 AI가 분류하고 분리수거 방법을 알려주는 어린이 교육 앱',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '분류교실',
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
  themeColor: '#4A90D9',
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
