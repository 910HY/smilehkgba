import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { getArticleBySlug } from '../../lib/article-service';
import Header from '@components/Header';
import Footer from '@components/Footer';
import LatestArticles from '@components/LatestArticles';

// 動態導入文章詳情組件，關閉 SSR
const ArticleDetailPage = dynamic(() => import('@components/ArticleDetailPage'), { ssr: false });

export default function ArticlePage() {
  const router = useRouter();
  const { slug } = router.query;
  
  // 獲取文章數據用於SEO元標籤
  const { data: article } = useQuery({
    queryKey: ['/api/articles', slug],
    queryFn: () => getArticleBySlug(slug as string),
    enabled: !!slug
  });

  return (
    <>
      <Head>
        <title>{article ? `${article.title} | 牙GoGo` : '牙科文章 | 牙GoGo｜香港牙科資訊搜尋平台'}</title>
        <meta 
          name="description" 
          content={article ? article.summary : '牙GoGo提供各種牙科健康資訊，了解口腔護理常識和牙科治療資訊'} 
        />
        <meta 
          property="og:title" 
          content={article ? `${article.title} | 牙GoGo` : '牙科文章 | 牙GoGo｜香港牙科資訊搜尋平台'} 
        />
        <meta 
          property="og:description" 
          content={article ? article.summary : '牙GoGo提供各種牙科健康資訊，了解口腔護理常識和牙科治療資訊'} 
        />
        <meta property="og:image" content="/og-image.png" />
      </Head>
      <Header />
      <main>
        {slug && <ArticleDetailPage />}
        <LatestArticles limit={3} />
      </main>
      <Footer />
    </>
  );
}