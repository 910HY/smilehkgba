import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Article {
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  publishedAt: string;
}

interface LatestArticlesProps {
  limit?: number;
}

export default function LatestArticles({ limit = 3 }: LatestArticlesProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      console.log('正在直接從API獲取最新' + limit + '篇文章...');
      try {
        // 直接從API獲取所有文章
        console.log('API請求: GET /api/articles');
        const response = await fetch('/api/articles');
        
        console.log('API回應: /api/articles, 狀態:', response.status);
        
        if (!response.ok) {
          throw new Error('無法獲取文章數據');
        }
        
        const allArticles = await response.json();
        console.log('原始API數據:', allArticles.length, '篇文章');
        
        // 根據發佈日期排序，取最新的 limit 篇
        const sortedArticles = [...allArticles].sort(
          (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        ).slice(0, limit);
        
        console.log('篩選後獲取到' + sortedArticles.length + '篇最新文章');
        if (sortedArticles.length > 0) {
          console.log('第一篇文章標題:', JSON.stringify(sortedArticles[0].title));
          console.log('文章詳情:', JSON.stringify(sortedArticles[0], null, 2));
        }
        
        setArticles(sortedArticles);
        setIsLoading(false);
      } catch (err) {
        console.error('獲取文章時出錯:', err);
        setError('無法加載最新文章，請稍後再試');
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [limit]);

  if (isLoading) {
    return (
      <div className="my-16">
        <h2 className="text-2xl font-bold text-[#ffaa40] mb-6">最新牙科資訊</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-800 rounded-lg overflow-hidden h-64"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || articles.length === 0) {
    return (
      <div className="my-16">
        <h2 className="text-2xl font-bold text-[#ffaa40] mb-6">最新牙科資訊</h2>
        <div className="text-center py-10 bg-gray-800 rounded-lg">
          <p className="text-gray-400">{error || '目前沒有文章可顯示'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#ffaa40]">最新牙科資訊</h2>
        <Link href="/articles" legacyBehavior>
          <a className="text-sm text-[#ffbb66] hover:text-[#ffaa40] transition-colors">
            查看全部 &rarr;
          </a>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link key={article.slug} href={`/articles/${article.slug}`} legacyBehavior>
            <a className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 block h-full">
              <div className="p-5 flex flex-col h-full">
                <h3 className="font-bold text-lg text-[#ffaa40] mb-2 line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-gray-300 mb-4 text-sm line-clamp-3">
                  {article.summary}
                </p>
                
                <div className="mt-auto flex justify-between items-end">
                  <div className="flex flex-wrap gap-1">
                    {article.tags.slice(0, 2).map(tag => (
                      <span 
                        key={tag} 
                        className="inline-block bg-gray-700 text-xs text-gray-300 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {article.tags.length > 2 && (
                      <span className="text-gray-400 text-xs">+{article.tags.length - 2}</span>
                    )}
                  </div>
                  
                  <time className="text-xs text-gray-400">
                    {new Date(article.publishedAt).toLocaleDateString('zh-HK')}
                  </time>
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}