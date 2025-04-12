import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
}

export default function Pagination({ currentPage, totalPages, paginate }: PaginationProps) {
  // 計算要顯示的頁碼範圍
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // 最多顯示的頁碼數
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  // 如果只有一頁，不顯示分頁
  if (totalPages <= 1) return null;

  return (
    <nav className="flex justify-center mt-8">
      <ul className="flex space-x-1">
        {/* 首頁按鈕 */}
        {currentPage > 1 && (
          <li>
            <button
              onClick={() => paginate(1)}
              className="px-3 py-1 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
              aria-label="第一頁"
            >
              &laquo;
            </button>
          </li>
        )}
        
        {/* 上一頁按鈕 */}
        {currentPage > 1 && (
          <li>
            <button
              onClick={() => paginate(currentPage - 1)}
              className="px-3 py-1 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
              aria-label="上一頁"
            >
              &lsaquo;
            </button>
          </li>
        )}
        
        {/* 頁碼按鈕 */}
        {getPageNumbers().map(number => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded-md transition-colors ${
                currentPage === number
                  ? 'bg-[#ff7a00] text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              aria-label={`第 ${number} 頁`}
              aria-current={currentPage === number ? 'page' : undefined}
            >
              {number}
            </button>
          </li>
        ))}
        
        {/* 下一頁按鈕 */}
        {currentPage < totalPages && (
          <li>
            <button
              onClick={() => paginate(currentPage + 1)}
              className="px-3 py-1 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
              aria-label="下一頁"
            >
              &rsaquo;
            </button>
          </li>
        )}
        
        {/* 最後一頁按鈕 */}
        {currentPage < totalPages && (
          <li>
            <button
              onClick={() => paginate(totalPages)}
              className="px-3 py-1 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
              aria-label="最後一頁"
            >
              &raquo;
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}