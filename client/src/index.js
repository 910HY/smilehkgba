// 簡易加載腳本 - 解決模塊載入問題
console.log('牙GoGo - 正在初始化應用...');

// 給頁面添加一些基本內容
document.getElementById('root').innerHTML = `
<div style="font-family: 'Noto Sans TC', sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; line-height: 1.6;">
  <h1 style="color: #FF7A00; font-size: 28px; margin-bottom: 10px;">牙GoGo</h1>
  <h2 style="color: #FF9D45; font-size: 16px; margin-top: 0; margin-bottom: 30px;">至關心你啲牙既牙科資訊平台</h2>
  
  <div style="background-color: #1e293b; padding: 20px; border-radius: 8px; margin-bottom: 20px; color: #94a3b8;">
    <h3 style="color: white; margin-top: 0;">香港與大灣區牙科資訊</h3>
    <p>牙GoGo為你提供最全面的牙科診所資訊，讓你輕鬆尋找合適的牙科診所。</p>
    
    <h4 style="color: #FF9D45; margin-bottom: 10px;">搜尋地區</h4>
    <ul style="padding-left: 20px;">
      <li>港島區：中西區、灣仔區、東區、南區</li>
      <li>九龍區：油尖旺、深水埗、九龍城、黃大仙、觀塘</li>
      <li>新界區：西部、北部、東部、中部、離島</li>
      <li>大灣區：福田區、南山區、羅湖區、寶安區等</li>
    </ul>
  </div>
  
  <div style="text-align: center; margin: 30px 0;">
    <p>應用正在加載中，請稍候...</p>
    <div style="width: 50px; height: 50px; border: 5px solid #FF7A00; border-radius: 50%; border-top-color: transparent; margin: 0 auto; animation: spin 1s linear infinite;"></div>
  </div>
  
  <style>
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    body {
      background-color: #0f172a;
      color: white;
      margin: 0;
      padding: 0;
    }
  </style>
</div>
`;

// 載入主應用程式
setTimeout(() => {
  try {
    // 嘗試動態載入模塊
    const script = document.createElement('script');
    script.src = '/src/main.tsx';
    script.type = 'module';
    document.body.appendChild(script);
    console.log('正在嘗試載入主應用...');
  } catch (error) {
    console.error('載入主應用時出錯:', error);
    document.getElementById('root').innerHTML += `
      <div style="background-color: #7f1d1d; color: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
        <h3>加載錯誤</h3>
        <p>應用加載時遇到問題。請稍後重試或聯絡管理員。</p>
        <p>錯誤信息: ${error.message || '未知錯誤'}</p>
      </div>
    `;
  }
}, 1000);