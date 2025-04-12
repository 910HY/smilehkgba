import { useQuery } from '@tanstack/react-query';
import { getLatestPromotions } from '../lib/promotion-service';
import ArticleCard from './ArticleCard';
import { Button } from './ui/button';
import Link from 'next/link';
import { Skeleton } from './ui/skeleton';

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

interface LatestPromotionsProps {
  limit?: number;
}

const LatestPromotions = ({ limit = 3 }: LatestPromotionsProps) => {
  // 獲取最新優惠文章
  const { data: promotions, isLoading, error } = useQuery({
    queryKey: ['/api/promotions', limit],
    queryFn: () => getLatestPromotions(limit),
    retry: 3,  // 失敗時嘗試重新請求3次
    refetchOnMount: true,  // 組件掛載時重新獲取
    staleTime: 60000  // 1分鐘內不會重新請求
  });

  // 如果正在加載或出錯，顯示對應的狀態
  if (isLoading) {
    return (
      <div className="py-12 bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8">最新牙科優惠</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: limit }).map((_, index) => (
              <ArticleCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 如果發生錯誤，顯示錯誤信息
  if (error) {
    console.error('優惠文章加載錯誤:', error);
    return (
      <div className="py-12 bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8">最新牙科優惠</h2>
          <div className="bg-red-900 p-4 rounded text-white mb-6">
            <p>加載優惠文章時出錯。請稍後再試。</p>
          </div>
        </div>
      </div>
    );
  }
  
  // 如果沒有優惠文章，顯示提示信息
  if (!promotions || promotions.length === 0) {
    console.log('優惠文章列表為空');
    return (
      <div className="py-12 bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8">最新牙科優惠</h2>
          <div className="bg-yellow-900 p-4 rounded text-white mb-6">
            <p>目前沒有可用的優惠文章。</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">最新牙科優惠</h2>
          <Link href="/promotions">
            <Button 
              variant="outline" 
              className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
            >
              查看全部優惠
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map(promotion => (
            <ArticleCard 
              key={promotion.slug} 
              article={promotion}
              isPromotion={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestPromotions;