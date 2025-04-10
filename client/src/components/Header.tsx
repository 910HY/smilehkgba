import React from 'react';
import { Link, useLocation } from 'wouter';
import './Header.css';

// 全新重建的Header組件，使用行內樣式確保品牌名稱正確顯示
const Header = () => {
  const [location] = useLocation();
  
  // 判斷當前頁面
  const isHome = location === '/';
  const isArticles = location.startsWith('/articles');
  const isReport = location === '/report';
  
  // 使用行內樣式而不依賴CSS文件
  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 1rem',
    background: '#000000',
    color: '#ffaa40',
    borderBottom: '1px solid #333',
    marginBottom: '1.5rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
  };
  
  const logoSectionStyle = {
    display: 'flex',
    alignItems: 'center'
  };
  
  const logoStyle = {
    height: '48px',
    marginRight: '12px'
  };
  
  const brandNameStyle = {
    fontSize: '1.6rem',
    margin: '0',
    fontWeight: 'bold',
    color: '#ffaa40'
  };
  
  const sloganStyle = {
    fontSize: '0.9rem',
    color: '#ffbb66',
    marginTop: '2px'
  };
  
  const navStyle = {
    display: 'flex',
    gap: '1.5rem'
  };
  
  const navItemStyle = {
    color: 'white',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'color 0.2s'
  };
  
  const activeNavItemStyle = {
    ...navItemStyle,
    color: '#ffaa40',
    fontWeight: 'bold'
  };
  
  return (
    <header style={headerStyle}>
      <div style={logoSectionStyle}>
        <Link href="/">
          <img 
            src={`/logo.svg?v=${Date.now()}`} 
            alt="牙GoGo Logo" 
            style={logoStyle}
          />
        </Link>
        <div>
          <h1 style={brandNameStyle}>牙GoGo</h1>
          <p style={sloganStyle}>至關心你啲牙既牙科資訊平台</p>
        </div>
      </div>
      
      <nav style={navStyle}>
        <Link href="/">
          <span style={isHome ? activeNavItemStyle : navItemStyle}>首頁</span>
        </Link>
        <Link href="/articles">
          <span style={isArticles ? activeNavItemStyle : navItemStyle}>健康文章</span>
        </Link>
        <Link href="/report">
          <span style={isReport ? activeNavItemStyle : navItemStyle}>報錯</span>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
