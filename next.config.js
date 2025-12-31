/** @type {import('next').NextConfig} */
const nextConfig = {
  // PWA 설정을 위한 헤더 추가
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Service-Worker-Allowed',
            value: '/'
          }
        ]
      }
    ];
  },
  // 정적 내보내기 비활성화 (CSR 모드)
  reactStrictMode: true,
};

module.exports = nextConfig;
