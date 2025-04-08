// 啟動開發服務器
import { execSync } from 'child_process';

console.log('📦 啟動開發服務器...');
try {
  // 使用靜態服務器而不是Vite開發服務器
  execSync('node static-server.js', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ 啟動失敗:', error);
  process.exit(1);
}