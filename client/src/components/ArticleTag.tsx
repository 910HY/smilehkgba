import React from 'react';
import { Badge } from './ui/badge';

interface ArticleTagProps {
  tag: string;
  onClick?: () => void;
  isActive?: boolean;
}

const ArticleTag: React.FC<ArticleTagProps> = ({ tag, onClick, isActive = false }) => {
  return (
    <Badge 
      className={`cursor-pointer transition-colors ${
        isActive 
          ? 'bg-orange-500 hover:bg-orange-600' 
          : 'bg-slate-700 hover:bg-slate-600'
      }`}
      onClick={onClick}
    >
      {tag}
    </Badge>
  );
};

export default ArticleTag;