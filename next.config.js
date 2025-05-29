/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [], // 外部画像ドメインがあれば追加
  },
  // 本番最適化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // 環境変数
  env: {
    // CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

export default nextConfig