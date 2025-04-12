import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();

  // 將使用者重定向到原有的 Vite 應用首頁
  useEffect(() => {
    window.location.href = '/src';
  }, []);

  return (
    <>
      <Head>
        <title>牙GoGo｜香港牙科資訊搜尋平台</title>
        <meta name="description" content="牙GoGo是香港牙科資訊平台，提供診所資料、洗牙價錢、牙醫推介等實用資訊" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="牙GoGo｜香港牙科資訊搜尋平台" />
        <meta property="og:description" content="牙GoGo是香港牙科資訊平台，提供診所資料、洗牙價錢、牙醫推介等實用資訊" />
        <meta property="og:image" content="/og-image.png" />
      </Head>
      <main>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">牙GoGo</h1>
          <p className="mt-3">正在載入中，請稍候...</p>
        </div>
      </main>
    </>
  );
}