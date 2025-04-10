import React from 'react';
import { Link, useLocation } from 'wouter';
import './Header.css';

const Header: React.FC = () => {
  const [location] = useLocation();
  
  // 判斷當前頁面
  const isHome = location === '/';
  const isArticles = location.startsWith('/articles');
  
  return (
    <div className="header">
      <div className="logo-section">
        <Link href="/">
          <img src="/logo.svg" alt="牙GoGo Logo" className="logo" />
        </Link>
        <div className="brand-text">
          <h1>牙GoGo</h1>
          <p className="slogan">至關心你啲牙既牙科資訊平台</p>
        </div>
      </div>
      
      <nav className="main-nav">
        <Link href="/">
          <span className={isHome ? 'active' : ''}>首頁</span>
        </Link>
        <Link href="/articles">
          <span className={isArticles ? 'active' : ''}>健康文章</span>
        </Link>
        <Link href="/report">
          <span className={location === '/report' ? 'active' : ''}>報錯</span>
        </Link>
      </nav>
    </div>
  );
};

export default Header;
