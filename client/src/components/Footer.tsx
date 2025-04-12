import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-20 py-8 border-t border-gray-800 text-[#94a3b8]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link href="/" legacyBehavior>
              <a className="flex items-center">
                <img src="/logo.png" alt="牙GoGo Logo" className="h-8 w-8 mr-2" />
                <span className="text-lg font-semibold text-[#ffaa40]">牙GoGo</span>
              </a>
            </Link>
            <p className="mt-2 text-sm max-w-md">
              牙GoGo是香港牙科資訊平台，為用戶提供全面的牙科服務資訊，包括診所資料、洗牙價錢、牙醫推介等實用資訊。
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 md:gap-20">
            <div>
              <h4 className="text-[#ffaa40] font-semibold mb-3">資訊導航</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" legacyBehavior>
                    <a className="hover:text-[#ffaa40] transition-colors">診所搜尋</a>
                  </Link>
                </li>
                <li>
                  <Link href="/articles" legacyBehavior>
                    <a className="hover:text-[#ffaa40] transition-colors">牙科健康資訊</a>
                  </Link>
                </li>
                <li>
                  <Link href="/promotions" legacyBehavior>
                    <a className="hover:text-[#ffaa40] transition-colors">牙科優惠</a>
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-[#ffaa40] font-semibold mb-3">關於我們</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="mailto:info@yagogo.hk" className="hover:text-[#ffaa40] transition-colors">
                    聯絡我們
                  </a>
                </li>
                <li>
                  <Link href="/privacy-policy" legacyBehavior>
                    <a className="hover:text-[#ffaa40] transition-colors">私隱政策</a>
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" legacyBehavior>
                    <a className="hover:text-[#ffaa40] transition-colors">服務條款</a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8 pt-8 border-t border-gray-800 text-xs">
          <p>© {currentYear} 牙GoGo. 版權所有。</p>
          <p className="mt-1">本網站信息僅供參考，不構成任何診療建議。請向專業牙醫諮詢具體健康問題。</p>
        </div>
      </div>
    </footer>
  );
}