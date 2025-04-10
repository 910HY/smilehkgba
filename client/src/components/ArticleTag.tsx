import React from 'react';

interface ArticleTagProps {
  tag: string;
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
  isActive?: boolean;
}

const ArticleTag: React.FC<ArticleTagProps> = ({ tag, onClick, isActive = false }) => {
  const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors";
  
  const activeClasses = "bg-orange-500 text-white hover:bg-orange-600";
  const inactiveClasses = "bg-slate-700 text-slate-300 hover:bg-slate-600";
  
  const classes = `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  
  return (
    <span 
      className={classes}
      onClick={onClick}
    >
      {tag}
    </span>
  );
};

export default ArticleTag;