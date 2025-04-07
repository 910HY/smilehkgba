import React from 'react';
import { Search } from 'lucide-react';

const NoResults: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="bg-primary/10 p-6 rounded-full mb-6">
        <Search className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-primary text-2xl font-bold mb-2 tracking-wide">未找到符合條件的診所</h3>
      <p className="text-primary/80 max-w-md">
        請嘗試調整您的搜尋條件，例如選擇不同的區域或移除部分篩選條件。
      </p>
    </div>
  );
};

export default NoResults;