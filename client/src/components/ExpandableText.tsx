import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExpandableTextProps {
  label: React.ReactNode;
  content: string | React.ReactNode;
  icon?: React.ReactNode;
  initialExpanded?: boolean;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ 
  label, 
  content, 
  icon, 
  initialExpanded = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-col">
      <button 
        onClick={toggleExpand}
        className="flex items-start justify-between w-full text-left"
      >
        <div className="flex items-start flex-1">
          {icon && <span className="mr-2 mt-0.5 flex-shrink-0">{icon}</span>}
          <span className="text-[#ffaa40] text-sm font-medium">{label}</span>
        </div>
        <span className="text-[#ffaa40] ml-2">
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </button>
      <div className={`mt-1 ml-7 text-[#94a3b8] text-sm ${isExpanded ? 'whitespace-pre-line' : 'line-clamp-1'}`}>
        {content}
      </div>
    </div>
  );
};

export default ExpandableText;