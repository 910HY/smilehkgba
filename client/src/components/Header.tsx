import React from 'react';
import { Link, useLocation } from 'wouter'; 
import logo from '@assets/LOGO_UPDATED.png';

const Header: React.FC = () => {
  const [location] = useLocation();
  
  // 判斷當前頁面
  const isHome = location === '/';
  const isArticles = location.startsWith('/articles');
  
  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
      <div className="flex items-center">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <img 
              src={logo}
              alt="牙點 Dento Logo" 
              className="w-[80px] h-auto"
            />
            <h1 className="text-[#FF7A00] text-3xl font-bold ml-4 tracking-wider">牙點 Dento</h1>
          </div>
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row items-start md:items-center mt-4 md:mt-0">
        {/* 主導航 */}
        <nav className="flex space-x-6 mb-2 md:mb-0 md:mr-8">
          <Link href="/">
            <span className={`text-lg font-medium transition-colors cursor-pointer ${isHome ? 'text-[#FF7A00]' : 'text-white hover:text-[#FDBA74]'}`}>
              首頁
            </span>
          </Link>
          <Link href="/articles">
            <span className={`text-lg font-medium transition-colors cursor-pointer ${isArticles ? 'text-[#FF7A00]' : 'text-white hover:text-[#FDBA74]'}`}>
              健康文章
            </span>
          </Link>
          <Link href="/report">
            <span className={`text-lg font-medium transition-colors cursor-pointer ${location === '/report' ? 'text-[#FF7A00]' : 'text-white hover:text-[#FDBA74]'}`}>
              報錯
            </span>
          </Link>
        </nav>
        
        {/* 標語 */}
        <h2 className="text-[#FDBA74] text-xl tracking-wide">至關心你啲牙點既牙科資訊平台</h2>
      </div>
    </header>
  );
};

export default Header;
