import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="zh-HK">
      <Head>
        {/* 網站基本中繼標籤 */}
        <meta charSet="utf-8" />
        <meta name="robots" content="index, follow" />
        <meta name="description" content="牙GoGo是香港牙科資訊平台，提供診所資料、洗牙價錢、牙醫推介等實用資訊" />

        {/* 網站Icon */}
        <link rel="icon" href="/favicon.ico" />
        
        {/* Google 網站驗證 */}
        <meta name="google-site-verification" content="ZC85H1YYY9_Zcgw7Mf44k9FpDQEZS7yGD-UdzOUUZV0" />

        {/* 網站圖片預覽配置 */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="牙GoGo｜香港牙科資訊搜尋平台" />
        <meta property="og:description" content="牙GoGo是香港牙科資訊平台，提供診所資料、洗牙價錢、牙醫推介等實用資訊" />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:url" content="https://yagogo.vercel.app" />
        <meta property="og:site_name" content="牙GoGo" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}