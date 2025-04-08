// 啟動開發服務器
import { execSync } from 'child_process';

console.log('📦 啟動開發服務器...');
try {
  // 嘗試清理可能正在運行的進程
  try {
    execSync('pkill -f static-server.js || true', { stdio: 'inherit' });
    console.log('已停止之前可能運行的靜態伺服器');
  } catch (cleanupError) {
    // 忽略清理錯誤
  }
  
  // 等待短暫的時間讓端口釋放
  execSync('sleep 2', { stdio: 'inherit' });
  
  // 使用靜態服務器而不是Vite開發服務器
  execSync('node static-server.js', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ 啟動失敗:', error);
  process.exit(1);
}