import { useEffect } from 'react';
import Head from 'next/head';
import PromotionsPage from '../../components/PromotionsPage';

export default function PromotionsIndexPage() {
  return (
    <>
      <Head>
        <title>牙科優惠資訊 | 牙GoGo｜香港牙科資訊搜尋平台</title>
        <meta name="description" content="牙GoGo提供各種牙科優惠資訊，包括洗牙優惠、牙科診所折扣和特別推廣活動" />
        <meta property="og:title" content="牙科優惠資訊 | 牙GoGo｜香港牙科資訊搜尋平台" />
        <meta property="og:description" content="牙GoGo提供各種牙科優惠資訊，包括洗牙優惠、牙科診所折扣和特別推廣活動" />
        <meta property="og:image" content="/og-image.png" />
      </Head>
      <PromotionsPage />
    </>
  );
}