import { useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// 動態導入 ArticleIndex 組件，關閉 SSR
const ArticleIndex = dynamic(() => import('../../src/pages/articles/index'), { ssr: false });

export default function ArticlesPage() {
  return (
    <>
      <Head>
        <title>牙科健康資訊 | 牙GoGo｜香港牙科資訊搜尋平台</title>
        <meta name="description" content="牙GoGo提供各種牙科健康資訊，了解口腔護理常識、牙齒保健方法和牙科治療資訊" />
        <meta property="og:title" content="牙科健康資訊 | 牙GoGo｜香港牙科資訊搜尋平台" />
        <meta property="og:description" content="牙GoGo提供各種牙科健康資訊，了解口腔護理常識、牙齒保健方法和牙科治療資訊" />
        <meta property="og:image" content="/og-image.png" />
      </Head>
      <ArticleIndex />
    </>
  );
}