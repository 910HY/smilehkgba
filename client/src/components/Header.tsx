import React from 'react';
import logo from '@assets/LOGO_UPDATED.png';

const Header: React.FC = () => {
  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
      <div className="flex items-center">
        <img 
          src={logo}
          alt="牙點 Dento Logo" 
          className="w-[80px] h-auto"
        />
        <h1 className="text-[#FF7A00] text-3xl font-bold ml-4 tracking-wider">牙點 Dento</h1>
      </div>
      <h2 className="text-[#FDBA74] text-xl mt-2 md:mt-0 tracking-wide">至關心你啲牙點既牙科資訊平台</h2>
    </header>
  );
};

export default Header;
