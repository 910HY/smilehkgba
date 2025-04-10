import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { getPromotionBySlug } from '../../lib/promotion-service';
import ArticleTag from '../../components/ArticleTag';
import { Button } from '../../components/ui/button';
import { formatDate } from '../../lib/utils';
import { Link } from 'wouter';
import { Skeleton } from '../../components/ui/skeleton';
import ArticlePage from '../../components/ArticlePage';
import NotFound from '../not-found';

// 加載中的骨架屏
const ArticleDetailSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <Link href="/promotions">
      <Button variant="link" className="text-orange-400 hover:text-orange-500 p-0 mb-4">
        ← 返回優惠列表
      </Button>
    </Link>
    
    <Skeleton className="h-10 w-3/4 mb-4 bg-slate-800" />
    <Skeleton className="h-5 w-1/3 mb-8 bg-slate-800" />
    
    <div className="bg-slate-800 rounded-lg p-6 mb-8">
      <Skeleton className="h-6 w-full mb-4 bg-slate-700" />
      <Skeleton className="h-6 w-full mb-4 bg-slate-700" />
      <Skeleton className="h-6 w-3/4 mb-4 bg-slate-700" />
      <Skeleton className="h-6 w-full mb-4 bg-slate-700" />
      <Skeleton className="h-6 w-5/6 mb-4 bg-slate-700" />
      <Skeleton className="h-6 w-full mb-4 bg-slate-700" />
    </div>
    
    <div className="flex flex-wrap gap-2 mb-8">
      <Skeleton className="h-8 w-24 bg-slate-800" />
      <Skeleton className="h-8 w-24 bg-slate-800" />
      <Skeleton className="h-8 w-24 bg-slate-800" />
    </div>
    
    <div className="bg-slate-800 rounded-lg p-6">
      <Skeleton className="h-6 w-1/3 mb-4 bg-slate-700" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-full bg-slate-700" />
        <Skeleton className="h-5 w-full bg-slate-700" />
        <Skeleton className="h-5 w-2/3 bg-slate-700" />
      </div>
    </div>
  </div>
);

const PromotionDetailPage: React.FC = () => {
  // 從URL獲取slug參數
  const [, params] = useRoute('/promotions/:slug');
  const slug = params?.slug;
  
  // 獲取優惠文章詳情
  const { data: promotion, isLoading, error } = useQuery({
    queryKey: ['/api/promotions', slug],
    queryFn: () => getPromotionBySlug(slug || ''),
    enabled: !!slug
  });
  
  // 處理加載中狀態
  if (isLoading) {
    return <ArticleDetailSkeleton />;
  }
  
  // 處理錯誤狀態
  if (error || !promotion) {
    console.error(`優惠文章 ${slug} 獲取錯誤:`, error);
    return <NotFound />;
  }

  // 渲染優惠文章詳情頁面
  return (
    <ArticlePage 
      article={promotion}
      onTagClick={(tag) => {
        // 在當前頁面進行標籤過濾不太合適，所以將用戶引導到優惠文章列表頁
        window.location.href = `/promotions?tag=${encodeURIComponent(tag)}`;
      }}
    />
  );
};

export default PromotionDetailPage;