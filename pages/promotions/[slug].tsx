import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { getPromotionBySlug } from '../../lib/promotion-service';

// 動態導入優惠詳情組件，關閉 SSR
const PromotionDetailPage = dynamic(() => import('../../components/PromotionDetailPage'), { ssr: false });

export default function PromotionPage() {
  const router = useRouter();
  const { slug } = router.query;

  // 獲取優惠數據用於SEO元標籤
  const { data: promotion } = useQuery({
    queryKey: ['/api/promotions', slug],
    queryFn: () => getPromotionBySlug(slug as string),
    enabled: !!slug
  });

  return (
    <>
      <Head>
        <title>{promotion ? `${promotion.title} | 牙GoGo` : '牙科優惠 | 牙GoGo｜香港牙科資訊搜尋平台'}</title>
        <meta 
          name="description" 
          content={promotion ? promotion.summary : '牙GoGo提供各種牙科優惠資訊，包括洗牙優惠、牙科診所折扣和特別推廣活動'} 
        />
        <meta 
          property="og:title" 
          content={promotion ? `${promotion.title} | 牙GoGo` : '牙科優惠 | 牙GoGo｜香港牙科資訊搜尋平台'} 
        />
        <meta 
          property="og:description" 
          content={promotion ? promotion.summary : '牙GoGo提供各種牙科優惠資訊，包括洗牙優惠、牙科診所折扣和特別推廣活動'} 
        />
        <meta property="og:image" content="/og-image.png" />
      </Head>
      {slug && <PromotionDetailPage />}
    </>
  );
}