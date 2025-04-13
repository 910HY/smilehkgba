import Link from 'next/link';

// 使用行內樣式，不再依賴外部CSS
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerStyle = {
    backgroundColor: '#000000',
    color: '#94a3b8',
    padding: '2rem 1rem',
    marginTop: '3rem',
    borderTop: '1px solid #1e293b'
  };
  
  const footerContentStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    gap: '1.5rem'
  };
  
  const footerBrandStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem'
  };
  
  const logoStyle = {
    width: '50px',
    height: 'auto',
    marginRight: '1rem'
  };
  
  const brandTextStyle = {
    textAlign: 'center' as const
  };
  
  const footerBrandTitleStyle = {
    color: '#FF7A00',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: '0 0 0.5rem 0'
  };
  
  const footerBrandSloganStyle = {
    color: '#FF9D45',
    fontSize: '0.9rem',
    margin: '0'
  };
  
  const navStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    margin: '1rem 0'
  };
  
  const navLinkStyle = {
    color: '#e2e8f0',
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'color 0.2s ease'
  };
  
  const footerCopyrightStyle = {
    fontSize: '0.9rem',
    textAlign: 'center' as const
  };
  
  const footerDisclaimerStyle = {
    marginTop: '2rem',
    fontSize: '0.8rem',
    color: '#64748b',
    borderTop: '1px solid #1e293b',
    paddingTop: '1rem',
    textAlign: 'center' as const,
    width: '100%'
  };
  
  const linkStyle = {
    color: '#FF7A00',
    textDecoration: 'none'
  };
  
  const handleNavLinkHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = '#FF7A00';
  };
  
  const handleNavLinkLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = '#e2e8f0';
  };
  
  return (
    <footer style={footerStyle}>
      <div style={footerContentStyle}>
        <div style={footerBrandStyle}>
          <img 
            src={`/logo.png?v=${Date.now()}`} 
            alt="牙GoGo Logo" 
            style={logoStyle} 
          />
          <div style={brandTextStyle}>
            <h3 style={footerBrandTitleStyle}>牙GoGo</h3>
            <p style={footerBrandSloganStyle}>至關心你啲牙既牙科資訊平台</p>
          </div>
        </div>
        
        <nav style={navStyle}>
          <Link href="/" legacyBehavior>
            <a 
              style={navLinkStyle} 
              onMouseEnter={handleNavLinkHover} 
              onMouseLeave={handleNavLinkLeave}
            >
              首頁
            </a>
          </Link>
          <Link href="/articles" legacyBehavior>
            <a 
              style={navLinkStyle} 
              onMouseEnter={handleNavLinkHover} 
              onMouseLeave={handleNavLinkLeave}
            >
              關心你啲牙
            </a>
          </Link>
          <Link href="/promotions" legacyBehavior>
            <a 
              style={navLinkStyle} 
              onMouseEnter={handleNavLinkHover} 
              onMouseLeave={handleNavLinkLeave}
            >
              優惠牙
            </a>
          </Link>
          <Link href="/report" legacyBehavior>
            <a 
              style={navLinkStyle} 
              onMouseEnter={handleNavLinkHover} 
              onMouseLeave={handleNavLinkLeave}
            >
              報錯
            </a>
          </Link>
        </nav>
        
        <div style={footerCopyrightStyle}>
          <p>© {currentYear} 牙GoGo. 版權所有</p>
          <p>數據僅供參考，詳情請致電診所查詢</p>
        </div>
      </div>
      
      <div style={footerDisclaimerStyle}>
        <p>聯絡我們：<a href="mailto:smilehkgba@gmail.com" style={linkStyle}>smilehkgba@gmail.com</a></p>
        <p>免責聲明：本平台提供資訊僅供參考，實際診所資訊請以官方為準。</p>
      </div>
    </footer>
  );
};

export default Footer;