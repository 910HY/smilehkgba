import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();
  
  // 判斷當前頁面是否為活躍頁面的函數
  const isActiveLink = (path: string) => {
    return router.pathname === path;
  };

  return (
    <header className="mb-8">
      <div className="flex flex-col lg:flex-row justify-between items-center py-4">
        <div className="flex items-center mb-4 lg:mb-0">
          <Link href="/" legacyBehavior>
            <a className="flex items-center">
              <img 
                src={`/logo.png?v=${Date.now()}`} 
                alt="牙GoGo Logo" 
                className="h-10 w-10 mr-3"
              />
              <div>
                <h1 className="text-[#ffaa40] font-bold text-2xl tracking-tight">牙GoGo</h1>
                <p className="text-[#ffbb66] text-xs">至關心你啲牙既牙科資訊平台</p>
              </div>
            </a>
          </Link>
        </div>
        
        <nav className="flex items-center space-x-6">
          <Link href="/" legacyBehavior>
            <a className={`text-${isActiveLink('/') ? '[#ffaa40]' : 'gray-400'} hover:text-[#ffaa40] transition-colors font-medium`}>
              首頁
            </a>
          </Link>
          <Link href="/articles" legacyBehavior>
            <a className={`text-${isActiveLink('/articles') ? '[#ffaa40]' : 'gray-400'} hover:text-[#ffaa40] transition-colors font-medium`}>
              關心你啲牙
            </a>
          </Link>
          <Link href="/promotions" legacyBehavior>
            <a className={`text-${isActiveLink('/promotions') ? '[#ffaa40]' : 'gray-400'} hover:text-[#ffaa40] transition-colors font-medium`}>
              優惠牙
            </a>
          </Link>
        </nav>
      </div>
    </header>
  );
}