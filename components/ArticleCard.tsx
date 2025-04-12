import React from 'react';
import Link from 'next/link';
import { Article } from '../types/article';
import ArticleTag from './ArticleTag';
import { Button } from './ui/button';
import { formatDate } from '../lib/utils';

interface ArticleCardProps {
  article: Article;
  onTagClick?: (tag: string) => void;
  isPromotion?: boolean; // 新增屬性，用來標識是否為優惠文章
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onTagClick, isPromotion = false }) => {
  const { title, slug, summary, tags, publishedAt } = article;
  
  // 處理標籤點擊
  const handleTagClick = (tag: string, e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault(); // 防止導航到文章詳情頁
    if (onTagClick) {
      onTagClick(tag);
    }
  };
  
  // 根據類型確定文章的URL路徑
  const articlePath = isPromotion ? `/promotions/${slug}` : `/articles/${slug}`;
  
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 flex flex-col h-full">
      <div className="flex-grow">
        {/* 文章類型標記 */}
        {isPromotion && (
          <div className="bg-orange-600 text-white text-xs font-bold py-1 px-2 rounded mb-2 inline-block">
            優惠
          </div>
        )}
        
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-slate-400 mb-4">
          {formatDate(publishedAt)}
        </p>
        <p className="text-slate-300 mb-4 line-clamp-3">
          {summary}
        </p>
        
        {/* 文章標籤 */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map(tag => (
              <ArticleTag 
                key={tag} 
                tag={tag} 
                onClick={onTagClick ? (e: React.MouseEvent<HTMLSpanElement>) => handleTagClick(tag, e) : undefined}
              />
            ))}
          </div>
        )}
      </div>
      
      <Button 
        variant="outline" 
        className="w-full border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
        asChild
      >
        <Link href={articlePath} className="w-full">
          {isPromotion ? '查看優惠' : '閱讀全文'}
        </Link>
      </Button>
    </div>
  );
};

export default ArticleCard;