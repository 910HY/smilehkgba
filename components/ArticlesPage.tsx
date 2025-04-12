import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { getAllArticles, getArticlesByTag } from '../lib/article-service';
import ArticleCard from './ArticleCard';
import ArticleTag from './ArticleTag';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import Link from 'next/link';
import Header from './Header';

// 加載中的卡片骨架屏
const ArticleCardSkeleton = () => (
  <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
    <Skeleton className="h-7 w-3/4 mb-2 bg-slate-700" />
    <Skeleton className="h-4 w-1/4 mb-6 bg-slate-700" />
    <Skeleton className="h-4 w-full mb-2 bg-slate-700" />
    <Skeleton className="h-4 w-full mb-2 bg-slate-700" />
    <Skeleton className="h-4 w-2/3 mb-6 bg-slate-700" />
    <div className="flex gap-2 mb-4">
      <Skeleton className="h-6 w-16 bg-slate-700" />
      <Skeleton className="h-6 w-16 bg-slate-700" />
    </div>
    <Skeleton className="h-9 w-24 bg-slate-700" />
  </div>
);

// 預設熱門標籤
const popularTags = [
  '口腔護理', '牙齒保健', '蛀牙', '牙周病', 
  '矯正', '植牙', '洗牙', '兒童牙科', '牙痛'
];

const ArticlesPage: React.FC = () => {
  const router = useRouter();
  const { tag: urlTag, page: urlPage } = router.query;
  
  // 狀態管理
  const [activeTag, setActiveTag] = useState<string | null>(
    typeof urlTag === 'string' ? urlTag : null
  );
  const [currentPage, setCurrentPage] = useState(
    typeof urlPage === 'string' ? parseInt(urlPage) : 1
  );
  const articlesPerPage = 9;  // 每頁顯示9篇文章
  
  // 搜索框
  const [searchTerm, setSearchTerm] = useState('');
  
  // 根據是否有標籤篩選來選擇不同的請求
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/articles', activeTag],
    queryFn: () => activeTag ? getArticlesByTag(activeTag) : getAllArticles(),
    retry: 3
  });
  
  // 當URL參數變化時更新狀態
  useEffect(() => {
    if (typeof urlTag === 'string') {
      setActiveTag(urlTag);
    }
    
    if (typeof urlPage === 'string') {
      setCurrentPage(parseInt(urlPage));
    } else {
      setCurrentPage(1);
    }
  }, [urlTag, urlPage]);
  
  // 點擊標籤時的處理
  const handleTagClick = (tag: string) => {
    if (tag === activeTag) {
      // 如果點擊當前活躍的標籤，則取消篩選
      setActiveTag(null);
      router.push('/articles', undefined, { shallow: true });
    } else {
      // 否則設置新的篩選標籤
      setActiveTag(tag);
      router.push(`/articles?tag=${encodeURIComponent(tag)}`, undefined, { shallow: true });
    }
    setCurrentPage(1);  // 重置頁碼
  };
  
  // 搜索處理
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 這裡簡單實現，只是使用 URL 參數進行搜索
    if (searchTerm.trim()) {
      router.push(`/articles?search=${encodeURIComponent(searchTerm.trim())}`, undefined, { shallow: true });
    }
  };
  
  // 分頁處理
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const queryParams = new URLSearchParams();
    if (activeTag) queryParams.set('tag', activeTag);
    queryParams.set('page', pageNumber.toString());
    
    router.push(`/articles?${queryParams.toString()}`, undefined, { shallow: true });
  };
  
  // 計算總頁數
  const totalPages = data ? Math.ceil(data.length / articlesPerPage) : 0;
  
  // 獲取當前頁的文章
  const currentArticles = data ? data.slice(
    (currentPage - 1) * articlesPerPage, 
    currentPage * articlesPerPage
  ) : [];
  
  // 簡單搜索過濾（如果有搜索詞）
  const filteredArticles = currentArticles.filter(article => {
    if (!router.query.search) return true;
    const searchTermLower = (router.query.search as string).toLowerCase();
    
    return (
      article.title.toLowerCase().includes(searchTermLower) ||
      article.summary.toLowerCase().includes(searchTermLower) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
    );
  });
  
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-white mb-8">牙齒健康資訊</h1>
          
          {/* 標籤列表 - 加載中 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">熱門標籤</h2>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-24 bg-slate-700 rounded-full" />
              ))}
            </div>
          </div>
          
          {/* 文章列表 - 加載中 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, index) => (
              <ArticleCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </>
    );
  }
  
  if (error) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-white mb-8">牙齒健康資訊</h1>
          <div className="bg-red-900 p-6 rounded-lg text-white">
            <h2 className="text-xl font-bold mb-2">載入文章時發生錯誤</h2>
            <p>抱歉，無法載入文章內容。請稍後再試。</p>
            <Button 
              className="mt-4 bg-white text-red-900 hover:bg-slate-200"
              onClick={() => window.location.reload()}
            >
              重新整理頁面
            </Button>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">牙齒健康資訊</h1>
      
      {/* 搜索框 */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="搜尋文章..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <Button 
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            搜尋
          </Button>
        </div>
      </form>
      
      {/* 標籤列表 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">熱門標籤</h2>
        <div className="flex flex-wrap gap-2">
          {popularTags.map(tag => (
            <ArticleTag 
              key={tag} 
              tag={tag} 
              onClick={() => handleTagClick(tag)}
              isActive={tag === activeTag}
            />
          ))}
        </div>
      </div>
      
      {/* 篩選結果提示 */}
      {activeTag && (
        <div className="bg-slate-800 p-4 rounded-lg mb-8 flex justify-between items-center">
          <p className="text-white">
            顯示標籤「<span className="text-orange-400 font-semibold">{activeTag}</span>」的相關文章
          </p>
          <Button 
            variant="outline" 
            className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
            onClick={() => handleTagClick(activeTag)}
          >
            清除篩選
          </Button>
        </div>
      )}
      
      {/* 文章列表 */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredArticles.map(article => (
            <ArticleCard 
              key={article.slug} 
              article={article}
              onTagClick={handleTagClick}
            />
          ))}
        </div>
      ) : (
        <div className="bg-slate-800 p-6 rounded-lg text-center mb-8">
          <h2 className="text-xl font-semibold text-white mb-2">找不到相關文章</h2>
          <p className="text-slate-400 mb-4">
            {activeTag 
              ? `沒有與標籤「${activeTag}」相關的文章。` 
              : router.query.search 
                ? `沒有與「${router.query.search}」相關的搜尋結果。`
                : '目前沒有任何文章。'}
          </p>
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => {
              setActiveTag(null);
              router.push('/articles');
            }}
          >
            查看所有文章
          </Button>
        </div>
      )}
      
      {/* 分頁 */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex rounded-md">
            <Button
              variant="outline"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="mr-1 border-slate-700 text-slate-300 hover:bg-slate-700"
            >
              上一頁
            </Button>
            
            {/* 簡化的分頁顯示，只顯示當前頁和附近的頁碼 */}
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              // 只顯示当前頁、第一頁、最後一頁，以及它們附近的頁碼
              if (
                pageNumber === 1 || 
                pageNumber === totalPages || 
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={pageNumber}
                    variant={pageNumber === currentPage ? "default" : "outline"}
                    onClick={() => paginate(pageNumber)}
                    className={`mx-1 ${
                      pageNumber === currentPage 
                        ? "bg-orange-500 hover:bg-orange-600" 
                        : "border-slate-700 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {pageNumber}
                  </Button>
                );
              }
              
              // 添加省略號
              if (
                (pageNumber === currentPage - 2 && pageNumber > 2) || 
                (pageNumber === currentPage + 2 && pageNumber < totalPages - 1)
              ) {
                return <span key={pageNumber} className="mx-1 flex items-center text-slate-500">...</span>;
              }
              
              return null;
            })}
            
            <Button
              variant="outline"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-1 border-slate-700 text-slate-300 hover:bg-slate-700"
            >
              下一頁
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesPage;