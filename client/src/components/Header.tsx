import React from 'react';
import logo from '@assets/LOGO_UPDATED.png';

const Header: React.FC = () => {
  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
      <div className="flex items-center">
        <img 
          src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 10c-22.1 0-40 17.9-40 40s17.9 40 40 40 40-17.9 40-40-17.9-40-40-40zm0 7c18.2 0 33 14.8 33 33s-14.8 33-33 33-33-14.8-33-33 14.8-33 33-33z' fill='%23FF7A00'/%3E%3Cg fill='%23FF7A00'%3E%3Cpath d='M50 28c-12.2 0-22 9.8-22 22s9.8 22 22 22 22-9.8 22-22-9.8-22-22-22zm0 37c-8.3 0-15-6.7-15-15s6.7-15 15-15 15 6.7 15 15-6.7 15-15 15z'/%3E%3Cpath d='M65 50c0 2.5-0.8 4.8-2.2 6.7l5.8 5.8c2.7-3.4 4.4-7.7 4.4-12.5 0-4.7-1.6-9-4.2-12.3l-5.8 5.8c1.3 1.8 2 4 2 6.5zM50 35c-2.5 0-4.7 0.7-6.5 2l-5.8-5.8c3.3-2.6 7.6-4.2 12.3-4.2 4.8 0 9.1 1.6 12.5 4.4l-5.8 5.8C54.8 35.8 52.5 35 50 35z'/%3E%3Cpath d='M35 50c0-2.5 0.7-4.7 2-6.5l-5.8-5.8c-2.6 3.3-4.2 7.6-4.2 12.3 0 4.8 1.6 9.1 4.4 12.5l5.8-5.8c-1.4-1.9-2.2-4.2-2.2-6.7zM56.5 63c-1.8 1.3-4 2-6.5 2s-4.8-0.8-6.7-2.2l-5.8 5.8c3.4 2.7 7.7 4.4 12.5 4.4 4.7 0 9-1.6 12.3-4.2l-5.8-5.8z'/%3E%3C/g%3E%3C/svg%3E"
          alt="SmileHK Logo" 
          className="w-20 h-auto"
        />
        <h1 className="text-primary text-3xl font-bold ml-4">SmileHK</h1>
      </div>
      <h2 className="text-white text-xl mt-2 md:mt-0">香港及大灣區牙醫資訊平台</h2>
    </header>
  );
};

export default Header;
