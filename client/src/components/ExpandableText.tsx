// client/src/components/ExpandableText.tsx

import { useState } from 'react';

interface ExpandableTextProps {
  label: React.ReactNode;
  content: string | React.ReactNode;
  icon?: React.ReactNode;
  initialExpanded?: boolean;
}

export default function ExpandableText({ 
  label, 
  content, 
  icon, 
  initialExpanded = false 
}: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(initialExpanded);

  return (
    <div className="mb-2">
      <div 
        className="flex items-center cursor-pointer text-[#FF7A00] hover:text-[#e56e00] font-medium" 
        onClick={() => setExpanded(!expanded)}
      >
        {icon && <span className="mr-1">{icon}</span>}
        <span>{label}</span>
        <svg 
          className={`ml-1 w-4 h-4 transition-transform duration-200 ${expanded ? 'transform rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {expanded && (
        <div className="mt-1 text-sm text-[#94a3b8] pl-4 border-l-2 border-[#FDBA74]">
          {content}
        </div>
      )}
    </div>
  );
}