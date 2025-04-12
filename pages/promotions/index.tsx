import { useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// 動態導入 PromotionIndex 組件，關閉 SSR
const PromotionIndex = dynamic(() => import('../../src/pages/promotions/index'), { ssr: false });

export default function PromotionsPage() {
  return (
    <>
      <Head>
        <title>牙科優惠資訊 | 牙GoGo｜香港牙科資訊搜尋平台</title>
        <meta name="description" content="牙GoGo提供各種牙科優惠資訊，包括洗牙優惠、牙科診所折扣和特別推廣活動" />
        <meta property="og:title" content="牙科優惠資訊 | 牙GoGo｜香港牙科資訊搜尋平台" />
        <meta property="og:description" content="牙GoGo提供各種牙科優惠資訊，包括洗牙優惠、牙科診所折扣和特別推廣活動" />
        <meta property="og:image" content="/og-image.png" />
      </Head>
      <PromotionIndex />
    </>
  );
}