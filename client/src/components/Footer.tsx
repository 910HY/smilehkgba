import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
      <p>© {new Date().getFullYear()} SmileHK - 香港及大灣區牙醫資訊平台</p>
      <p className="mt-2">資料僅供參考，實際診所情況請直接聯絡相關診所</p>
    </footer>
  );
};

export default Footer;
