import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { getPromotionBySlug } from '../lib/promotion-service';
import ArticlePage from './ArticlePage';
import Link from 'next/link';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

// 文章內容骨架屏
const PromotionPageSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 py-8">
    <Button variant="link" className="text-orange-400 hover:text-orange-500 p-0 mb-8" asChild>
      <Link href="/promotions">← 返回優惠列表</Link>
    </Button>
    
    <Skeleton className="h-10 w-3/4 mb-4 bg-slate-700" />
    <div className="flex gap-4 mb-8">
      <Skeleton className="h-6 w-36 bg-slate-700" />
      <Skeleton className="h-6 w-20 bg-slate-700" />
      <Skeleton className="h-6 w-20 bg-slate-700" />
    </div>
    
    <div className="space-y-4 mb-12">
      <Skeleton className="h-4 w-full bg-slate-700" />
      <Skeleton className="h-4 w-full bg-slate-700" />
      <Skeleton className="h-4 w-full bg-slate-700" />
      <Skeleton className="h-4 w-3/4 bg-slate-700" />
      <Skeleton className="h-6 w-1/2 bg-slate-700 mt-8" />
      <Skeleton className="h-4 w-full bg-slate-700" />
      <Skeleton className="h-4 w-full bg-slate-700" />
      <Skeleton className="h-4 w-2/3 bg-slate-700" />
    </div>
  </div>
);

// 404頁面
const PromotionNotFound = () => (
  <div className="max-w-4xl mx-auto px-4 py-16 text-center">
    <h1 className="text-4xl font-bold text-white mb-4">找不到優惠</h1>
    <p className="text-slate-300 mb-8">
      您要查找的優惠不存在或已被移除。
    </p>
    <Button className="bg-orange-500 hover:bg-orange-600" asChild>
      <Link href="/promotions">返回優惠列表</Link>
    </Button>
  </div>
);

const PromotionDetailPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  
  // 獲取優惠數據
  const { data: promotion, isLoading, error } = useQuery({
    queryKey: ['/api/promotions', slug],
    queryFn: () => getPromotionBySlug(slug as string),
    enabled: !!slug,
    retry: 3
  });

  // 處理標籤點擊 - 導航到優惠列表並設置篩選
  const handleTagClick = (tag: string) => {
    router.push(`/promotions?tag=${encodeURIComponent(tag)}`);
  };

  // 如果在加載中
  if (isLoading) {
    return <PromotionPageSkeleton />;
  }

  // 如果優惠不存在或發生錯誤
  if (!promotion || error) {
    console.error('優惠加載錯誤:', error || '優惠不存在');
    return <PromotionNotFound />;
  }

  return (
    <ArticlePage 
      article={promotion} 
      onTagClick={handleTagClick}
    />
  );
};

export default PromotionDetailPage;