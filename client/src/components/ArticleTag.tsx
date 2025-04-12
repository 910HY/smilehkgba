import React from 'react';

interface ArticleTagProps {
  tag: string;
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
  isActive?: boolean;
}

export default function ArticleTag({ tag, onClick, isActive = false }: ArticleTagProps) {
  return (
    <span
      className={`
        inline-block px-2 py-1 text-xs font-medium rounded-full
        ${isActive 
          ? 'bg-[#FF7A00] text-white' 
          : 'bg-[#334155] text-[#FDBA74] hover:bg-[#475569] cursor-pointer'}
        transition-colors duration-200
      `}
      onClick={onClick}
    >
      {tag}
    </span>
  );
}