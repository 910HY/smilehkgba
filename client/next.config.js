/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 確保可以定位到 public 目錄下的靜態資源
  assetPrefix: '',
  // 允許從外部域名載入圖片
  images: {
    domains: ['vercel.app', 'yagogo.vercel.app'],
    unoptimized: true,
  },
  // 忽略開發環境下的跨域警告
  experimental: {
    // Next.js 15 新版本的跨域配置待稍後研究
  },
};

module.exports = nextConfig;