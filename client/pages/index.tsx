import Head from 'next/head';
import dynamic from 'next/dynamic';

// 動態導入 App 組件，關閉 SSR
const App = dynamic(() => import('../src/App'), { ssr: false });

export default function Home() {
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
      <App />
    </>
  );
}