import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-12 py-6 border-t border-primary/30">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h3 className="text-primary text-lg font-bold tracking-wide">牙點 Dento - 牙科資訊平台</h3>
          <p className="text-primary/70 text-sm mt-1">
            至關心你啲牙點既牙科資訊平台
          </p>
        </div>
        <div className="text-primary/70 text-sm">
          <p>© {currentYear} 牙點 Dento. 版權所有</p>
          <p className="mt-1">數據僅供參考，詳情請致電診所查詢</p>
        </div>
      </div>
      
      <div className="text-sm text-[#94a3b8] text-center mt-4 space-y-1">
        <p>聯絡我們：<a href="mailto:smilehkgba@gmail.com" className="underline text-sky-400 hover:text-sky-300 transition-colors">smilehkgba@gmail.com</a></p>
        <p>免責聲明：本平台提供資訊僅供參考，實際診所資訊請以官方為準。</p>
      </div>
    </footer>
  );
};

export default Footer;