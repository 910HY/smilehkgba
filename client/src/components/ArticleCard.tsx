import React from 'react';
import { Link } from 'wouter';
import { Article } from '../types/article';
import ArticleTag from './ArticleTag';
import { Button } from './ui/button';
import { formatDate } from '../lib/utils';

interface ArticleCardProps {
  article: Article;
  onTagClick?: (tag: string) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onTagClick }) => {
  const { title, slug, summary, tags, publishedAt } = article;
  
  // 處理標籤點擊
  const handleTagClick = (tag: string, e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault(); // 防止導航到文章詳情頁
    if (onTagClick) {
      onTagClick(tag);
    }
  };
  
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 flex flex-col h-full">
      <div className="flex-grow">
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
      
      <Link href={`/articles/${slug}`}>
        <Button 
          variant="outline" 
          className="w-full border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
        >
          閱讀全文
        </Button>
      </Link>
    </div>
  );
};

export default ArticleCard;