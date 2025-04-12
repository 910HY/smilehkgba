import { useState } from 'react';
import Link from 'next/link';
import { formatDate } from '../lib/utils';
import ArticleTag from './ArticleTag';
import { Article } from '../types/article';

interface ArticleCardProps {
  article: Article;
  onTagClick?: (tag: string) => void;
  isPromotion?: boolean; // 用來標識是否為優惠文章
}

export default function ArticleCard({ 
  article, 
  onTagClick, 
  isPromotion = false 
}: ArticleCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const path = isPromotion 
    ? `/promotions/${article.slug}` 
    : `/articles/${article.slug}`;

  return (
    <div 
      className="overflow-hidden rounded-lg bg-[#1e293b] hover:shadow-lg transition-shadow duration-300 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={path} className="block text-white no-underline flex-grow">
        <div className="p-4 flex flex-col h-full">
          <h3 className={`text-xl font-bold mb-2 ${isHovered ? 'text-[#FF7A00]' : 'text-white'} transition-colors`}>
            {article.title}
          </h3>
          <p className="text-[#94a3b8] mb-4 flex-grow text-sm">
            {article.summary}
          </p>
          <div className="flex flex-wrap gap-2 mt-auto mb-2">
            {article.tags.slice(0, 3).map((tag) => (
              <ArticleTag 
                key={tag} 
                tag={tag}
                onClick={onTagClick ? (e) => {
                  e.preventDefault();
                  onTagClick(tag);
                } : undefined}
              />
            ))}
          </div>
          <div className="text-xs text-[#64748b] mt-3">
            {formatDate(article.publishedAt)}
          </div>
        </div>
      </Link>
    </div>
  );
}