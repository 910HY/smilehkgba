import React from 'react';
import { Link, useLocation } from 'wouter';
import './Header.css';

// 全新重建的Header組件
const Header = () => {
  const [location] = useLocation();
  
  // 判斷當前頁面
  const isHome = location === '/';
  const isArticles = location.startsWith('/articles');
  const isReport = location === '/report';
  
  return (
    <header className="header">
      <div className="logo-section">
        <Link href="/">
          <img 
            src={`/logo.svg?v=${Date.now()}`} 
            alt="牙GoGo Logo" 
            className="logo" 
          />
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
          <span className={isReport ? 'active' : ''}>報錯</span>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
