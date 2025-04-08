// 啟動腳本
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 檢查 client/dist 目錄是否存在，如果不存在，構建客戶端
const distPath = path.join(__dirname, 'client/dist');
if (!fs.existsSync(distPath)) {
  console.log('客戶端 dist 目錄不存在，正在構建客戶端...');
  exec('cd client && npx vite build', (error, stdout, stderr) => {
    if (error) {
      console.error(`構建客戶端時出錯: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`構建客戶端錯誤輸出: ${stderr}`);
      return;
    }
    console.log(`構建客戶端輸出: ${stdout}`);
    startServer();
  });
} else {
  startServer();
}

function startServer() {
  console.log('正在啟動服務器...');
  // 使用動態導入
  import('./server.js').catch(err => {
    console.error('無法導入服務器模塊:', err);
  });
}