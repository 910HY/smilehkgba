import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import { useState } from 'react';
import { GetStaticProps } from 'next';
import Header from '@components/Header';
import Footer from '@components/Footer';
import Link from 'next/link';

interface Promotion {
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  publishedAt: string;
}

interface PromotionsPageProps {
  promotions: Promotion[];
}

export default function PromotionsPage({ promotions }: PromotionsPageProps) {
  const [filteredPromotions, setFilteredPromotions] = useState(promotions);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // 收集所有標籤
  const allTags = [...new Set(promotions.flatMap(promotion => promotion.tags))];
  
  // 處理標籤點擊
  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
      setFilteredPromotions(promotions);
    } else {
      setSelectedTag(tag);
      setFilteredPromotions(promotions.filter(promotion => promotion.tags.includes(tag)));
    }
  };

  return (
    <>
      <Head>
        <title>牙科優惠資訊 | 牙GoGo｜香港牙科資訊搜尋平台</title>
        <meta name="description" content="牙GoGo提供各種牙科優惠資訊，包括洗牙優惠、牙科診所折扣和特別推廣活動" />
        <meta property="og:title" content="牙科優惠資訊 | 牙GoGo｜香港牙科資訊搜尋平台" />
        <meta property="og:description" content="牙GoGo提供各種牙科優惠資訊，包括洗牙優惠、牙科診所折扣和特別推廣活動" />
        <meta property="og:image" content="/og-image.png" />
      </Head>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-center">最新牙科優惠</h1>
          
          {/* 標籤過濾器 */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedTag === tag 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
          
          {/* 優惠列表 */}
          {filteredPromotions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPromotions.map(promotion => (
                <div key={promotion.slug} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
                  <Link href={`/promotions/${promotion.slug}`} legacyBehavior>
                    <a className="block p-5">
                      <h2 className="text-xl font-semibold mb-2 text-orange-400">{promotion.title}</h2>
                      <p className="text-gray-300 mb-4 line-clamp-3">{promotion.summary}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex flex-wrap gap-1">
                          {promotion.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="bg-gray-700 text-gray-300 px-2 py-1 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                          {promotion.tags.length > 2 && <span className="text-gray-400 text-xs">+{promotion.tags.length - 2}</span>}
                        </div>
                        <time className="text-gray-400 text-sm">
                          {new Date(promotion.publishedAt).toLocaleDateString('zh-HK')}
                        </time>
                      </div>
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl text-gray-400">準備中！我們正在為您搜集最新的牙科優惠，敬請期待！</h3>
              {selectedTag && (
                <button 
                  onClick={() => {
                    setSelectedTag(null);
                    setFilteredPromotions(promotions);
                  }}
                  className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                >
                  顯示所有優惠
                </button>
              )}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const promotionsDir = path.join(process.cwd(), 'content', 'promotions');
  
  try {
    const files = fs.readdirSync(promotionsDir);
    
    const promotions = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const fileContent = fs.readFileSync(path.join(promotionsDir, file), 'utf-8');
        const promotion = JSON.parse(fileContent);
        return promotion;
      })
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    return {
      props: {
        promotions,
      },
    };
  } catch (error) {
    console.error("無法讀取優惠資訊:", error);
    return {
      props: {
        promotions: [],
      },
    };
  }
};