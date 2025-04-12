/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 確保可以定位到 public 目錄下的靜態資源
  assetPrefix: '',
  // 允許從外部域名載入圖片
  images: {
    domains: ['vercel.app', 'yagogo.vercel.app'],
    unoptimized: true,
  },
};

module.exports = nextConfig;