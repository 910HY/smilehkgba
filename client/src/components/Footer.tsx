import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-12 py-6 border-t border-white/10">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h3 className="text-white text-lg font-bold">SmileHK - 香港及大灣區牙醫資訊平台</h3>
          <p className="text-white/60 text-sm mt-1">
            幫助您輕鬆找到適合的牙科診所
          </p>
        </div>
        <div className="text-white/60 text-sm">
          <p>© {currentYear} SmileHK. 版權所有</p>
          <p className="mt-1">數據僅供參考，詳情請致電診所查詢</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;