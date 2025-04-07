import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, paginate }) => {
  // Generate page numbers array
  const pageNumbers = [];
  
  // Show at most 5 page buttons
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  
  // Adjust start page if we're at the end
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="mt-8 flex justify-center">
      <nav className="inline-flex rounded-md shadow-sm">
        {/* Previous page button */}
        <button
          onClick={() => currentPage > 1 && paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`py-2 px-4 border rounded-l-md transition ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
              : 'bg-white text-textPrimary border-gray-300 hover:bg-gray-100'
          }`}
        >
          上一頁
        </button>
        
        {/* Page numbers */}
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`py-2 px-4 border transition ${
              currentPage === number
                ? 'bg-primary border-primary text-white hover:bg-orange-500'
                : 'bg-white border-gray-300 text-textPrimary hover:bg-gray-100'
            }`}
          >
            {number}
          </button>
        ))}
        
        {/* Next page button */}
        <button
          onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`py-2 px-4 border rounded-r-md transition ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
              : 'bg-white text-textPrimary border-gray-300 hover:bg-gray-100'
          }`}
        >
          下一頁
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
