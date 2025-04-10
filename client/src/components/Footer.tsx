import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>牙GoGo</h3>
          <p>至關心你啲牙既牙科資訊平台</p>
        </div>
        <div className="footer-copyright">
          <p>© {currentYear} 牙GoGo. 版權所有</p>
          <p>數據僅供參考，詳情請致電診所查詢</p>
        </div>
      </div>
      
      <div className="footer-disclaimer">
        <p>聯絡我們：<a href="mailto:info@yagogo.com">info@yagogo.com</a></p>
        <p>免責聲明：本平台提供資訊僅供參考，實際診所資訊請以官方為準。</p>
      </div>
    </footer>
  );
};

export default Footer;