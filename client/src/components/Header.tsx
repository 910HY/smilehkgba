import React, { useEffect } from 'react';
import { Link } from 'wouter';

// 嘗試從 attached_assets 目錄導入
// @ts-ignore
import logoFromAssets from '@assets/LOGO_UPDATED.png';
// @ts-ignore
import logoFromRoot from '@assets/favicon.ico';

// 備用路徑
const logoAttempts = [
  '/assets/LOGO_UPDATED.png',
  '/LOGO_UPDATED.png',
  '/client/public/assets/LOGO_UPDATED.png',
  '/client/public/LOGO_UPDATED.png',
  './assets/LOGO_UPDATED.png',
  './LOGO_UPDATED.png',
  '/attached_assets/LOGO_UPDATED.png',
  './attached_assets/LOGO_UPDATED.png'
];

const Header: React.FC = () => {
  // 當圖片加載失敗時嘗試下一個路徑
  const [currentLogoIndex, setCurrentLogoIndex] = React.useState(0);
  const [logoLoaded, setLogoLoaded] = React.useState(false);
  
  // 首先嘗試從已導入的資源中獲取
  const [logoSrc, setLogoSrc] = React.useState(logoFromAssets || logoFromRoot || logoAttempts[0]);
  
  useEffect(() => {
    // 如果導入的資源有效，直接設置為已加載
    if (logoFromAssets || logoFromRoot) {
      setLogoLoaded(true);
    }
  }, []);

  const handleLogoError = () => {
    if (currentLogoIndex < logoAttempts.length - 1) {
      setCurrentLogoIndex(currentLogoIndex + 1);
      setLogoSrc(logoAttempts[currentLogoIndex + 1]);
    }
  };

  const handleLogoLoaded = () => {
    setLogoLoaded(true);
  };

  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
      <Link href="/">
        <div className="flex items-center cursor-pointer">
          {!logoLoaded && (
            <div className="w-[80px] h-[80px] bg-[#1e293b] rounded flex items-center justify-center">
              <span className="text-[#FF7A00] text-sm">SmileHK</span>
            </div>
          )}
          <img 
            src={logoSrc}
            alt="SmileHK Logo" 
            className={`w-[80px] h-auto ${!logoLoaded ? 'hidden' : ''}`}
            onError={handleLogoError}
            onLoad={handleLogoLoaded}
          />
          <h1 className="text-[#FF7A00] text-3xl font-bold ml-4 tracking-wider font-orbitron">SmileHK</h1>
        </div>
      </Link>
      <h2 className="text-[#FDBA74] text-xl mt-2 md:mt-0 tracking-wide">香港及大灣區牙醫資訊平台</h2>
    </header>
  );
};

export default Header;
