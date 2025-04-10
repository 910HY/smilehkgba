import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Button } from '../components/ui/button';

// 一個簡單的純前端測試頁面，用於檢查文章API功能
const TestArticlesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [articles, setArticles] = useState<any[]>([]);
  
  // 獨立的、純前端的API調用
  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        console.log('測試頁面：正在獲取文章...');
        
        const response = await fetch('/api/articles', {
          method: 'GET',
          cache: 'no-cache',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        console.log('測試頁面：獲取文章請求完成，狀態碼：', response.status);
        
        if (!response.ok) {
          throw new Error(`API 錯誤: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('測試頁面：成功獲取文章數據，數量：', data.length);
        setArticles(data);
      } catch (err: any) {
        console.error('測試頁面：獲取文章時出錯', err);
        setError(err.message || '獲取文章時出錯');
      } finally {
        setLoading(false);
      }
    }
    
    fetchArticles();
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8 bg-slate-800 min-h-screen text-white">
      <Link href="/">
        <Button className="mb-4">返回首頁</Button>
      </Link>
      
      <h1 className="text-2xl font-bold mb-6">文章API測試頁面</h1>
      
      <div className="p-4 mb-6 bg-red-700 text-white rounded">
        <h2 className="font-bold mb-2">測試區塊</h2>
        <p>如果您能看到此區塊，則頁面渲染正常。</p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">API測試狀態</h2>
        
        {loading ? (
          <div className="p-4 bg-blue-800 rounded mb-4">
            <p>正在加載文章數據...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-800 rounded mb-4">
            <p className="font-bold">出錯了</p>
            <p>{error}</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="p-4 bg-yellow-700 rounded mb-4">
            <p>API返回了空數據列表。沒有找到任何文章。</p>
          </div>
        ) : (
          <div className="p-4 bg-green-700 rounded mb-4">
            <p>成功獲取到 {articles.length} 篇文章。</p>
          </div>
        )}
      </div>
      
      {!loading && !error && articles.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">文章數據</h2>
          
          <div className="grid grid-cols-1 gap-4">
            {articles.map((article, index) => (
              <div key={index} className="p-4 bg-slate-700 rounded">
                <h3 className="font-bold">{article.title || '無標題'}</h3>
                <p className="text-sm text-slate-300 mb-2">
                  發佈於: {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : '未知日期'}
                </p>
                {article.summary && <p className="mb-2">{article.summary}</p>}
                
                {article.tags && article.tags.length > 0 && (
                  <div className="mb-2">
                    <span className="text-sm text-slate-400">標籤: </span>
                    {article.tags.map((tag: string, tagIndex: number) => (
                      <span 
                        key={tagIndex} 
                        className="inline-block mr-2 px-2 py-1 text-xs bg-slate-600 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="text-sm text-slate-400">
                  Slug: {article.slug || '無slug'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestArticlesPage;