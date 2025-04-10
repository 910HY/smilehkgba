import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllArticles } from '../../lib/article-service';
import ArticleCard from '../../components/ArticleCard';
import ArticleTag from '../../components/ArticleTag';
import { Button } from '../../components/ui/button';
import { Article } from '../../types/article';
import { Skeleton } from '../../components/ui/skeleton';
import { Link } from 'wouter';

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

const ArticlesPage: React.FC = () => {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  
  // 獲取所有文章
  const { data: articles, isLoading, error } = useQuery({
    queryKey: ['/api/articles'],
    queryFn: getAllArticles
  });
  
  // 根據標籤篩選文章
  const filteredArticles = activeTag
    ? articles?.filter(article => article.tags.includes(activeTag)) 
    : articles || [];
  
  // 從所有文章中提取並去重標籤
  useEffect(() => {
    if (articles && articles.length > 0) {
      const tags = Array.from(
        new Set(articles.flatMap(article => article.tags))
      ).sort();
      setAllTags(tags);
    }
  }, [articles]);

  // 處理標籤點擊
  const handleTagClick = (tag: string) => {
    setActiveTag(tag === activeTag ? null : tag);
  };

  // 清除所有篩選
  const clearFilters = () => {
    setActiveTag(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/">
          <Button variant="link" className="text-orange-400 hover:text-orange-500 p-0 mb-4">
            ← 返回首頁
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">牙齒健康文章</h1>
        <p className="text-slate-300">
          探索關於牙齒護理、口腔健康和牙醫治療的專業內容
        </p>
      </div>
      
      {/* 標籤過濾器 */}
      {allTags.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-300 mr-2">按標籤篩選：</span>
            {allTags.map(tag => (
              <ArticleTag 
                key={tag}
                tag={tag}
                onClick={() => handleTagClick(tag)}
                isActive={activeTag === tag}
              />
            ))}
            {activeTag && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-slate-400 hover:text-white ml-2"
              >
                清除篩選
              </Button>
            )}
          </div>
        </div>
      )}
      
      {/* 錯誤提示 */}
      {error && (
        <div className="text-red-500 mb-8 p-4 bg-red-900/30 rounded-lg">
          加載文章時出錯。請稍後再試。
        </div>
      )}
      
      {/* 文章列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // 加載中的骨架屏
          Array.from({ length: 6 }).map((_, index) => (
            <ArticleCardSkeleton key={index} />
          ))
        ) : filteredArticles.length > 0 ? (
          // 文章列表
          filteredArticles.map(article => (
            <ArticleCard 
              key={article.slug} 
              article={article} 
              onTagClick={handleTagClick} 
            />
          ))
        ) : (
          // 無結果
          <div className="col-span-full text-center py-12">
            <p className="text-slate-300 text-lg mb-4">
              {activeTag ? `沒有符合標籤「${activeTag}」的文章` : '暫無文章'}
            </p>
            {activeTag && (
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
              >
                查看所有文章
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;