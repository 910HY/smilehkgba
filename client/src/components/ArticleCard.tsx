import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import ArticleTag from './ArticleTag';
import { Article } from '../types/article';

interface ArticleCardProps {
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

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onTagClick }) => {
  return (
    <Card className="h-full flex flex-col bg-slate-800 border-slate-700 hover:border-orange-300 transition-colors duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">
          <Link href={`/articles/${article.slug}`} className="hover:text-orange-400 transition-colors">
            {article.title}
          </Link>
        </CardTitle>
        <div className="text-sm text-gray-400">
          {formatDate(article.publishedAt)}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-300 mb-4">{article.summary}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <ArticleTag 
              key={tag} 
              tag={tag} 
              onClick={() => onTagClick && onTagClick(tag)}
            />
          ))}
        </div>
        <Link href={`/articles/${article.slug}`}>
          <Button variant="outline" className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white">
            閱讀更多
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;