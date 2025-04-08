import React from 'react';
import { Link } from 'wouter';

// 嘗試多種可能的 logo 路徑
const logoAttempts = [
  '/assets/LOGO_UPDATED.png',
  '/LOGO_UPDATED.png',
  '/client/public/assets/LOGO_UPDATED.png',
  '/client/public/LOGO_UPDATED.png'
];

const Header: React.FC = () => {
  // 當圖片加載失敗時嘗試下一個路徑
  const [currentLogoIndex, setCurrentLogoIndex] = React.useState(0);
  const [logoLoaded, setLogoLoaded] = React.useState(false);

  const handleLogoError = () => {
    if (currentLogoIndex < logoAttempts.length - 1) {
      setCurrentLogoIndex(currentLogoIndex + 1);
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
              <span className="text-[#FF7A00] text-sm">Logo</span>
            </div>
          )}
          <img 
            src={logoAttempts[currentLogoIndex]}
            alt="SmileHK Logo" 
            className={`w-[80px] h-auto ${!logoLoaded ? 'hidden' : ''}`}
            onError={handleLogoError}
            onLoad={handleLogoLoaded}
          />
          <h1 className="text-[#FF7A00] text-3xl font-bold ml-4 tracking-wider">SmileHK</h1>
        </div>
      </Link>
      <h2 className="text-[#FDBA74] text-xl mt-2 md:mt-0 tracking-wide">香港及大灣區牙醫資訊平台</h2>
    </header>
  );
};

export default Header;
