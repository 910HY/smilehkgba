import React from 'react';
import { Link, useLocation } from 'wouter';
import './Header.css';

// 按照新設計重構的Header組件
const Header = () => {
  const [location] = useLocation();
  
  // 判斷當前頁面
  const isHome = location === '/';
  const isArticles = location.startsWith('/articles');
  const isReport = location === '/report';
  
  // 使用行內樣式確保顯示正確
  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 1rem',
    background: '#000000',
    color: '#FF7A00', // 改回原來的橙色
    borderBottom: '1px solid #333',
    marginBottom: '1.5rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
  };
  
  // 左側品牌區塊
  const brandSectionStyle = {
    display: 'flex',
    alignItems: 'center'
  };
  
  const brandTextStyle = {
    display: 'flex',
    flexDirection: 'column' as const
  };
  
  const brandNameStyle = {
    fontSize: '1.6rem',
    margin: '0',
    fontWeight: 'bold',
    color: '#FF7A00'
  };
  
  const sloganStyle = {
    fontSize: '0.9rem',
    color: '#FF9D45',
    marginTop: '2px'
  };
  
  // 中間導航區塊
  const navContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    flex: '1 1 auto'
  };
  
  const navStyle = {
    display: 'flex',
    gap: '2rem'
  };
  
  const navItemStyle = {
    color: 'white',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'color 0.2s'
  };
  
  const activeNavItemStyle = {
    ...navItemStyle,
    color: '#FF7A00',
    fontWeight: 'bold'
  };
  
  // 右側Logo區塊
  const logoContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end'
  };
  
  const logoStyle = {
    width: '80px',
    height: 'auto'
  };
  
  return (
    <header style={headerStyle}>
      {/* 左側品牌區塊 */}
      <div style={brandSectionStyle}>
        <div style={brandTextStyle}>
          <h1 style={brandNameStyle}>牙GoGo</h1>
          <p style={sloganStyle}>至關心你啲牙既牙科資訊平台</p>
        </div>
      </div>
      
      {/* 中間導航區塊 */}
      <div style={navContainerStyle}>
        <nav style={navStyle}>
          <Link href="/">
            <span style={isHome ? activeNavItemStyle : navItemStyle}>首頁</span>
          </Link>
          <Link href="/articles">
            <span style={isArticles ? activeNavItemStyle : navItemStyle}>關心你啲牙</span>
          </Link>
        </nav>
      </div>
      
      {/* 右側Logo區塊 */}
      <div style={logoContainerStyle}>
        <Link href="/">
          <img 
            src={`/logo.svg?v=${Date.now()}`} 
            alt="牙GoGo Logo" 
            style={logoStyle}
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
