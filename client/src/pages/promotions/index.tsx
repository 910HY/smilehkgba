import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllPromotions } from '../../lib/promotion-service';
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

const PromotionsPage: React.FC = () => {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  
  // 獲取所有優惠文章
  const { data: promotions, isLoading, error } = useQuery({
    queryKey: ['/api/promotions'],
    queryFn: getAllPromotions
  });
  
  // 根據標籤篩選優惠文章
  const filteredPromotions = activeTag && promotions
    ? promotions.filter(promotion => promotion.tags.includes(activeTag)) 
    : promotions || [];
  
  // 從所有優惠文章中提取並去重標籤
  useEffect(() => {
    if (promotions && promotions.length > 0) {
      const tags = Array.from(
        new Set(promotions.flatMap(promotion => promotion.tags))
      ).sort();
      setAllTags(tags);
    }
  }, [promotions]);

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
        <h1 className="text-3xl font-bold text-white mb-2">優惠牙</h1>
        <p className="text-slate-300">
          最新牙科診所優惠、特價套餐及限時折扣
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
          加載優惠文章時出錯。請稍後再試。
        </div>
      )}
      
      {/* 優惠文章列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // 加載中的骨架屏
          Array.from({ length: 6 }).map((_, index) => (
            <ArticleCardSkeleton key={index} />
          ))
        ) : filteredPromotions && filteredPromotions.length > 0 ? (
          // 優惠文章列表
          filteredPromotions.map(promotion => (
            <ArticleCard 
              key={promotion.slug} 
              article={promotion} 
              onTagClick={handleTagClick} 
            />
          ))
        ) : (
          // 無結果
          <div className="col-span-full text-center py-12">
            <p className="text-slate-300 text-lg mb-4">
              {activeTag ? `沒有符合標籤「${activeTag}」的優惠文章` : '暫無優惠文章'}
            </p>
            {activeTag && (
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
              >
                查看所有優惠文章
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionsPage;