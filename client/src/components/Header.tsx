import React from 'react';
import { Link } from 'wouter';
// @ts-ignore
import logo from '@assets/LOGO_UPDATED.png';

const Header: React.FC = () => {
  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
      <Link href="/">
        <div className="flex items-center cursor-pointer">
          <img 
            src={logo}
            alt="SmileHK Logo" 
            className="w-[80px] h-auto"
            onError={(e) => {
              // 嘗試備用路徑
              if (e.currentTarget) {
                e.currentTarget.src = "/assets/LOGO_UPDATED.png";
              }
            }}
          />
          <h1 className="text-[#FF7A00] text-3xl font-bold ml-4 tracking-wider font-orbitron">SmileHK</h1>
        </div>
      </Link>
      <h2 className="text-[#FDBA74] text-xl mt-2 md:mt-0 tracking-wide">香港及大灣區牙醫資訊平台</h2>
    </header>
  );
};

export default Header;
