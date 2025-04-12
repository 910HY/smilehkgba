import Link from 'next/link';
import { formatDate } from '../lib/utils';
import type { Article } from '../types/article';
import ArticleTag from './ArticleTag';

interface ArticleCardProps {
  article: Article;
  onTagClick?: (tag: string) => void;
  isPromotion?: boolean; // 新增屬性，用來標識是否為優惠文章
}

export default function ArticleCard({ article, onTagClick, isPromotion = false }: ArticleCardProps) {
  const { title, slug, summary, tags, publishedAt } = article;
  
  // 確定文章的鏈接路徑
  const articleLink = isPromotion 
    ? `/promotions/${slug}` 
    : `/articles/${slug}`;

  return (
    <div className="bg-[#1e293b] rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link href={articleLink} legacyBehavior>
        <a className="block p-5">
          <h3 className="text-[#FF7A00] text-xl font-bold mb-2 line-clamp-2">
            {title}
          </h3>
          
          <p className="text-gray-300 mb-3 text-sm line-clamp-2">
            {summary}
          </p>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 2).map((tag) => (
                <ArticleTag 
                  key={tag} 
                  tag={tag}
                  onClick={onTagClick ? (e) => {
                    e.preventDefault();
                    onTagClick(tag);
                  } : undefined}
                />
              ))}
              {tags.length > 2 && (
                <span className="text-xs text-gray-400">+{tags.length - 2} 更多</span>
              )}
            </div>
            
            <div className="text-[#94a3b8] text-xs">
              {formatDate(publishedAt)}
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
}