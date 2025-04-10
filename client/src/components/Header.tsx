import React from 'react';
import { Link, useLocation } from 'wouter';
import './Header.css';

// 按照新設計重構的Header組件
const Header = () => {
  const [location] = useLocation();
  
  // 判斷當前頁面
  const isHome = location === '/';
  const isArticles = location.startsWith('/articles');
  const isPromotions = location.startsWith('/promotions');
  const isReport = location === '/report';
  
  // 使用行內樣式確保顯示正確
  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 1rem',
    background: '#000000',
    color: '#FF7A00',
    borderBottom: '1px solid #333',
    marginBottom: '0',
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
  
  // 右側Logo區塊
  const logoContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end'
  };
  
  const logoStyle = {
    width: '80px',
    height: 'auto'
  };
  
  // 導航列樣式
  const navigationBarStyle = {
    display: 'flex',
    justifyContent: 'center',
    padding: '0.5rem 1rem',
    backgroundColor: '#0f172a',
    borderBottom: '1px solid #1e293b',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    marginBottom: '1.5rem'
  };
  
  const navigationContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto'
  };
  
  const navStyle = {
    display: 'flex',
    gap: '2rem'
  };
  
  const navItemStyle = {
    color: 'white',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'color 0.2s',
    padding: '0.5rem 0'
  };
  
  const activeNavItemStyle = {
    ...navItemStyle,
    color: '#FF7A00',
    fontWeight: 'bold',
    borderBottom: '2px solid #FF7A00'
  };
  
  return (
    <>
      <header style={headerStyle}>
        {/* 左側品牌區塊 */}
        <div style={brandSectionStyle}>
          <div style={brandTextStyle}>
            <h1 style={brandNameStyle}>牙GoGo</h1>
            <p style={sloganStyle}>至關心你啲牙既牙科資訊平台</p>
          </div>
        </div>
        
        {/* 右側Logo區塊 */}
        <div style={logoContainerStyle}>
          <Link href="/">
            <img 
              src={`/logo.png?v=${Date.now()}`} 
              alt="牙GoGo Logo" 
              style={logoStyle}
            />
          </Link>
        </div>
      </header>
      
      {/* 導航列，移至header下方 */}
      <div style={navigationBarStyle}>
        <div style={navigationContainerStyle}>
          <nav style={navStyle}>
            <Link href="/">
              <span style={isHome ? activeNavItemStyle : navItemStyle}>首頁</span>
            </Link>
            <Link href="/articles">
              <span style={isArticles ? activeNavItemStyle : navItemStyle}>關心你啲牙</span>
            </Link>
            <Link href="/promotions">
              <span style={isPromotions ? activeNavItemStyle : navItemStyle}>優惠牙</span>
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
