import React from 'react';
import { Link } from 'wouter';
import { Article } from '../types/article';
import ArticleTag from './ArticleTag';
import { Button } from './ui/button';
import { FaFacebookF, FaWhatsapp } from 'react-icons/fa';

interface ArticlePageProps {
  article: Article;
  onTagClick?: (tag: string) => void;
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('zh-HK', options);
};

const ArticlePage: React.FC<ArticlePageProps> = ({ article, onTagClick }) => {
  const shareUrl = window.location.href;
  const shareTitle = encodeURIComponent(article.title);
  
  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const whatsappShareUrl = `https://wa.me/?text=${shareTitle}%20${encodeURIComponent(shareUrl)}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="mb-8">
        <Link href="/articles">
          <Button variant="link" className="text-orange-400 hover:text-orange-500 p-0">
            ← 返回文章列表
          </Button>
        </Link>
      </nav>
      
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{article.title}</h1>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="text-gray-400">
            發佈於 {formatDate(article.publishedAt)}
          </div>
          <div className="flex gap-2">
            {article.tags.map((tag) => (
              <ArticleTag 
                key={tag} 
                tag={tag} 
                onClick={() => onTagClick && onTagClick(tag)}
              />
            ))}
          </div>
        </div>
      </header>
      
      <div className="prose prose-invert prose-orange max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>
      
      {article.sources.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xl font-bold text-white mb-4">參考資料</h3>
          <ul className="list-disc list-inside text-gray-300">
            {article.sources.map((source, index) => (
              <li key={index} className="mb-2">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-500"
                >
                  {source.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="border-t border-slate-700 pt-8">
        <h3 className="text-xl font-bold text-white mb-4">分享文章</h3>
        <div className="flex gap-4">
          <a
            href={fbShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors"
            aria-label="分享到 Facebook"
          >
            <FaFacebookF size={20} />
          </a>
          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full transition-colors"
            aria-label="分享到 WhatsApp"
          >
            <FaWhatsapp size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;