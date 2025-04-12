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
  initialExpanded = false,
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mb-2">
      <div
        className="flex items-center cursor-pointer text-[#FDBA74] hover:text-[#FF7A00] transition-colors"
        onClick={toggleExpand}
      >
        {icon && <span className="mr-1">{icon}</span>}
        <div className="font-medium">{label}</div>
        <div className="ml-1">
          {isExpanded ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="mt-1 text-sm text-[#94a3b8] pl-4">
          {typeof content === 'string' ? <p>{content}</p> : content}
        </div>
      )}
    </div>
  );
}