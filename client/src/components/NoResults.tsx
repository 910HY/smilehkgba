import React from 'react';

const NoResults: React.FC = () => {
  return (
    <div className="text-center py-20">
      <i className="fas fa-search text-5xl text-primary mb-4"></i>
      <h3 className="text-white text-xl mb-2">沒有找到符合條件的診所</h3>
      <p className="text-gray-400">請嘗試更改搜尋條件</p>
    </div>
  );
};

export default NoResults;
