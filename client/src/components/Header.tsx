import React from 'react';
import logo from '@assets/LOGO_UPDATED.png';

const Header: React.FC = () => {
  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
      <div className="flex items-center">
        <img 
          src={logo}
          alt="SmileHK Logo" 
          className="w-[80px] h-auto"
        />
        <h1 className="text-primary text-3xl font-bold ml-4 tracking-wider">SmileHK</h1>
      </div>
      <h2 className="text-primary text-xl mt-2 md:mt-0 tracking-wide">香港及大灣區牙醫資訊平台</h2>
    </header>
  );
};

export default Header;
