import React from 'react';
import { Link } from 'wouter';
import { Article, Source } from '../types/article';
import ArticleTag from './ArticleTag';
import { Button } from './ui/button';
import { formatDate } from '../lib/utils';

interface ArticlePageProps {
  article: Article;
  onTagClick?: (tag: string) => void;
}

const ArticlePage: React.FC<ArticlePageProps> = ({ article, onTagClick }) => {
  // 判斷文章內容是否為HTML格式
  const isHtmlContent = article.content.includes('<') && article.content.includes('>');
  
  // 根據內容類型處理顯示
  const renderContent = () => {
    if (isHtmlContent) {
      // 如果是HTML，使用dangerouslySetInnerHTML渲染
      return (
        <div 
          className="prose prose-invert prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      );
    } else {
      // 如果是純文本，按段落分割顯示
      const contentParagraphs = article.content.split('\n\n').filter(p => p.trim().length > 0);
      return (
        <div className="prose prose-invert prose-lg max-w-none mb-12">
          {contentParagraphs.map((paragraph, index) => (
            <p key={index} className="text-slate-300">
              {paragraph}
            </p>
          ))}
        </div>
      );
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 返回按鈕 */}
      <Link href="/articles">
        <Button variant="link" className="text-orange-400 hover:text-orange-500 p-0 mb-8">
          ← 返回文章列表
        </Button>
      </Link>
      
      {/* 文章標題 */}
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
        {article.title}
      </h1>
      
      {/* 發佈日期與標籤 */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <span className="text-slate-400">
          {formatDate(article.publishedAt)}
        </span>
        
        {article.tags.map(tag => (
          <ArticleTag 
            key={tag} 
            tag={tag} 
            onClick={onTagClick ? (e: React.MouseEvent<HTMLSpanElement>) => {
              e.preventDefault();
              onTagClick(tag);
            } : undefined}
          />
        ))}
      </div>
      
      {/* 文章摘要 */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 mb-8">
        <p className="text-white italic">
          {article.summary}
        </p>
      </div>
      
      {/* 文章內容 - 使用條件渲染 */}
      {renderContent()}
      
      {/* 文章來源 */}
      {article.sources && article.sources.length > 0 && (
        <div className="mt-12 border-t border-slate-700 pt-6">
          <h3 className="font-bold text-xl text-white mb-4">參考資料</h3>
          <ul className="space-y-2">
            {article.sources.map((source: Source, index: number) => (
              <li key={index} className="text-slate-300">
                <a 
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-500 hover:underline"
                >
                  {source.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* 回到頂部 */}
      <div className="text-center mt-12">
        <Button 
          variant="outline" 
          className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          回到頂部
        </Button>
      </div>
    </div>
  );
};

export default ArticlePage;