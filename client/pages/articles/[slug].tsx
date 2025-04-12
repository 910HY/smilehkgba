import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// 動態導入 ArticleDetail 組件，關閉 SSR
const ArticleDetail = dynamic(() => import('../../src/pages/articles/[slug]'), { ssr: false });

export default function ArticleDetailPage() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <>
      <Head>
        <title>牙科文章 | 牙GoGo｜香港牙科資訊搜尋平台</title>
        <meta name="description" content="牙GoGo提供各種牙科健康資訊，了解口腔護理常識和牙科治療資訊" />
        <meta property="og:title" content="牙科文章 | 牙GoGo｜香港牙科資訊搜尋平台" />
        <meta property="og:description" content="牙GoGo提供各種牙科健康資訊，了解口腔護理常識和牙科治療資訊" />
        <meta property="og:image" content="/og-image.png" />
      </Head>
      {slug && <ArticleDetail />}
    </>
  );
}