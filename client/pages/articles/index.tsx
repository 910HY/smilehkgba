import React, { useState, useEffect } from 'react';
import { useLocation, useSearch } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import ArticleCard from '../../src/components/ArticleCard';
import { getAllArticles, getArticlesByTag } from '../../src/lib/article-service';
import { Button } from '../../src/components/ui/button';
import { Skeleton } from '../../src/components/ui/skeleton';

// 文章骨架
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

export default function ArticlesPage() {
  // 獲取當前URL的參數
  const search = useSearch();
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(search);
  const tagParam = params.get('tag');

  // 當前選擇的標籤
  const [activeTag, setActiveTag] = useState<string | null>(tagParam);

  // 所有可能的文章標籤
  const [allTags, setAllTags] = useState<string[]>([]);

  // 從服務器獲取文章數據
  const { data: articles, isLoading, error, refetch } = useQuery({
    queryKey: ['articles', activeTag],
    queryFn: () => activeTag ? getArticlesByTag(activeTag) : getAllArticles(),
  });

  // 根據標籤重新獲取數據
  useEffect(() => {
    refetch();
  }, [activeTag, refetch]);

  // 從文章中提取所有唯一標籤
  useEffect(() => {
    if (articles && articles.length > 0) {
      const tags = articles.flatMap(article => article.tags);
      const uniqueTags = Array.from(new Set(tags));
      setAllTags(uniqueTags);
    }
  }, [articles]);

  // 處理標籤點擊
  const handleTagClick = (tag: string) => {
    if (tag === activeTag) {
      // 如果點擊的標籤已經是激活的，則清除過濾
      setActiveTag(null);
      setLocation('/articles');
    } else {
      // 否則激活新標籤
      setActiveTag(tag);
      setLocation(`/articles?tag=${encodeURIComponent(tag)}`);
    }
  };

  // 清除所有標籤過濾器
  const clearFilters = () => {
    setActiveTag(null);
    setLocation('/articles');
  };

  // 渲染標籤列表
  const renderTags = () => {
    if (!allTags || allTags.length === 0) return null;

    return (
      <div className="mb-8">
        <h3 className="text-white text-lg font-semibold mb-3">文章標籤</h3>
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <Button
              key={tag}
              variant={tag === activeTag ? "secondary" : "outline"}
              size="sm"
              onClick={() => handleTagClick(tag)}
              className={tag === activeTag ? "bg-orange-700 text-white border-orange-600" : "text-gray-300 border-gray-700"}
            >
              {tag}
            </Button>
          ))}
          {activeTag && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-400 hover:text-white"
            >
              清除過濾
            </Button>
          )}
        </div>
      </div>
    );
  };

  // 渲染文章列表
  const renderArticles = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-900/30 border border-red-800 p-4 rounded-md text-white">
          <h3 className="font-bold text-lg mb-2">加載文章時出錯</h3>
          <p>{(error as Error).message || '無法從服務器獲取文章。請稍後再試。'}</p>
        </div>
      );
    }

    if (!articles || articles.length === 0) {
      return (
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-md text-center">
          <h3 className="font-bold text-xl text-orange-500 mb-2">暫無文章</h3>
          <p className="text-gray-400">目前沒有任何相關文章。請稍後再查看或清除過濾條件。</p>
          {activeTag && (
            <Button 
              variant="outline"
              className="mt-4 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
              onClick={clearFilters}
            >
              查看所有文章
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <ArticleCard 
            key={article.slug} 
            article={article} 
            onTagClick={handleTagClick}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-black min-h-screen text-gray-200">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-orange-500 mb-2">牙齒健康文章</h1>
          <p className="text-gray-400">了解最新的牙齒健康資訊，保持口腔衛生的最佳方式</p>
        </div>
        
        {renderTags()}
        {renderArticles()}
      </main>
      
      <Footer />
    </div>
  );
}