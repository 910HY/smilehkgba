import React from 'react';
import { useRoute, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { getArticleBySlug } from '../../lib/article-service';
import ArticlePage from '../../components/ArticlePage';
import { Link } from 'wouter';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';

// 文章內容骨架屏
const ArticlePageSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 py-8">
    <Link href="/articles">
      <Button variant="link" className="text-orange-400 hover:text-orange-500 p-0 mb-8">
        ← 返回文章列表
      </Button>
    </Link>
    
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
const ArticleNotFound = () => (
  <div className="max-w-4xl mx-auto px-4 py-16 text-center">
    <h1 className="text-4xl font-bold text-white mb-4">找不到文章</h1>
    <p className="text-slate-300 mb-8">
      您要查找的文章不存在或已被移除。
    </p>
    <Link href="/articles">
      <Button className="bg-orange-500 hover:bg-orange-600">
        返回文章列表
      </Button>
    </Link>
  </div>
);

const ArticleDetail: React.FC = () => {
  const [match, params] = useRoute<{ slug: string }>('/articles/:slug');
  const slug = match ? params.slug : '';
  const [, navigate] = useLocation();

  // 獲取文章數據
  const { data: article, isLoading, error } = useQuery({
    queryKey: ['/api/articles', slug],
    queryFn: () => getArticleBySlug(slug),
    enabled: !!slug
  });

  // 處理標籤點擊 - 導航到文章列表並設置篩選
  const handleTagClick = (tag: string) => {
    navigate(`/articles?tag=${encodeURIComponent(tag)}`);
  };

  // 如果在加載中
  if (isLoading) {
    return <ArticlePageSkeleton />;
  }

  // 如果文章不存在或發生錯誤
  if (!article || error) {
    return <ArticleNotFound />;
  }

  return (
    <ArticlePage article={article} onTagClick={handleTagClick} />
  );
};

export default ArticleDetail;