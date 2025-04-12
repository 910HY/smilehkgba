import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Promotion {
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  publishedAt: string;
}

interface LatestPromotionsProps {
  limit?: number;
}

export default function LatestPromotions({ limit = 3 }: LatestPromotionsProps) {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      console.log('正在直接從API獲取最新' + limit + '篇優惠文章...');
      try {
        // 直接從API獲取所有優惠
        console.log('API請求: GET /api/promotions');
        const response = await fetch('/api/promotions');
        
        console.log('API回應: /api/promotions, 狀態:', response.status);
        
        if (!response.ok) {
          throw new Error('無法獲取優惠數據');
        }
        
        const allPromotions = await response.json();
        console.log('原始優惠API數據:', allPromotions.length, '篇優惠文章');
        
        // 根據發佈日期排序，取最新的 limit 篇
        const sortedPromotions = [...allPromotions].sort(
          (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        ).slice(0, limit);
        
        console.log('篩選後獲取到' + sortedPromotions.length + '篇最新優惠文章');
        if (sortedPromotions.length > 0) {
          console.log('第一篇優惠文章標題:', JSON.stringify(sortedPromotions[0].title));
        }
        
        setPromotions(sortedPromotions);
        setIsLoading(false);
      } catch (err) {
        console.error('獲取優惠時出錯:', err);
        setError('無法加載最新優惠，請稍後再試');
        setIsLoading(false);
      }
    };

    fetchPromotions();
  }, [limit]);

  // 如果沒有優惠，則不顯示此部分
  if (!isLoading && (promotions.length === 0 || error)) {
    return null;
  }

  return (
    <div className="my-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#ffaa40]">牙科優惠</h2>
        <Link href="/promotions" legacyBehavior>
          <a className="text-sm text-[#ffbb66] hover:text-[#ffaa40] transition-colors">
            查看全部 &rarr;
          </a>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-800 rounded-lg overflow-hidden h-64"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promotion) => (
            <Link key={promotion.slug} href={`/promotions/${promotion.slug}`} legacyBehavior>
              <a className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 block h-full">
                <div className="p-5 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-[#ffaa40] line-clamp-2">
                      {promotion.title}
                    </h3>
                    <span className="bg-[#ff7a00] text-white text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2">
                      優惠
                    </span>
                  </div>
                  
                  <p className="text-gray-300 mb-4 text-sm line-clamp-3">
                    {promotion.summary}
                  </p>
                  
                  <div className="mt-auto flex justify-between items-end">
                    <div className="flex flex-wrap gap-1">
                      {promotion.tags && promotion.tags.slice(0, 2).map(tag => (
                        <span 
                          key={tag} 
                          className="inline-block bg-gray-700 text-xs text-gray-300 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {promotion.tags && promotion.tags.length > 2 && (
                        <span className="text-gray-400 text-xs">+{promotion.tags.length - 2}</span>
                      )}
                    </div>
                    
                    <time className="text-xs text-gray-400">
                      {new Date(promotion.publishedAt).toLocaleDateString('zh-HK')}
                    </time>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}