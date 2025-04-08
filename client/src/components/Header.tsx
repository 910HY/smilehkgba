import React from 'react';
import { Link } from 'wouter';

const Header: React.FC = () => {
  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
      <Link href="/">
        <div className="flex items-center cursor-pointer">
          <img 
            src="/logo.png"
            alt="SmileHK Logo" 
            className="w-[80px] h-auto"
            onError={(e) => {
              if (e.currentTarget) {
                e.currentTarget.src = "/favicon.ico";
                e.currentTarget.onerror = () => {
                  // 如果favicon也失敗，顯示一個純色塊
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement?.classList.add("bg-[#FF7A00]", "w-[80px]", "h-[80px]", "rounded-md", "flex", "items-center", "justify-center");
                  const span = document.createElement("span");
                  span.textContent = "SmileHK";
                  span.className = "text-white text-xs font-bold";
                  e.currentTarget.parentElement?.appendChild(span);
                };
              }
            }}
          />
          <h1 className="text-[#FF7A00] text-3xl font-bold ml-4 tracking-wider font-orbitron" style={{color: "#FF7A00", fontFamily: "'Orbitron', 'Noto Sans TC', sans-serif"}}>SmileHK</h1>
        </div>
      </Link>
      <h2 className="text-[#FDBA74] text-xl mt-2 md:mt-0 tracking-wide" style={{color: "#FDBA74"}}>香港及大灣區牙醫資訊平台</h2>
    </header>
  );
};

export default Header;
