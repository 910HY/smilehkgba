import React from 'react';

interface NoResultsProps {
  hasSearched?: boolean;
}

export default function NoResults({ hasSearched = false }: NoResultsProps) {
  return (
    <div className="text-center py-12">
      <div className="flex flex-col items-center justify-center">
        <div className="bg-gray-800 p-6 rounded-full mb-6">
          <span className="text-5xl">🔍</span>
        </div>
        
        <h3 className="text-2xl font-semibold text-[#ffaa40] mb-3">
          {hasSearched ? '沒有找到符合條件的診所' : '請使用搜尋功能'}
        </h3>
        
        <p className="text-gray-300 max-w-lg mx-auto mb-8">
          {hasSearched 
            ? '您的搜尋條件沒有匹配的結果。請嘗試調整搜尋條件，或選擇不同的地區。' 
            : '請使用上方的搜尋功能來尋找您附近的牙科診所。'}
        </p>
        
        {hasSearched && (
          <div className="space-y-4 text-left bg-gray-700 p-4 rounded-lg max-w-md">
            <h4 className="font-medium text-[#ffbb66]">搜尋建議：</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm">
              <li>嘗試使用更廣的地區範圍</li>
              <li>移除一些搜尋條件</li>
              <li>檢查關鍵詞拼寫是否正確</li>
              <li>嘗試使用診所名稱的一部分</li>
              <li>若需查找特定地址附近的診所，可直接輸入該地址</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}