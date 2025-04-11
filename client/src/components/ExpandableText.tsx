import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExpandableTextProps {
  label: React.ReactNode;
  content: string | React.ReactNode;
  icon?: React.ReactNode;
  initialExpanded?: boolean;
  alwaysShowFull?: boolean; // 新增屬性：是否永遠顯示完整內容
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ 
  label, 
  content, 
  icon, 
  initialExpanded = false,
  alwaysShowFull = false  // 默認不總是顯示完整內容
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const toggleExpand = () => {
    if (!alwaysShowFull) { // 只有在非永遠顯示模式下才切換
      setIsExpanded(!isExpanded);
    }
  };

  // 如果設置為永遠顯示完整內容，就不顯示展開/收起按鈕
  const showToggleButton = !alwaysShowFull;
  
  // 決定是否顯示完整內容
  const showFullContent = isExpanded || alwaysShowFull;

  return (
    <div className="flex flex-col">
      <div 
        onClick={toggleExpand}
        className={`flex items-start justify-between w-full text-left ${!alwaysShowFull ? 'cursor-pointer' : ''}`}
      >
        <div className="flex items-start flex-1">
          {icon && <span className="mr-2 mt-0.5 flex-shrink-0">{icon}</span>}
          <span className="text-[#ffaa40] text-sm font-medium">{label}</span>
        </div>
        {showToggleButton && (
          <span className="text-[#ffaa40] ml-2">
            {showFullContent ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </span>
        )}
      </div>
      <div className={`mt-1 ml-7 text-[#94a3b8] text-sm ${showFullContent ? 'whitespace-pre-line' : 'line-clamp-1'}`}>
        {content}
      </div>
    </div>
  );
};

export default ExpandableText;