/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [], // 外部画像ドメインがあれば追加
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1年
  },
  // 本番最適化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // ESLint設定
  eslint: {
    // 本番ビルド時にESLintエラーを警告として扱う
    ignoreDuringBuilds: false,
  },
  // TypeScript設定
  typescript: {
    // 型チェックエラーがあってもビルドを続行（本番環境では注意）
    ignoreBuildErrors: false,
  },
  // PWA対応
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@heroicons/react'],
  },
  // バンドル最適化
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      }
    }
    return config
  },
  // セキュリティヘッダー
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com;",
          },
        ],
      },
    ]
  },
  // 環境変数
  env: {
    // CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

export default nextConfig