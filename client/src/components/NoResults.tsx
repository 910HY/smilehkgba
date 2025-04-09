import React from 'react';
import { Search, MapPin, ArrowDown } from 'lucide-react';

interface NoResultsProps {
  hasSearched?: boolean;
}

const NoResults: React.FC<NoResultsProps> = ({ hasSearched = false }) => {
  if (!hasSearched) {
    // 顯示歡迎信息，還沒有搜尋
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-[#FF7A00]/10 p-6 rounded-full mb-6">
          <MapPin className="h-12 w-12 text-[#FF7A00]" />
        </div>
        <h3 className="text-[#FF7A00] text-2xl font-bold mb-2 tracking-wide">歡迎使用牙點 Dento</h3>
        <p className="text-[#94a3b8] max-w-md mb-4">
          請使用上方搜尋欄位尋找香港及大灣區的牙科診所資訊。
        </p>
        <div className="animate-bounce">
          <ArrowDown className="h-6 w-6 text-[#FDBA74]" />
        </div>
      </div>
    );
  }
  
  // 已經搜尋但沒有結果
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="bg-[#FF7A00]/10 p-6 rounded-full mb-6">
        <Search className="h-12 w-12 text-[#FF7A00]" />
      </div>
      <h3 className="text-[#FF7A00] text-2xl font-bold mb-2 tracking-wide">未找到符合條件的診所</h3>
      <p className="text-[#94a3b8] max-w-md">
        請嘗試調整您的搜尋條件，例如選擇不同的區域或移除部分篩選條件。
      </p>
    </div>
  );
};

export default NoResults;