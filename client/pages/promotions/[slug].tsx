import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import { GetStaticProps, GetStaticPaths } from 'next';
import Header from '@components/Header';
import Footer from '@components/Footer';

interface Article {
  title: string;
  content: string;
  tags?: string[];
  publishedAt?: string;
  summary?: string;
  sources?: Array<{title: string, url: string}>;
}

export default function PromotionDetailPage({ promotion }: { promotion: Article }) {
  return (
    <>
      <Head>
        <title>{promotion.title} | 牙GoGo｜香港牙科資訊搜尋平台</title>
        <meta name="description" content={promotion.summary || "牙GoGo提供各種牙科優惠資訊，包括洗牙優惠、牙科診所折扣和特別推廣活動"} />
        <meta property="og:title" content={`${promotion.title} | 牙GoGo｜香港牙科資訊搜尋平台`} />
        <meta property="og:description" content={promotion.summary || "牙GoGo提供各種牙科優惠資訊，包括洗牙優惠、牙科診所折扣和特別推廣活動"} />
        <meta property="og:image" content="/og-image.png" />
      </Head>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow max-w-3xl mx-auto px-4 py-8">
          <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-md p-4 mb-8">
            <p className="text-yellow-400 font-medium">⚠️ 優惠提示</p>
            <p className="text-yellow-200/80 text-sm mt-1">優惠資訊或有變更，請向牙科診所查詢最新優惠詳情。</p>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{promotion.title}</h1>
          <p className="text-sm text-gray-500 mb-6">更新時間：{promotion.publishedAt}</p>
          
          {promotion.tags && promotion.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {promotion.tags.map(tag => (
                <span key={tag} className="bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: promotion.content }} />
          
          {promotion.sources && promotion.sources.length > 0 && (
            <div className="mt-12 border-t border-gray-700 pt-4">
              <h3 className="text-xl font-semibold mb-2">優惠來源</h3>
              <ul className="list-disc list-inside space-y-1">
                {promotion.sources.map((source, index) => (
                  <li key={index}>
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">
                      {source.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const promotionsDir = path.join(process.cwd(), 'content', 'promotions');
  
  try {
    const files = fs.readdirSync(promotionsDir);
    
    const paths = files
      .filter(file => file.endsWith('.json'))
      .map(file => ({
        params: { slug: file.replace(/\.json$/, '') }
      }));
    
    return {
      paths,
      fallback: false,
    };
  } catch (error) {
    console.error("無法讀取優惠目錄:", error);
    return {
      paths: [],
      fallback: false,
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const promotionPath = path.join(process.cwd(), 'content', 'promotions', `${slug}.json`);
  
  try {
    const fileContents = fs.readFileSync(promotionPath, 'utf-8');
    const promotion = JSON.parse(fileContents);
    
    return {
      props: {
        promotion,
      },
    };
  } catch (error) {
    console.error(`無法讀取優惠文章 ${slug}:`, error);
    return {
      notFound: true,
    };
  }
};