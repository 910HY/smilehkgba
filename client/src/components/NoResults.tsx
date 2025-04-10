import React from 'react';
import { Search, MapPin, ArrowDown } from 'lucide-react';

interface NoResultsProps {
  hasSearched?: boolean;
}

const WelcomeMessage = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="bg-[#ffaa40]/10 p-6 rounded-full mb-6">
      <MapPin className="h-12 w-12 text-[#ffaa40]" />
    </div>
    <h3 className="text-[#ffaa40] text-2xl font-bold mb-2 tracking-wide">歡迎使用牙GoGo</h3>
    <p className="text-[#94a3b8] max-w-md mb-4">
      請使用上方搜尋欄位尋找香港及大灣區的牙科診所資訊。
    </p>
    <div className="animate-bounce">
      <ArrowDown className="h-6 w-6 text-[#ffbb66]" />
    </div>
  </div>
);

const EmptySearchResults = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="bg-[#ffaa40]/10 p-6 rounded-full mb-6">
      <Search className="h-12 w-12 text-[#ffaa40]" />
    </div>
    <h3 className="text-[#ffaa40] text-2xl font-bold mb-2 tracking-wide">未找到符合條件的診所</h3>
    <p className="text-[#94a3b8] max-w-md">
      請嘗試調整您的搜尋條件，例如選擇不同的區域或移除部分篩選條件。
    </p>
  </div>
);

const NoResults: React.FC<NoResultsProps> = ({ hasSearched = false }) => {
  // 如果尚未搜尋，顯示歡迎信息
  if (!hasSearched) {
    return <WelcomeMessage />;
  }
  
  // 否則顯示無結果的信息
  return <EmptySearchResults />;
};

export default NoResults;