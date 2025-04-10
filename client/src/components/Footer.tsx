import React from 'react';

// 使用行內樣式，不再依賴外部CSS
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const footerStyle = {
    backgroundColor: '#0f172a',
    color: '#94a3b8',
    padding: '2rem 1rem',
    marginTop: '3rem',
    borderTop: '1px solid #1e293b'
  };
  
  const footerContentStyle = {
    display: 'flex',
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    flexWrap: 'wrap' as const,
    maxWidth: '1200px',
    margin: '0 auto',
    gap: '2rem'
  };
  
  const footerBrandStyle = {
    marginBottom: '1.5rem'
  };
  
  const footerBrandTitleStyle = {
    color: '#ffaa40',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: '0 0 0.5rem 0'
  };
  
  const footerBrandSloganStyle = {
    color: '#ffbb66',
    fontSize: '0.9rem',
    margin: '0'
  };
  
  const footerCopyrightStyle = {
    textAlign: 'right' as const,
    fontSize: '0.9rem'
  };
  
  const footerDisclaimerStyle = {
    marginTop: '2rem',
    fontSize: '0.8rem',
    color: '#64748b',
    borderTop: '1px solid #1e293b',
    paddingTop: '1rem',
    textAlign: 'center' as const
  };
  
  const linkStyle = {
    color: '#ffaa40',
    textDecoration: 'none'
  };
  
  return (
    <footer style={footerStyle}>
      <div style={footerContentStyle}>
        <div style={footerBrandStyle}>
          <h3 style={footerBrandTitleStyle}>牙GoGo</h3>
          <p style={footerBrandSloganStyle}>至關心你啲牙既牙科資訊平台</p>
        </div>
        <div style={footerCopyrightStyle}>
          <p>© {currentYear} 牙GoGo. 版權所有</p>
          <p>數據僅供參考，詳情請致電診所查詢</p>
        </div>
      </div>
      
      <div style={footerDisclaimerStyle}>
        <p>聯絡我們：<a href="mailto:info@yagogo.com" style={linkStyle}>info@yagogo.com</a></p>
        <p>免責聲明：本平台提供資訊僅供參考，實際診所資訊請以官方為準。</p>
      </div>
    </footer>
  );
};

export default Footer;