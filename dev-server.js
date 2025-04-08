// 開發服務器，使用簡單的 Express 服務器
import { exec } from 'child_process';

// 啟動簡單的 Express 服務器
async function startDevServer() {
  console.log('正在啟動簡易服務器...');
  
  // 使用 Node.js 運行簡易服務器
  const serverProcess = exec('node simple-server.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`啟動服務器出錯: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`服務器錯誤: ${stderr}`);
      return;
    }
    console.log(`服務器輸出: ${stdout}`);
  });
  
  // 將服務器輸出流轉到控制台
  serverProcess.stdout.pipe(process.stdout);
  serverProcess.stderr.pipe(process.stderr);
  
  // 為了保持進程活躍，返回一個永不解決的 Promise
  return new Promise(() => {});
}

startDevServer().catch((err) => {
  console.error('啟動開發服務器時出錯:', err);
  process.exit(1);
});